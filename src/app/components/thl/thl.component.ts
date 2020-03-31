import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ThlDistrictData } from '../../service/patientdata';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { ThlService } from '../../service/thl.service';

@Component({
  selector: 'app-thl',
  templateUrl: './thl.component.html',
  styleUrls: ['./thl.component.css']
})
export class ThlComponent implements OnInit {

  @ViewChild('start', {static: false}) startRef: ElementRef;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  dataSource: MatTableDataSource<ThlDistrictData>;
  displayedColumns: string[] = ['name', 'count'];


  constructor(private thlService: ThlService,) {
      this.thlService.updatedSource.subscribe(status => {
        if (status) {
          this.update();
        }
      });
  }

  ngOnInit() {
    this.update()
  }

  update() {
    this.dataSource = new MatTableDataSource<ThlDistrictData>(this.thlService.districtDataArray);
    setTimeout(() => {
          this.dataSource.paginator = this.paginator;
        }, 0);

    setTimeout(() => {
      this.startRef.nativeElement.scrollIntoView({behavior: 'smooth', block: 'start'});
        }, 10);
  }
}
