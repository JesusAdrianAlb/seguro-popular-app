import { Component, OnInit } from '@angular/core';
import { UbicationService } from '../../common/services/ubication.service';
import { MatDialog } from '@angular/material';
import { ContentMessageComponent } from '../../common/modals/content-message/content-message.component';
import { MarkerData } from '../../common/models/marker-data.models';

@Component({
  selector: 'app-mao-ubication',
  templateUrl: './mao-ubication.component.html',
  styleUrls: ['./mao-ubication.component.scss']
})
export class MaoUbicationComponent implements OnInit {

  isReady = false;
  cluesLocation: any[] = [];

  cluesSelected: any[] = [];
  markers: MarkerData[] = [];

  constructor(private ubicationService: UbicationService,
    private dialog: MatDialog) { }

  async ngOnInit() {
    await this.ubicationService.getAllCluesLocation().toPromise()
    .then((locations: any[]) => {
      this.cluesLocation = locations;
      this.cluesSelected = this.cluesLocation.filter( x => x.ID_INSTITUCION === '1');
      for (const clues of this.cluesSelected) {
        const marker: MarkerData = {
          longitude: clues.LONGITUD,
          latitud: clues.LATITUD,
          title: clues.INSTITUCION,
          clues: clues.INSTITUCION,
          data: clues,
          animacion: 'DROP',
          icon: 'red'
        };

        this.markers = [...this.markers, marker];

      }
      // console.table(this.markers);
      console.table(this.cluesLocation);
    }).catch(error => {
      console.log(error);
      this.dialog.open(ContentMessageComponent,
        { width: '350px', height: '400px', data: { title: 'Ups! Lo sentimos', icon: 'error',
        message: 'Ha ocurrido un error en nuestros servidores. favor intente más tarde',
        color: 'red'}});
    });

    this.isReady = true;
  }

}
