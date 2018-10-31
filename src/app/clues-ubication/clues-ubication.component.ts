import { Component, OnInit, OnDestroy } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Subscription } from 'rxjs';
import { CoordinatesData } from '../models/geolocation.model';

@Component({
  selector: 'app-clues-ubication',
  templateUrl: './clues-ubication.component.html',
  styleUrls: ['./clues-ubication.component.scss']
})
export class CluesUbicationComponent implements OnInit, OnDestroy {

  dataGeo: CoordinatesData;
  suscriptions: Subscription[]  = [];
  currentPosition: CoordinatesData;

  constructor(private geolocation: Geolocation) { }

  ngOnInit() {
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
