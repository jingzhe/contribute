import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { WholeData, PatientData, DisplayData, CountryData, DayData, DayInfo } from './patientdata';

@Injectable({
    providedIn: 'root'
})

export class DataService {

  //endpoint = 'https://w3qa5ydb4l.execute-api.eu-west-1.amazonaws.com/prod/finnishCoronaData';
  endpoint = 'https://w3qa5ydb4l.execute-api.eu-west-1.amazonaws.com/prod/finnishCoronaData/v2';
  wholeDataMap: any = {};
  currentDisplayData: DisplayData = null;
  confirmedNumber: number;
  recoveredNumber: number;
  deathNumber: number;
  todayInfo: any = {};
  generalInfo: any = {};

  updatedSource = new BehaviorSubject('');

  constructor(private http: HttpClient) { }

  getAllStats(): Observable<void> {
      const repoUrl = `${this.endpoint}`;
      return this.http.get(repoUrl).pipe(
          map((res: Response) => {
          let testData: unknown = res;
          let wholeData: WholeData = testData as WholeData;
          this.confirmedNumber = wholeData.confirmed.length;
          this.recoveredNumber = wholeData.recovered.length;
          this.deathNumber = wholeData.deaths.length;
          this.convertConfirmed2Map(wholeData.confirmed);
          this.convertRecovered2Map(wholeData.recovered);
          this.convertDeaths2Map(wholeData.deaths);
          this.calculateTodayInfo();
          this.calculateGeneralInfo();
          }),
        catchError(this.errorMgmt)
    );
  }

  convertConfirmed2Map(dataArray: PatientData[]) {
    dataArray.forEach(patientData => {
      let district = patientData.healthCareDistrict ? patientData.healthCareDistrict : 'Unspecified';
      if (this.wholeDataMap[district] === undefined) {
        this.wholeDataMap[district] = new WholeData;
      }
      this.wholeDataMap[district].confirmed.push(patientData);
    });
  }

  convertRecovered2Map(dataArray: PatientData[]) {
    dataArray.forEach(patientData => {
      let district = patientData.healthCareDistrict ? patientData.healthCareDistrict : 'Unspecified';
      if (this.wholeDataMap[district] === undefined) {
        this.wholeDataMap[district] = new WholeData;
      }
      this.wholeDataMap[district].recovered.push(patientData);
    });
  }
  convertDeaths2Map(dataArray: PatientData[]) {
    dataArray.forEach(patientData => {
      let district = patientData.healthCareDistrict ? patientData.healthCareDistrict : 'Unspecified';
      if (this.wholeDataMap[district] === undefined) {
        this.wholeDataMap[district] = new WholeData;
      }
      this.wholeDataMap[district].deaths.push(patientData);
    });
  }

  calculateTodayInfo() {
    let today = new Date();
    today.setDate(today.getDate() - 1);
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();
    let todayDate = yyyy + '-' + mm + '-' + dd;

    for(let [key]  of Object.entries(this.wholeDataMap)) {
       this.todayInfo[key] = 0;
    }

    for (let [key, value] of Object.entries(this.wholeDataMap)) {
      let wholeData = value as WholeData;
      wholeData.confirmed.forEach(patientData => {
        // calculate by date
        let dateString = patientData.date.substring(0, 10);
        if (todayDate === dateString) {
          this.todayInfo[key]++;
        }
      });
    }
  }

  calculateGeneralInfo() {
    for (let [key, value] of Object.entries(this.wholeDataMap)) {
      let wholeData = value as WholeData;
      this.generalInfo[key] = wholeData.confirmed.length - wholeData.deaths.length - wholeData.recovered.length;
    }
  }

  convert2DisplayData(dataArray: PatientData[]): DisplayData {
    let displayData = new DisplayData;
    let countryMap = {};
    let dateMap = {};
    displayData.confirmedCount = dataArray.length;
    dataArray.forEach(patientData => {
      let sourceCountry;
      if (patientData.infectionSourceCountry && patientData.infectionSourceCountry.length > 0) {
        sourceCountry = patientData.infectionSourceCountry;
      } else {
        sourceCountry = 'Unknown';
      }

      // calculate by source country
      if (countryMap[sourceCountry] === undefined) {
        countryMap[sourceCountry] = 1;
      } else {
        countryMap[sourceCountry]++;
      }

      // calculate by date
      let dateString = patientData.date.substring(0, 10);
      if (dateMap[dateString] === undefined) {
        dateMap[dateString] = 1;
      } else {
        dateMap[dateString]++;
      }

      if (displayData.dateDetailsMap[dateString] === undefined) {
        displayData.dateDetailsMap[dateString] = new WholeData;
      }
      displayData.dateDetailsMap[dateString].confirmed.push(patientData);
    });

    for (let [key, value] of Object.entries(countryMap)) {
      let countryData = new CountryData;
      countryData.name = key;
      countryData.count = +value;
      displayData.confirmedCountries.push(countryData);
    }

    // update lastDay
    let dateArray = Object.keys(dateMap);
    dateArray = dateArray.sort();
    let lastDayStr = dateArray[dateArray.length - 1];
    displayData.lastDay = new DayData;
    displayData.lastDay.date = lastDayStr;
    displayData.lastDay.count = dateMap[lastDayStr];

    if (countryMap['FIN'] > 0 || countryMap['Unknown'] > 0) {
      displayData.pandemic = true;
    }
    return displayData;
  }

  getDataByDistrict(district: string): Observable<DisplayData> {
    if (!this.wholeDataMap[district]) {
      this.currentDisplayData = new DisplayData;
      this.currentDisplayData.districtName = district;
      this.currentDisplayData.confirmedCount = 0;
      this.currentDisplayData.deathCount = 0;
      this.currentDisplayData.recoveredCount = 0;

      this.updatedSource.next(district);
      return of(this.currentDisplayData);
    }

    this.currentDisplayData = this.convert2DisplayData(this.wholeDataMap[district].confirmed);
    this.currentDisplayData.districtName = district;
    this.currentDisplayData.deathCount = this.wholeDataMap[district].deaths.length;
    this.currentDisplayData.recoveredCount = this.wholeDataMap[district].recovered.length;

    // update dayInfoArray
    for (let [key, value] of Object.entries(this.currentDisplayData.dateDetailsMap)) {
      let dayInfo = new DayInfo;
      let dayWholeData = value as WholeData;
      let data = this.convert2DisplayData(dayWholeData.confirmed);
      dayInfo.confirmedCount = data.confirmedCount;
      dayInfo.confirmedCountries = data.confirmedCountries;
      dayInfo.date = key;
      this.currentDisplayData.dayInfoArray.push(dayInfo);
    }
    this.currentDisplayData.dayInfoArray.reverse();

    this.updatedSource.next(district);
    return of(this.currentDisplayData);
  }

  // Error handling
  errorMgmt(error: HttpErrorResponse) {
      let errorMessage = '';
      if (error.error instanceof ErrorEvent) {
          // Get client-side error
          errorMessage = error.error.message;
      } else {
          // Get server-side error
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      }
      console.log(errorMessage);
      return throwError(errorMessage);
  }

}
