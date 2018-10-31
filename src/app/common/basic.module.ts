import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material.module';
import { IonicModule } from '@ionic/angular';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    MaterialModule,
    FlexLayoutModule,
  ],
  exports: [
    IonicModule,
    MaterialModule,
    FlexLayoutModule,
  ],
  declarations: []
})
export class BasicModule { }
