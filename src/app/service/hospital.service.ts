import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { HospitalRawData, HospitalData,  } from './patientdata';

@Injectable({
    providedIn: 'root'
})

export class HospitalService {

  endpoint = 'https://w3qa5ydb4l.execute-api.eu-west-1.amazonaws.com/prod/finnishCoronaHospitalData';
  dayDataMap: any = {};
  updatedSource = new BehaviorSubject('');

  constructor(private http: HttpClient) {
  }

  getHospitalData(): Observable<void> {
      this.dayDataMap = {};
      const repoUrl = `${this.endpoint}`;
      return this.http.get(repoUrl).pipe(
          map((res: Response) => {
          let testData: any = res;
          let dataArray =  testData.hospitalised as HospitalRawData[];
          this.parseHospitalData(dataArray);
          this.updatedSource.next('done');
          }),
        catchError(this.errorMgmt)
    );
  }

  parseHospitalData(dataArray: any) {
    dataArray.forEach (rawData => {
      let date = rawData.date.substring(0, 10);
      let hospitalData = new HospitalData();
      hospitalData.area = rawData.area;
      hospitalData.inHospital = rawData.totalHospitalised;
      hospitalData.inWard = rawData.inWard;
      hospitalData.inIcu = rawData.inIcu;
      hospitalData.dead = rawData.dead;
      if (this.dayDataMap[date] === undefined) {
        this.dayDataMap[date] = [];
      }
      this.dayDataMap[date].push(hospitalData);
    })
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
