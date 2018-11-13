import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { PermissionService } from './permission.service';

@Injectable({
  providedIn: 'root'
})
export class UbicationService {

  currentPosition: any;
  isWeb = false;
  isAndriod = false;
  isIos = false;

  constructor(private http: HttpClient,
    private geolocation: Geolocation,
    private permission: PermissionService) { }

  getAllCluesLocation() {
    return this.http.get(`http://localhost/sissy/Paciente/PacientesFoliosSP/GetAllCluesLocation`);
  }

  async getCurrentPosition() {
    // await this.geolocation.getCurrentPosition().then((data) => {
    //   this.currentPosition = data.coords;
    //   if (this.isWeb) {
    //     // this.generateMapWeb(this.currentPosition);
    //   } else {

    //     // this.generateMap(this.currentPosition);
    //   }
    // }).catch(error => {
    //   console.log(error);
    // });
    // this.suscriptions.push(this.geolocation.watchPosition().subscribe((data) => {
    //   this.currentPosition = data.coords;
    //   // this.generateMap(this.currentPosition);
    // }));
  }
}
