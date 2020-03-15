import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { WholeData, PatientData, DisplayData, CountryData, DayData, DayInfo } from './patientdata';

@Injectable({
    providedIn: 'root'
})

export class DataService {

  endpoint = '/prod/finnishCoronaData';
  wholeDataMap: any = {};
  currentDisplayData: DisplayData;
  confirmedNumber: number;

  updatedSource = new BehaviorSubject('');

  constructor(private http: HttpClient) { }

  getAllStats(): Observable<void> {
      const repoUrl = `${this.endpoint}`;
      return this.http.get(repoUrl).pipe(
          map((res: Response) => {
          let testData: unknown = res;
          let wholeData: WholeData = testData as WholeData;
          this.confirmedNumber = wholeData.confirmed.length;
          this.convertConfirmed2Map(wholeData.confirmed);
          }),
        catchError(this.errorMgmt)
    );
  }

  convertConfirmed2Map(dataArray: PatientData[]) {
    for (let i = 0; i < dataArray.length; i++) {
      let patientData = dataArray[i];
      if (this.wholeDataMap[patientData.healthCareDistrict] === undefined) {
        this.wholeDataMap[patientData.healthCareDistrict] = new WholeData;
      }
      this.wholeDataMap[patientData.healthCareDistrict].confirmed.push(patientData);
    }
  }

  convert2DisplayData(dataArray: PatientData[]): DisplayData {
    let displayData = new DisplayData;
    let countryMap = {};
    let dateMap = {};
    displayData.confirmedCount = dataArray.length;
    for (let i = 0; i < dataArray.length; i++) {
      let patientData = dataArray[i];
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
    }

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
    this.currentDisplayData = this.convert2DisplayData(this.wholeDataMap[district].confirmed);
    this.currentDisplayData.districtName = district;

    // update lastDayInfo
    this.currentDisplayData.lastDayInfo = new DayInfo;
    let lastData = this.convert2DisplayData(this.currentDisplayData.dateDetailsMap[this.currentDisplayData.lastDay.date].confirmed);
    this.currentDisplayData.lastDayInfo.confirmedCount = lastData.confirmedCount;
    this.currentDisplayData.lastDayInfo.confirmedCountries = lastData.confirmedCountries;
    this.currentDisplayData.lastDayInfo.date = this.currentDisplayData.lastDay.date;

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
