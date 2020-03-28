import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThlComponent } from './thl.component';

describe('ThlComponent', () => {
  let component: ThlComponent;
  let fixture: ComponentFixture<ThlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
