import { Component, ViewChild, HostListener, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSidenav } from '@angular/material/sidenav';
import { DataService } from './service/data.service';
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
  refreshTimer: number;
  @ViewChild('sidenav', { static: true }) sidenav: MatSidenav;

  constructor(
    private dataService: DataService,
    private spinnerService: Ng4LoadingSpinnerService,
    private router: Router) {
  }

  ngOnInit() {
    this.dataService.getAllStats()
        .subscribe(() => {
          this.confirmedNumber = this.dataService.confirmedNumber;
          this.recoveredNumber = this.dataService.recoveredNumber;
          this.deathNumber = this.dataService.deathNumber;
          this.todayInfo = this.dataService.todayInfo;
        });

    this.refreshTimer = window.setTimeout(() =>  this.refreshPage(), REFRESH_TIMEOUT);
  }

  refreshPage() {
    this.refreshTimer = window.setTimeout(() =>  this.refreshPage(), REFRESH_TIMEOUT);
    this.router.navigate([`/`]);
  }

  onGetData(name: string): void {
    this.dataService.getDataByDistrict(name)
      .subscribe(displayData => {
        this.router.navigate([`/result`]);
      });
  }

  getTodayNumber(name: string): number {
    return this.todayInfo[name] || 0;
  }
}
