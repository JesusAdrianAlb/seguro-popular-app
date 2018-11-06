import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HealthComponentComponent } from './health-component/health-component.component';
import { HealthMenuComponent } from './health-menu/health-menu.component';
import { BasicModule } from '../common/basic.module';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: HealthComponentComponent,
    children: [
      { path: '', component: HealthMenuComponent}
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    BasicModule,
    RouterModule.forChild(routes),
  ],
  declarations: [
    HealthComponentComponent,
    HealthMenuComponent,
  ]
})
export class HealthModule { }
