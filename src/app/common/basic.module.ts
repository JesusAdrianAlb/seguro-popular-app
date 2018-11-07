import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material.module';
import { IonicModule } from '@ionic/angular';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FeatureDisabledComponent } from './modals/feature-disabled/feature-disabled.component';
import { FeatureDeniedComponent } from './modals/feature-denied/feature-denied.component';
import { FooterComponent } from '../navigation/footer/footer.component';
import { FormsModule } from '@angular/forms';
import { CustomMaxLengthDirective } from './directives/custom-max-length.directive';
import { CustomMinLengthDirective } from './directives/custom-min-length.directive';

@NgModule({
  imports: [
    IonicModule,
    FormsModule,
    CommonModule,
    MaterialModule,
    FlexLayoutModule,
  ],
  exports: [
    IonicModule,
    MaterialModule,
    FlexLayoutModule,
    FormsModule,
    FeatureDisabledComponent,
    FeatureDeniedComponent,
    FooterComponent,
    CustomMaxLengthDirective,
    CustomMinLengthDirective,
  ],
  declarations: [
    FeatureDisabledComponent,
    FeatureDeniedComponent,
    FooterComponent,
    CustomMaxLengthDirective,
    CustomMinLengthDirective
  ]
})
export class BasicModule { }
