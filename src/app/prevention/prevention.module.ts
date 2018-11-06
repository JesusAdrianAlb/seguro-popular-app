import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreventionComponent } from './prevention/prevention.component';
import { PreventionMenuComponent } from './prevention-menu/prevention-menu.component';
import { BasicModule } from '../common/basic.module';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: PreventionComponent,
    children: [
      { path: '', component: PreventionMenuComponent },
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
    PreventionComponent,
    PreventionMenuComponent,
  ]
})
export class PreventionModule { }
