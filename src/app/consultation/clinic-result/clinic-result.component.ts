import { Component, OnInit } from '@angular/core';
import { ConsultationService } from '../../common/services/consultation.service';
import { MatDialog } from '@angular/material';
import { LoadModalComponent } from '../../common/modals/load-modal/load-modal.component';
import { ContentMessageComponent } from '../../common/modals/content-message/content-message.component';

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
    const dialgRef = this.dialog.open(LoadModalComponent, { width: '350px', height: '400px',
      data: { message: 'Cangando ubicación de su centro de salud'}});

    this.data = this.consultationService.getPacienteData();

    await this.consultationService.getCluesLocationByCluesKey(this.data.complement.CLUES.CLUES)
    .toPromise().then((cluesData: any) => {
      dialgRef.close();
      if (cluesData) {
        this.cluesData = cluesData;
        console.log(cluesData);
      } else {
        this.dialog.open(ContentMessageComponent,
          { width: '350px', height: '400px', data: { title: 'Ups! Lo sentimos', icon: 'cancel',
          message: 'No se ha encontrado ubicación del centro de salud',
          color: 'red'}});
      }

    }).catch(error => {

      dialgRef.close();
      this.dialog.open(ContentMessageComponent,
        { width: '350px', height: '400px', data: { title: 'Ups! Lo sentimos', icon: 'error',
        message: 'Ha ocurrido un problema en nuestros servidores. Intente más tarde',
        color: 'red'}});
    });

    dialgRef.close();


    this.isReady = true;
    // console.log(this.data);
  }

}
