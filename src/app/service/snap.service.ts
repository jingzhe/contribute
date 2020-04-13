import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { HospitalRawData, HospitalData,  } from './patientdata';

@Injectable({
    providedIn: 'root'
})

export class SnapService {

  //endpoint = 'http://localhost:8080/snapshot';
  //endpoint = 'https://hidden-basin-27129.herokuapp.com/snapshot'
  endpoint = 'http://ec2-3-17-73-27.us-east-2.compute.amazonaws.com:8080/snapshot';
  updatedSource = new BehaviorSubject('');

  constructor(private http: HttpClient) {
  }

  getSnapData(): Observable<any> {
      const repoUrl = `${this.endpoint}`;
      return this.http.get(repoUrl).pipe(
          map((res: Response) => {
          return res;
          }));
  }
}
