import { NgModule, ErrorHandler, Injectable, Injector } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { Pro } from '@ionic/pro';
import { IonicErrorHandler } from 'ionic-angular';

import { Geolocation } from '@ionic-native/geolocation/ngx';

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
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule
  ],
  providers: [
    StatusBar,
    Geolocation,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    IonicErrorHandler,
    [{provide: ErrorHandler, useClass: CustumErrorHandler}],
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
