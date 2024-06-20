import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { Paciente } from '../models/paciente';
import { MODEL, SERVICE } from '../constants/api';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {
  readonly URL: string = MODEL.PACIENTE
  headers: HttpHeaders;

  constructor(private http: HttpClient) {
    const token = localStorage.getItem('token');
    this.headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getPacientes(): Observable<Paciente[]> {
    return this.http.get<Paciente[]>( this.URL + SERVICE.GET, { headers: this.headers });
  }

  getPaciente(id:number): Observable<Paciente> {
    return this.http.get<Paciente>( this.URL + SERVICE.GETBY + id, { headers: this.headers });
  }

  insertPaciente(form:any) {
    return this.http.post<Paciente>(this.URL + SERVICE.POST, form);
  }

  updatePaciente(form:any, id:number) {
    return this.http.put<Paciente>(this.URL + SERVICE.PUT + id, form, { headers: this.headers });
  }

  deletePaciente(id:number) {
    return this.http.delete<Paciente>(this.URL + SERVICE.DELETE + id, { headers: this.headers });
  }
}
