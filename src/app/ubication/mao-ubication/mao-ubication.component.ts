import { Component, OnInit } from '@angular/core';
import { UbicationService } from '../../common/services/ubication.service';
import { MatDialog } from '@angular/material';
import { ContentMessageComponent } from '../../common/modals/content-message/content-message.component';

@Component({
  selector: 'app-mao-ubication',
  templateUrl: './mao-ubication.component.html',
  styleUrls: ['./mao-ubication.component.scss']
})
export class MaoUbicationComponent implements OnInit {

  isReady = false;
  cluesLocation: any[] = [];

  constructor(private ubicationService: UbicationService,
    private dialog: MatDialog) { }

  async ngOnInit() {
    await this.ubicationService.getAllCluesLocation().toPromise()
    .then((locations: any[]) => {
      this.cluesLocation = locations;
      console.table(location);
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
