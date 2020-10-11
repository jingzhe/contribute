import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ResultComponent } from './components/result/result.component';
import { ThlComponent } from './components/thl/thl.component';
import { HospitalComponent } from './components/hospital/hospital.component';
import { FeedbackComponent } from './components/feedback/feedback.component';
import { PreviousComponent } from './components/previous/previous.component';

const routes: Routes = [
  { path: 'result', component: ResultComponent },
  { path: 'thl', component: ThlComponent },
  { path: 'hospital', component: HospitalComponent },
  { path: 'feedback', component: FeedbackComponent },
  { path: 'previous', component: PreviousComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
