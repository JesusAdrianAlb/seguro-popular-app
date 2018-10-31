import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CluesUbicationComponent } from './clues-ubication.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild([{
      path: '',
      component: CluesUbicationComponent
    }])
  ],
  declarations: [CluesUbicationComponent]
})
export class CluesUbicationModule { }
