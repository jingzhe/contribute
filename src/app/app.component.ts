import { Component, ViewChild, HostListener, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSidenav } from '@angular/material/sidenav';
import { DataService } from './service/data.service';
import { ThlService } from './service/thl.service';
import { HospitalService } from './service/hospital.service';
import { FeedbackService } from './service/feedback.service';
import { Router } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

const REFRESH_TIMEOUT = 30 * 60 * 1000;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  opened = true;
  confirmedNumber: number;
  recoveredNumber: number;
  deathNumber: number;
  todayInfo: any = {};
  generalInfo: any = {};
  refreshTimer: number;
  counter: number;
  @ViewChild('sidenav', { static: true }) sidenav: MatSidenav;

  constructor(
    private dataService: DataService,
    private thlService: ThlService,
    private hospitalService: HospitalService,
    private spinnerService: Ng4LoadingSpinnerService,
    private feedbackService: FeedbackService,
    private router: Router) {
  }

  ngOnInit() {
    this.spinnerService.show();
    this.dataService.getAllStats()
        .subscribe(() => {
          this.confirmedNumber = this.dataService.confirmedNumber;
          this.recoveredNumber = this.dataService.recoveredNumber;
          this.deathNumber = this.dataService.deathNumber;
          this.todayInfo = this.dataService.todayInfo;
          this.generalInfo = this.dataService.generalInfo;
          this.counter = this.dataService.counter;
          this.spinnerService.hide();
        });

    this.refreshTimer = window.setTimeout(() =>  this.refreshPage(), REFRESH_TIMEOUT);
  }

  refreshPage() {
    this.refreshTimer = window.setTimeout(() =>  this.refreshPage(), REFRESH_TIMEOUT);
    this.router.navigate([`/`]);
  }

  onClickThl() {
    this.thlService.getDistrictData()
      .subscribe(() => {
        this.router.navigate([`/thl`]);
      })
  }

  onClickHospital() {
    this.spinnerService.show();
    this.hospitalService.getHospitalData()
      .subscribe(() => {
        this.spinnerService.hide();
        this.router.navigate([`/hospital`]);
      })
  }

  onClickFeedback() {
    this.spinnerService.show();
    this.feedbackService.getFeedback()
      .subscribe(() => {
        this.spinnerService.hide();
        this.router.navigate([`/feedback`]);
      })
  }

  onGetData(name: string): void {
    this.spinnerService.show();
    this.dataService.getDataByDistrict(name)
      .subscribe(displayData => {
        this.spinnerService.hide();
        this.router.navigate([`/result`]);
      });
  }

  getTodayNumber(name: string): string {
    if (this.todayInfo[name]) {
      return this.todayInfo[name] > 0 ? '(+' + this.todayInfo[name] + ')' : '(' + this.todayInfo[name] + ')';
    }
    return '';
  }

  getTotalTodayNumber(): string {
    const todayAll = this.confirmedNumber - this.dataService.allSnapshot;
    if (todayAll > 0) {
      return '(+' + todayAll + ')';
    }
    return '';
  }

  getDistrictColor(name: string): string {
    if (this.todayInfo[name] > 0) {
      return 'warn';
    } else if(this.todayInfo[name] < 0) {
      return 'primary';
    } else if (this.generalInfo[name] > 0) {
      return 'accent';
    }

    return 'primary';
  }
}
