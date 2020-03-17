import { Component, ViewChild, HostListener, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSidenav } from '@angular/material/sidenav';
import { DataService } from './service/data.service';
import { Router } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

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
  @ViewChild('sidenav', { static: true }) sidenav: MatSidenav;

  constructor(
    private dataService: DataService,
    private spinnerService: Ng4LoadingSpinnerService,
    private router: Router) {
  }

  ngOnInit() {
    if (window.innerWidth < 768) {
      this.sidenav.fixedTopGap = 100;
      this.opened = false;
    } else {
      this.sidenav.fixedTopGap = 100;
      this.opened = true;
    }

    this.dataService.getAllStats()
        .subscribe(() => {
          this.confirmedNumber = this.dataService.confirmedNumber;
          this.recoveredNumber = this.dataService.recoveredNumber;
          this.deathNumber = this.dataService.deathNumber;
        });
  }

  onGetData(name: string): void {
    this.dataService.getDataByDistrict(name)
      .subscribe(displayData => {
        this.router.navigate([`/result`]);
      });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (event.target.innerWidth < 768) {
      this.sidenav.fixedTopGap = 55;
      this.opened = false;
    } else {
      this.sidenav.fixedTopGap = 55
      this.opened = true;
    }
  }

  isBiggerScreen() {
    const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    if (width < 768) {
      return true;
    } else {
      return false;
    }
  }
}
