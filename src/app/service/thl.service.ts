import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { ThlDistrictData } from './patientdata';

@Injectable({
    providedIn: 'root'
})

export class ThlService {

  endpoint = 'https://api.codetabs.com/v1/proxy?quest=https://sampo.thl.fi/pivot/prod/en/epirapo/covid19case/fact_epirapo_covid19case.json';
  districtDataArray: ThlDistrictData[] = [];
  districtNameMap = {};
  updatedSource = new BehaviorSubject('');

  constructor(private http: HttpClient) {
    this.districtNameMap['Whole Finland'] = '2331';
    this.districtNameMap['Oulu'] = '1801';
    this.districtNameMap['Helsinki'] = '2225';
    this.districtNameMap['Pirkanmaa'] = '529';
    this.districtNameMap['Lappi'] = '2119';
    this.districtNameMap['Southwest'] = '211';
    this.districtNameMap['Central Finland'] = '1377';
    this.districtNameMap['Åland'] = '105';
    this.districtNameMap['Satakunta'] = '317';
    this.districtNameMap['Kanta-Häme'] = '423';
    this.districtNameMap['Päijät-Häme'] = '635';
    this.districtNameMap['Kymenlaakso'] = '741';
    this.districtNameMap['South Karelia'] = '847';
    this.districtNameMap['South Savo'] = '953';
    this.districtNameMap['Itä-Savo'] = '119';
    this.districtNameMap['North Karelia'] = '1165';
    this.districtNameMap['North Savo'] = '1271';
    this.districtNameMap['South Ostrobothnia'] = '1483';
    this.districtNameMap['Vaasa'] = '1589';
    this.districtNameMap['Central Ostrobothnia'] = '1695';
    this.districtNameMap['Kainuu'] = '1907';
    this.districtNameMap['Länsi-Pohja'] = '2013';
  }

  getDistrictData(): Observable<void> {
      this.districtDataArray = [];
      const repoUrl = `${this.endpoint}`;
      return this.http.get(repoUrl).pipe(
          map((res: Response) => {
          let testData: any = res;
          let valueMap =  testData.dataset.value;
          this.parseValueMap(valueMap);
          this.updatedSource.next('done');
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
