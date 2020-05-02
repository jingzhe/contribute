import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FeedbackData } from '../../service/patientdata';
import { FeedbackService } from '../../service/feedback.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {
  @ViewChild('start', {static: false}) startRef: ElementRef;
  feedbackArray: FeedbackData[] = [];
  name: string;
  subject: string;
  content: string;

  constructor(private feedbackService: FeedbackService,) {
     this.feedbackService.updatedSource.subscribe(status => {
       if (status) {
         this.update();
       }
     });
  }

  ngOnInit() {
      if (this.feedbackService.feedbackArray.length === 0) {
        this.feedbackService.getFeedback()
          .subscribe(() => this.update())
      } else {
        this.update()
      }
  }
  update() {
    this.feedbackArray = this.feedbackService.feedbackArray;
    this.name = "";
    this.subject= "";
    this.content = "";
    setTimeout(() => {
      this.startRef.nativeElement.scrollIntoView({behavior: 'smooth', block: 'start'});
        }, 10);
  }

  onSubmitFeedback() {
    this.feedbackService.addFeedback(this.name, this.subject, this.content)
        .subscribe(() => this.update());
  }
}
