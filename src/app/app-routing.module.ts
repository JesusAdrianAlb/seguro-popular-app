import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InformationComponent } from './information/information.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: './home/home.module#HomePageModule'
  },
  {
    path: 'ubication',
    loadChildren: './ubication/ubication.module#CluesUbicationModule'
  },
  {
    path: 'prevention',
    loadChildren: './prevention/prevention.module#PreventionModule'
  },
  {
    path: 'consultation',
    loadChildren: './consultation/consultation.module#ConsultationModule'
  },
  {
    path: 'health',
    loadChildren: './health/health.module#HealthModule'
  },
  {
    path: 'information',
    loadChildren: './information/information.module#InformationModule'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
