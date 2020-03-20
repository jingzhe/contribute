import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DataService } from '../../service/data.service';
import { WholeData, DisplayData, CountryData } from '../../service/patientdata';
import { Router } from '@angular/router'
import { MatPaginator, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit {

  @ViewChild('start', {static: false}) startRef: ElementRef;

  displayData: DisplayData;
  dataSource: MatTableDataSource<CountryData>;
  dayDataSourceArray: MatTableDataSource<CountryData>[] = [];
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  displayedColumns: string[] = ['name', 'count'];

  constructor(private router: Router, private dataService: DataService) {
    if (!this.dataService.currentDisplayData) {
      this.router.navigate(['../']);
    } else {
      this.dataService.updatedSource.subscribe(name => {
        this.update();
      });
    }
  }

  ngOnInit() {

  }

  update() {
    this.dayDataSourceArray = [];
    this.displayData = this.dataService.currentDisplayData;
    if (!this.displayData) {
      return;
    }
    this.dataSource = new MatTableDataSource<CountryData>(this.displayData.confirmedCountries);
    for (let i = 0; i < this.displayData.dayInfoArray.length; i++) {
      let dayDataSource = new MatTableDataSource<CountryData> (this.displayData.dayInfoArray[i].confirmedCountries);
      this.dayDataSourceArray.push(dayDataSource);
    }
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
    }, 0);

    setTimeout(() => {
      this.startRef.nativeElement.scrollIntoView({behavior: 'smooth', block: 'start'});
    }, 10);
  }

}
