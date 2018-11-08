import { Component, OnInit } from '@angular/core';
import { ConsultationService } from '../../common/services/consultation.service';

@Component({
  selector: 'app-consultation-results',
  templateUrl: './consultation-results.component.html',
  styleUrls: ['./consultation-results.component.scss']
})
export class ConsultationResultsComponent implements OnInit {

  isReady = false;
  data: any;

  constructor(private consultationService: ConsultationService) { }

  ngOnInit() {
    this.data = this.consultationService.getPacienteData();
    this.isReady = true;
    // console.log(this.data.complement);
  }

}
