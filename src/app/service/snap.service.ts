import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})

export class SnapService {

  //endpoint = 'http://localhost:8080/snapshot';
  endpoint = 'https://hidden-basin-27129.herokuapp.com/snapshot'
  //endpoint = 'http://ec2-3-17-73-27.us-east-2.compute.amazonaws.com:8080/snapshot';
  updatedSource = new BehaviorSubject('');

  constructor(private http: HttpClient) {
  }

  getSnapData(): Observable<any> {
      const repoUrl = `${this.endpoint}`;
      const headers = {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache'
      };
      return this.http.get(repoUrl, { headers }).pipe(
          map((res: Response) => {
          return res;
          }));
  }
}
