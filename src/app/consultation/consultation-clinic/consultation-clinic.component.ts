import { Component, OnInit, OnDestroy } from '@angular/core';
import { ConsultationService } from '../../common/services/consultation.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';
import { ContentMessageComponent } from '../../common/modals/content-message/content-message.component';
import { LoadModalComponent } from '../../common/modals/load-modal/load-modal.component';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-consultation-clinic',
  templateUrl: './consultation-clinic.component.html',
  styleUrls: ['./consultation-clinic.component.scss']
})
export class ConsultationClinicComponent implements OnInit, OnDestroy {

  suscriptions: Subscription[] = [];

  constructor(private dialog: MatDialog, private router: Router,
    private consultationService: ConsultationService) { }

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
    const dialgRef = this.dialog.open(LoadModalComponent, { width: '350px', height: '400px'});
    this.consultationService.getValidity(form.value.curp, form.value.folio)
      .toPromise().then((data: any) => {
        console.log(data);
        if (data.data && data.data.length === 1) {
          // console.log(data.data);
          data.data.forEach(element => {

            this.consultationService.setPacienteData({
              curp: element.PACIENTE.CURP, folio: element.SEGURO_POPULAR.FOLIO,
              nombre: element.PACIENTE.NOMBRE, ap_materno: element.PACIENTE.AP_MATERNO,
              ap_paterno: element.PACIENTE.AP_PATERNO, complement: element
            });
            dialgRef.close();
            this.router.navigate(['/consultation/clinic-results']);
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
