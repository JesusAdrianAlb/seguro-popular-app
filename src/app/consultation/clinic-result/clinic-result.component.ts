import { Component, OnInit } from '@angular/core';
import { ConsultationService } from '../../common/services/consultation.service';

@Component({
  selector: 'app-clinic-result',
  templateUrl: './clinic-result.component.html',
  styleUrls: ['./clinic-result.component.scss']
})
export class ClinicResultComponent implements OnInit {

  isReady = false;
  data: any;

  constructor(private consultationService: ConsultationService) { }

  ngOnInit() {
    this.data = this.consultationService.getPacienteData();
    this.isReady = true;
    // console.log(this.data);
  }

}
