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
}
