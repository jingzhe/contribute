import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})

export class CounterService {

  //endpoint = 'http://localhost:8080/counter';
  endpoint = 'https://hidden-basin-27129.herokuapp.com/counter'
  updatedSource = new BehaviorSubject('');

  constructor(private http: HttpClient) {
  }

  getCounter(): Observable<any> {
      const repoUrl = `${this.endpoint}`;
      return this.http.get(repoUrl).pipe(
          map((res: Response) => {
          return res;
          }));
  }
}
