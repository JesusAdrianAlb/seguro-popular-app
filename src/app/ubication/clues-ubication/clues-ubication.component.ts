import { Component, OnInit, OnDestroy } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { CoordinatesData } from '../../models/geolocation.model';


@Component({
  selector: 'app-clues-ubication',
  templateUrl: './clues-ubication.component.html',
  styleUrls: ['./clues-ubication.component.scss']
})
export class CluesUbicationComponent implements OnInit, OnDestroy {

  dataGeo: CoordinatesData;
  suscriptions: Subscription[]  = [];
  currentPosition: CoordinatesData;
  isAndroid = false;

  constructor(private geolocation: Geolocation, private platform: Platform) {
    console.log('Entro al componente');
   }

  ngOnInit() {

    this.platform.ready().then(() => {
      if (this.platform.is('android')) {
        this.isAndroid = true;
      } else if (this.platform.is('ios')) {
        console.log('ios');
      } else {
        console.log('web');
      }
    });
    this.geolocation.getCurrentPosition().then((data) => {
      this.dataGeo = data.coords;
      console.log(this.dataGeo, 'CurrentPosition');
    }).catch(error => {
      console.log('Error position', error);
    });

    this.suscriptions.push(this.geolocation.watchPosition().subscribe((data) => {
      this.currentPosition = data.coords;
      console.log(this.currentPosition, 'WatchPosition');
    }));

  }

  ngOnDestroy() {
    if (this.suscriptions.length > 0) {
      this.suscriptions.forEach(suscription => {
        suscription.unsubscribe();
      });
    }
  }

}
