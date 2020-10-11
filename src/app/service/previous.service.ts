import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})

export class PreviousService {

  //endpoint = 'http://localhost:8080/old-snapshot';
  endpoint = 'https://hidden-basin-27129.herokuapp.com/old-snapshot'
  updatedSource = new BehaviorSubject('');

  constructor(private http: HttpClient) {
  }

  getPreviousSnapData(date): Observable<any> {
      const repoUrl = `${this.endpoint}`;
      const headers = {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache'
      };

      return this.http.get(repoUrl, {
          headers: headers,
          params: new HttpParams().set('date', date)
        }).pipe(
          map((res: Response) => {
          return res;
          }));
  }
}
