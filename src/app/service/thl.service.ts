import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { ThlDistrictData } from './patientdata';

@Injectable({
    providedIn: 'root'
})

export class ThlService {

  //endpoint = 'https://sampo.thl.fi/pivot/prod/en/epirapo/covid19case/fact_epirapo_covid19case.json';
  endpoint = '/pivot/prod/en/epirapo/covid19case/fact_epirapo_covid19case.json';
  districtDataArray: ThlDistrictData[] = [];
  districtNameMap = {};

  constructor(private http: HttpClient) {
    this.districtNameMap['Whole Finland'] = '1187';
    this.districtNameMap['Oulu'] = '917';
    this.districtNameMap['Helsinki'] = '1133';
    this.districtNameMap['Pirkanmaa'] = '269';
    this.districtNameMap['Lappi'] = '1079';
    this.districtNameMap['Southwest'] = '107';
    this.districtNameMap['Central Finland'] = '701';
    this.districtNameMap['Åland'] = '53';
    this.districtNameMap['Satakunta'] = '161';
    this.districtNameMap['Kanta-Häme'] = '215';
    this.districtNameMap['Päijät-Häme'] = '323';
    this.districtNameMap['Kymenlaakso'] = '377';
    this.districtNameMap['South Karelia'] = '431';
    this.districtNameMap['South Savo'] = '485';
    this.districtNameMap['Itä-Savo'] = '539';
    this.districtNameMap['North Karelia'] = '593';
    this.districtNameMap['North Savo'] = '647';
    this.districtNameMap['South Ostrobothnia'] = '755';
    this.districtNameMap['Vaasa'] = '809';
    this.districtNameMap['Central Ostrobothnia'] = '863';
    this.districtNameMap['Kainuu'] = '971';
    this.districtNameMap['Länsi-Pohja'] = '1025';
  }

  getDistrictData(): Observable<void> {
      const repoUrl = `${this.endpoint}`;
      return this.http.get(repoUrl).pipe(
          map((res: Response) => {
          let testData: any = res;
          let valueMap =  testData.dataset.value;
          this.parseValueMap(valueMap);
          }),
        catchError(this.errorMgmt)
    );
  }

  parseValueMap(valueMap: any) {
    for (let [key, value] of Object.entries(this.districtNameMap)) {
       let districtData = new ThlDistrictData;
       districtData.name = key;
       districtData.count = valueMap[value as string];
       this.districtDataArray.push(districtData);
    }

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
