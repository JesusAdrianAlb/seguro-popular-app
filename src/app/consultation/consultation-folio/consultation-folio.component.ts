import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ConsultationService } from '../../common/services/consultation.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-consultation-folio',
  templateUrl: './consultation-folio.component.html',
  styleUrls: ['./consultation-folio.component.scss']
})
export class ConsultationFolioComponent implements OnInit, OnDestroy {

  suscriptions: Subscription[] = [];

  constructor(private dialog: MatDialog,
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
    // this.suscriptions.push(this.consultationService.getValidity(form.value.curp, form.value.folio)
    // .subscribe((data) => {
    //   alert(data);
    // }));
    // alert(form.value.curp + '-' + form.value.folio);
    this.consultationService.getValidity(form.value.curp, form.value.folio)
      .toPromise().then((data) => {
        alert(data);
      }).catch(error => {
        alert(error.message);
        console.log(error);
      });
  }

}
