import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material.module';
import { IonicModule } from '@ionic/angular';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FeatureDisabledComponent } from './modals/feature-disabled/feature-disabled.component';
import { FeatureDeniedComponent } from './modals/feature-denied/feature-denied.component';
import { FooterComponent } from '../navigation/footer/footer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomMaxLengthDirective } from './directives/custom-max-length.directive';
import { CustomMinLengthDirective } from './directives/custom-min-length.directive';
import { ContentMessageComponent } from './modals/content-message/content-message.component';
import { ValidityStatusPipe } from './pipes/validity-status.pipe';
import { LoadModalComponent } from './modals/load-modal/load-modal.component';
import { CluesUbicationComponent } from '../ubication/clues-ubication/clues-ubication.component';
import { DirectionsMapComponent } from './shared/directions-map/directions-map.component';

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
    ReactiveFormsModule,
    FeatureDisabledComponent,
    FeatureDeniedComponent,
    FooterComponent,
    CustomMaxLengthDirective,
    CustomMinLengthDirective,
    ContentMessageComponent,
    ValidityStatusPipe,
    LoadModalComponent,
    CluesUbicationComponent,
    DirectionsMapComponent,
  ],
  declarations: [
    FeatureDisabledComponent,
    FeatureDeniedComponent,
    ContentMessageComponent,
    FooterComponent,
    CustomMaxLengthDirective,
    CustomMinLengthDirective,
    ValidityStatusPipe,
    LoadModalComponent,
    CluesUbicationComponent,
    DirectionsMapComponent,
  ]
})
export class BasicModule { }
