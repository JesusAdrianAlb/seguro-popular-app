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
  cluesData: any;

  constructor(private consultationService: ConsultationService) { }

  async ngOnInit() {
    this.data = this.consultationService.getPacienteData();
    this.cluesData = await this.consultationService.getCluesLocationByCluesKey(this.data.complement.CLUES.CLUES)
      .toPromise().then((data) => {
        return data;
      }).catch(error => {
        console.log(error);
      });


    this.isReady = true;
    // console.log(this.data.complement);
  }

}
