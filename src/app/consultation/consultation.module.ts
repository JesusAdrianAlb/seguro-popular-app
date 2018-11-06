import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsultationComponentComponent } from './consultation-component/consultation-component.component';
import { Routes, RouterModule } from '@angular/router';
import { BasicModule } from '../common/basic.module';
import { ConsultationMenuComponent } from './consultation-menu/consultation-menu.component';
import { ConsultationFolioComponent } from './consultation-folio/consultation-folio.component';
import { ConsultationClinicComponent } from './consultation-clinic/consultation-clinic.component';


const routes: Routes = [
  {
    path: '',
    component: ConsultationComponentComponent,
    children: [
      { path: '', component: ConsultationMenuComponent },
      { path: 'folio', component: ConsultationFolioComponent },
      { path: 'clinic', component: ConsultationClinicComponent },
    ]
  }
];

@NgModule({
  imports: [
    BasicModule,
    CommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    ConsultationComponentComponent,
    ConsultationMenuComponent,
    ConsultationFolioComponent,
    ConsultationClinicComponent,
  ],
  providers: [

  ]
})
export class ConsultationModule { }
