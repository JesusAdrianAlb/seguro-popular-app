import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ConsultationService {

  constructor(private http: HttpClient) { }

  getValidity(curp: string, folio: string) {
    const CURP = curp.toUpperCase();
    const FOLIO = folio;

    return this.http.get(`http://localhost/sissy/Paciente/PacientesFoliosSP/GetInfoWebService?CURP=${CURP}&SP=${FOLIO}`);
  }
}
