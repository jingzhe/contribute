import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, EMPTY } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { FeedbackData } from './patientdata';

@Injectable({
    providedIn: 'root'
})

export class FeedbackService {

  //feedbackEndpoint = 'http://localhost:8080/feedback';
  //addEndpoint = 'http://localhost:8080/add-feedback';
  feedbackEndpoint = 'https://hidden-basin-27129.herokuapp.com/feedback'
  addEndpoint = 'https://hidden-basin-27129.herokuapp.com/add-feedback';
  updatedSource = new BehaviorSubject('');
  feedbackArray: FeedbackData[] = [];
  headers = {
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache'
  };

  constructor(private http: HttpClient) {
  }

  getFeedback(): Observable<void> {
    const repoUrl = `${this.feedbackEndpoint}`;

    return this.http.get(repoUrl, { headers: this.headers }).pipe(
        map((res: any) => {
          this.feedbackArray = res as FeedbackData[];
        }));
  }

  addFeedback(name: string, subject: string, content: string): Observable<void> {
    if (!subject || !content) {
      return EMPTY;
    }

    const repoUrl = `${this.addEndpoint}`;
    const payload = {
      name,
      subject,
      content
    }

    return this.http.post(repoUrl, payload, { headers: this.headers }).pipe(
        map((res: any) => {
          this.feedbackArray = res as FeedbackData[];
        }));
  }
}
