import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public appPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'List',
      url: '/list',
      icon: 'list'
    },
    {
      title: 'Geoposition',
      url: '/geoposition',
      icon: 'list'
    }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      console.log('ready');
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  // onCloseSideNav(sidenav: any) {
  //   // console.log(sidenav, 'close');
  //   sidenav.close();
  // }

  // ontoggleSideNav(sidenav: any) {
  //   console.log('toogle master', sidenav);
  //   sidenav.toogle();
  // }
}
