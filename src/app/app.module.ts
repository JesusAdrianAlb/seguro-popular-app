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
  declarations: [AppComponent, SidenavListComponent, HeaderComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    BasicModule,
    IonicModule.forRoot(),
    AppRoutingModule
  ],
  providers: [
    StatusBar,
    Geolocation,
    SplashScreen,
    Platform,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    IonicErrorHandler,
    [{provide: ErrorHandler, useClass: CustumErrorHandler}],
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {}
