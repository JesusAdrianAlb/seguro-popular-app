import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ConsultationService {

  CURP: string;
  paciente: string;
  folio_sp: string;
  complementData: any;

  constructor(private http: HttpClient) { }

  getValidity(curp: string, folio: string) {
    const CURP = curp.toUpperCase();
    const FOLIO = folio;

    return this.http.get(`http://control.repssyuc.gob.mx/sissy/Paciente/PacientesFoliosSP/GetInfoWebService?CURP=${CURP}&SP=${FOLIO}`);
  }

  getCluesLocationByCluesKey(cluesKey: string) {
    return this.http.get(`http://control.repssyuc.gob.mx/sissy/Paciente/PacientesFoliosSP/GetCluesLocationByCluesKey?CLUES=${cluesKey}`);
  }

  setPacienteData(data: {
    curp: string; folio: string; ap_paterno: string; ap_materno: string;
    nombre: string; complement: any
  }) {
    // console.log(data);
    this.CURP = data.curp;
    this.folio_sp = data.folio;
    this.paciente = data.ap_paterno + ' ' + data.ap_materno + ' ' + data.nombre;
    this.complementData = data.complement;
  }

  getPacienteData() {
    return {
      curp: this.CURP,
      folio: this.folio_sp,
      paciente: this.paciente,
      complement: this.complementData
    };
  }
}
