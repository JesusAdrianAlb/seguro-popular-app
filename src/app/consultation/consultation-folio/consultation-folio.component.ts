import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ConsultationService } from '../../common/services/consultation.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { LoadModalComponent } from '../../common/modals/load-modal/load-modal.component';
import { ContentMessageComponent } from '../../common/modals/content-message/content-message.component';

@Component({
  selector: 'app-consultation-folio',
  templateUrl: './consultation-folio.component.html',
  styleUrls: ['./consultation-folio.component.scss']
})
export class ConsultationFolioComponent implements OnInit, OnDestroy {

  suscriptions: Subscription[] = [];

  constructor(private dialog: MatDialog, private router: Router,
    private consultationService: ConsultationService) {  }

  ngOnInit() {
  }

  ngOnDestroy() {
    if (this.suscriptions.length > 0) {
      this.suscriptions.forEach( suscription => {
        suscription.unsubscribe();
      });
    }
  }

  onSubmit(form: NgForm) {

    // this.router.navigate(['/consultation/results']);
    const dialgRef = this.dialog.open(LoadModalComponent, { width: '350px', height: '400px'});
    this.consultationService.getValidity(form.value.curp, form.value.folio)
      .toPromise().then((data: any) => {
        // console.log(data);
        if (data.data && data.data.length === 1) {
          // console.log(data.data);
          data.data.forEach(element => {

            this.consultationService.setPacienteData({
              curp: element.PACIENTE.CURP, folio: element.SEGURO_POPULAR.FOLIO,
              nombre: element.PACIENTE.NOMBRE, ap_materno: element.PACIENTE.AP_MATERNO,
              ap_paterno: element.PACIENTE.AP_PATERNO, complement: element
            });
            dialgRef.close();
            this.router.navigate(['/consultation/results']);
          });

        } else {
          // Enviar mensaje de que vaya a su módulo más cercano
          dialgRef.close();
          this.dialog.open(ContentMessageComponent,
            { width: '350px', height: '400px', data: { title: 'Ups! Lo sentimos', icon: 'warning',
            message: 'El folio presenta una incidencia, favor de verificar en su módulo de seguro popular más cercano',
            color: 'yellow'}});
        }

      }).catch(error => {
        dialgRef.close();
        this.dialog.open(ContentMessageComponent,
          { width: '350px', height: '400px', data: { title: 'Ups! Lo sentimos', icon: 'error',
          message: 'Ha ocurrido un problema en nuestros servidores. Intente más tarde',
          color: 'red'}});
      });
  }

}
