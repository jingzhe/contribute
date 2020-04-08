import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HospitalData } from '../../service/patientdata';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { HospitalService } from '../../service/hospital.service';

@Component({
  selector: 'app-hospital',
  templateUrl: './hospital.component.html',
  styleUrls: ['./hospital.component.css']
})
export class HospitalComponent implements OnInit {

  @ViewChild('start', {static: false}) startRef: ElementRef;

  dayDataMap: any = {};
  dateList: string[] = [];
  dayDataSourceArray: MatTableDataSource<HospitalData>[] = [];
  displayedColumns: string[] = ['area', 'inHospital', 'inWard', 'inIcu', 'dead'];

  constructor(private hospitalService: HospitalService,) {
      this.hospitalService.updatedSource.subscribe(status => {
        if (status) {
          this.update();
        }
      });
  }

  ngOnInit() {
    if (Object.keys(this.hospitalService.dayDataMap).length === 0) {
      this.hospitalService.getHospitalData()
        .subscribe(() => this.update())
    } else {
      this.update()
    }
  }

  update() {
    this.dayDataSourceArray = [];
    this.dayDataMap = this.hospitalService.dayDataMap;
    this.dateList = Object.keys(this.dayDataMap).reverse();

    for (let [key, value] of Object.entries(this.dayDataMap)) {
      let dayDataSource = new MatTableDataSource<HospitalData> (value as HospitalData[]);
      this.dayDataSourceArray.push(dayDataSource);
    }
    this.dayDataSourceArray.reverse();
    setTimeout(() => {
      this.startRef.nativeElement.scrollIntoView({behavior: 'smooth', block: 'start'});
        }, 10);
  }
}
