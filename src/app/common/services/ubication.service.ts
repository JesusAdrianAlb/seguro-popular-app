import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UbicationService {

  constructor(private http: HttpClient) { }

  getAllCluesLocation() {
    return this.http.get(`http://localhost/sissy/Pacientes/PacientesFoliosSP/GetAllCluesLocation`);
  }
}
