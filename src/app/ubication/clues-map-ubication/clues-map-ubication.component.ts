import { Component, OnInit, OnDestroy } from '@angular/core';
import { UbicationService } from '../../common/services/ubication.service';
import { MatDialog } from '@angular/material';
import { Geoposition } from '@ionic-native/geolocation/ngx';
import { Clues } from '../../common/models/clues.model';
import { Subscription, Observable } from 'rxjs';
import { MarkerData } from '../../common/models/marker-data.models';
import { ContentMessageComponent } from '../../common/modals/content-message/content-message.component';
import { LoadModalComponent } from '../../common/modals/load-modal/load-modal.component';

@Component({
  selector: 'app-clues-map-ubication',
  templateUrl: './clues-map-ubication.component.html',
  styleUrls: ['./clues-map-ubication.component.scss']
})
export class CluesMapUbicationComponent implements OnInit, OnDestroy {

  allClues: Clues[] = [];
  filterClues: Clues[] = [];
  currentPosition: Geoposition;
  suscriptions: Subscription[] = [];
  isReady = false;

  constructor(private ubicationService: UbicationService,
    private dialog: MatDialog) { }

  async ngOnInit() {
    // console.log('Hola');
    const dialogRef = this.dialog.open(LoadModalComponent, { width: '350px',
    data: { message: 'Buscando información de ubicacion'}});
    this.currentPosition = await this.ubicationService.getCurrentPosition();

    this.suscriptions.push(this.ubicationService.getAllCluesLocation()
      .subscribe( (data: Clues[]) => {

          dialogRef.close();

          if (data.length === 0) {
            this.dialog.open(ContentMessageComponent, { width: '350px',
            data: { title: 'Error', message: 'Ha ocurrido un error en nuestros servidores, intente más tarde',
            icon: 'error', color: 'red'}});
          } else {
            this.allClues = data;
            this.filterClues = this.allClues.filter( x => Math.abs(x.LATITUD - this.currentPosition.coords.latitude) < .1
              && Math.abs(x.LONGITUD - this.currentPosition.coords.longitude) < .1 && x.ID_INSTITUCION === '1');
              if (this.filterClues.length === 0) {
                this.filterClues = this.allClues.filter( x => Math.abs(x.LATITUD - this.currentPosition.coords.latitude) < .09
              && Math.abs(x.LONGITUD - this.currentPosition.coords.longitude) < .09 && x.ID_INSTITUCION === '1');
              }
            // console.table(this.currentPosition.coords);
            console.table(this.filterClues);
            this.isReady = true;
          }
      }));
  }

  ngOnDestroy() {
    if (this.suscriptions.length > 0) {
      this.suscriptions.forEach( suscription => {
        suscription.unsubscribe();
      });
    }
  }

  /**
   * Devuelve un arreglo de marcadores en base a las ubicaciones de la clues
   * @param clues Dato de clues de la API
   */
  getMarkersFromLocation(clues: Clues[]): MarkerData[] {

    const markers: MarkerData[] = [];
    for (const clue of clues) {
      const marker: MarkerData = {
        title: clue.INSTITUCION,
        longitude: clue.LONGITUD,
        latitud: clue.LATITUD,
        data: clue,
        clues: clue.INSTITUCION,
        animacion: 'DROP',
        icon: 'red'
      };

      markers.push(marker);
    }

    return markers;
  }


}
