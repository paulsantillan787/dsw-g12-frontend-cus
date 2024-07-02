import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { Diagnostico } from '../models/diagnostico';
import { MODEL, SERVICE } from '../constants/api';

@Injectable({
  providedIn: 'root'
})
export class DiagnosticoService {
  readonly URL: string = MODEL.DIAGNOSTICO
  headers: HttpHeaders;

  constructor(private http: HttpClient) {
    const token = localStorage.getItem('token');
    this.headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getDiagnosticos(): Observable<Diagnostico[]> {
    return this.http.get<Diagnostico[]>( this.URL + SERVICE.GET, { headers: this.headers });
  }

  getDiagnostico(id:number): Observable<Diagnostico> {
    return this.http.get<Diagnostico>(this.URL + SERVICE.GETBY + id, { headers: this.headers });
  }

  insertDiagnostico(form:any) {
    return this.http.post<Diagnostico>(this.URL + SERVICE.POST, form, { headers: this.headers });
  }

  updateDiagnostico(form:any, id:number) {
    return this.http.put<Diagnostico>(this.URL + SERVICE.PUT + id, form, { headers: this.headers });
  }

  deleteDiagnostico(id:number) {
    return this.http.delete<Diagnostico>(this.URL + SERVICE.DELETE + id, { headers: this.headers });
  }
}
