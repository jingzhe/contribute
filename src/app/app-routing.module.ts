import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ResultComponent } from './components/result/result.component';
import { ThlComponent } from './components/thl/thl.component';

const routes: Routes = [
  { path: 'result', component: ResultComponent },
  { path: 'thl', component: ThlComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
