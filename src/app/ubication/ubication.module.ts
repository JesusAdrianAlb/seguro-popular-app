import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CluesUbicationComponent } from './clues-ubication/clues-ubication.component';
import { BasicModule } from '../common/basic.module';

@NgModule({
  imports: [
    CommonModule,
    BasicModule,
    RouterModule.forChild([{
      path: '',
      component: CluesUbicationComponent
    }])
  ],
  declarations: [CluesUbicationComponent],
  providers: [
  ]
})
export class CluesUbicationModule { }
