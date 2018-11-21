import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import { PermissionService } from './permission.service';
import { Observable } from 'rxjs';

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

  /**
  * Obtiene todas las clues del estado de yucatán por default
  */
  getAllCluesLocation() {
    return this.http.get(`http://localhost/sissy/Paciente/PacientesFoliosSP/GetAllCluesLocation`);
  }

  /**
   * Obtiene la promesa de posición actual del dispositivo
   */
  getCurrentPosition(): Promise<Geoposition> {
    return this.geolocation.getCurrentPosition();

  }
  /**
   * Obtiene el observable de la posición actual del dispositivo
   */
  getWatchPosition(): Observable<Geoposition> {
    return this.geolocation.watchPosition();
  }
}
