import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ResultComponent } from './components/result/result.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from './material.module';
import { HttpClientModule, HttpClientJsonpModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { DataService } from './service/data.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { ThlComponent } from './components/thl/thl.component';
import { HospitalComponent } from './components/hospital/hospital.component';
import { FeedbackComponent } from './components/feedback/feedback.component';
import { NoCacheHeadersInterceptor } from './no-cache-headers-interceptor';
import { PreviousComponent } from './components/previous/previous.component';

@NgModule({
  declarations: [
    AppComponent,
    ResultComponent,
    ThlComponent,
    HospitalComponent,
    FeedbackComponent,
    PreviousComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    HttpClientModule,
    HttpClientJsonpModule,
    ReactiveFormsModule,
    FormsModule,
    Ng4LoadingSpinnerModule
  ],
  providers: [
    DataService,
    /*
    {
        provide: HTTP_INTERCEPTORS,
        useClass: NoCacheHeadersInterceptor,
        multi: true
    },
    */
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
