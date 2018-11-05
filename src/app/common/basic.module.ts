import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material.module';
import { IonicModule } from '@ionic/angular';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FeatureDisabledComponent } from './modals/feature-disabled/feature-disabled.component';
import { FeatureDeniedComponent } from './modals/feature-denied/feature-denied.component';
import { FooterComponent } from '../navigation/footer/footer.component';

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
    FeatureDisabledComponent,
    FeatureDeniedComponent,
    FooterComponent
  ],
  declarations: [
    FeatureDisabledComponent,
    FeatureDeniedComponent,
    FooterComponent
  ]
})
export class BasicModule { }
