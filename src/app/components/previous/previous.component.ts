import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { PreviousService } from '../../service/previous.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-previous',
  templateUrl: './previous.component.html',
  styleUrls: ['./previous.component.css']
})
export class PreviousComponent implements OnInit {
  @ViewChild('start', {static: false}) startRef: ElementRef;

  date: string;
  previousDateInfo: any = {};

  constructor(private previousService: PreviousService,
      private spinnerService: Ng4LoadingSpinnerService) { }

  ngOnInit() {
      setTimeout(() => {
        this.startRef.nativeElement.scrollIntoView({behavior: 'smooth', block: 'start'});
          }, 10);
  }

  onGetData(): void {
    this.spinnerService.show();
    this.previousService.getPreviousSnapData(this.date)
      .subscribe(previousInfo => {
        this.spinnerService.hide();
        this.previousDateInfo = previousInfo;
      });
  }

  getDistrictNumber(name: string): string {
    if (this.previousDateInfo && this.previousDateInfo[name]) {
      return this.previousDateInfo[name].number + this.getChangedText(this.previousDateInfo[name].change);
    }
    return '';
  }

  getChangedText(change: number): string {
    if (change == 0) {
      return "";
    } else if (change > 0) {
      return '(+' + change + ')';
    } else {
      return '(' + change + ')';
    }
  }

  getDistrictColor(name: string): string {
    if (this.previousDateInfo && this.previousDateInfo[name]) {
      if (this.previousDateInfo[name].change > 0) {
        return 'warn';
      } else if(this.previousDateInfo[name].change < 0) {
        return 'primary';
      } else if (this.previousDateInfo[name].change == 0) {
        return 'accent';
      }
    }
    return 'primary';
  }
}
