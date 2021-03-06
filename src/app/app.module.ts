import { NgModule, ErrorHandler, Injectable, Injector } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { Pro } from '@ionic/pro';
import { IonicErrorHandler, Platform } from 'ionic-angular';

import { Geolocation } from '@ionic-native/geolocation/ngx';
import { BasicModule } from './common/basic.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SidenavListComponent } from './navigation/sidenav-list/sidenav-list.component';
import { HeaderComponent } from './navigation/header/header.component';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { FeatureDisabledComponent } from './common/modals/feature-disabled/feature-disabled.component';
import { FeatureDeniedComponent } from './common/modals/feature-denied/feature-denied.component';
import { GoogleMaps } from '@ionic-native/google-maps/ngx';
import { ConsultationService } from './common/services/consultation.service';
import { HttpClientModule } from '@angular/common/http';
import { ContentMessageComponent } from './common/modals/content-message/content-message.component';
import { LoadModalComponent } from './common/modals/load-modal/load-modal.component';
import { UbicationService } from './common/services/ubication.service';
import { PermissionService } from './common/services/permission.service';
import { AuthService } from './common/services/auth.service';


Pro.init('decca4ae', {
  appVersion: '0.0.1'
});


@Injectable()
export class CustumErrorHandler implements ErrorHandler {
  ionicErrorHandler: IonicErrorHandler;

  constructor(injector: Injector) {
    try {
      this.ionicErrorHandler = injector.get(IonicErrorHandler);
    } catch (e) {

    }
  }

  handleError(error: any) {
    Pro.monitoring.handleNewError(error);
    // this.ionicErrorHandler && this.ionicErrorHandler.handleError(error);
  }

}


@NgModule({
  declarations: [
    AppComponent,
    SidenavListComponent,
    HeaderComponent,
  ],
  entryComponents: [
    FeatureDisabledComponent,
    FeatureDeniedComponent,
    ContentMessageComponent,
    LoadModalComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    BasicModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    StatusBar,
    Geolocation,
    Diagnostic,
    SplashScreen,
    Platform,
    GoogleMaps,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    IonicErrorHandler,
    [{provide: ErrorHandler, useClass: CustumErrorHandler}],
    ConsultationService,
    UbicationService,
    PermissionService,
    AuthService,
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {}
