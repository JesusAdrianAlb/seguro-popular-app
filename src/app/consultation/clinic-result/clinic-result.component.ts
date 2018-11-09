import { Component, OnInit } from '@angular/core';
import { ConsultationService } from '../../common/services/consultation.service';
import { MatDialog } from '@angular/material';
import { LoadModalComponent } from '../../common/modals/load-modal/load-modal.component';
import { ContentMessageComponent } from '../../common/modals/content-message/content-message.component';
import { MarkerData } from '../../common/models/marker-data.models';

@Component({
  selector: 'app-clinic-result',
  templateUrl: './clinic-result.component.html',
  styleUrls: ['./clinic-result.component.scss']
})
export class ClinicResultComponent implements OnInit {

  isReady = false;
  data: any;
  cluesData: any;

  constructor(private consultationService: ConsultationService,
    private dialog: MatDialog) { }

  async ngOnInit() {
    const dialgRefMap = this.dialog.open(LoadModalComponent, { width: '350px', height: '400px',
      data: { message: 'Cargando ubicación de su centro de salud'}});

    // dialgRefMap.close();

    this.data = this.consultationService.getPacienteData();
    console.log(this.data);
    await this.consultationService.getCluesLocationByCluesKey(this.data.complement.CLUES.CLUES)
    .toPromise().then((cluesData: any) => {
      if (cluesData) {
        this.cluesData = [{
          latitud: cluesData.LATITUD,
          longitude: cluesData.LONGITUD,
          direction: cluesData.DIRECCION
        }];
        console.log(cluesData);
        dialgRefMap.close();
        this.isReady = true;
      } else {
        this.dialog.open(ContentMessageComponent,
          { width: '350px', height: '400px', data: { title: 'Ups! Lo sentimos', icon: 'cancel',
          message: 'No se ha encontrado ubicación del centro de salud',
          color: 'red'}});
      }

    }).catch(error => {

      // dialgRefMap.close();
      this.dialog.open(ContentMessageComponent,
        { width: '350px', height: '400px', data: { title: 'Ups! Lo sentimos', icon: 'error',
        message: 'Ha ocurrido un problema en nuestros servidores. Intente más tarde',
        color: 'red'}});
    });

    // dialgRefMap.close();


    // this.isReady = false;
    // console.log(this.data);
  }

}
