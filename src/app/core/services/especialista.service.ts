import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { Especialista } from '../models/especialista';
import { MODEL, SERVICE } from '../constants/api';

@Injectable({
  providedIn: 'root'
})
export class EspecialistaService {
  readonly URL: string = MODEL.ESPECIALISTA
  headers: HttpHeaders;

  constructor(private http: HttpClient) {
    const token = localStorage.getItem('token');
    this.headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getEspecialistas(): Observable<Especialista[]> {
    return this.http.get<Especialista[]>( this.URL + SERVICE.GET, { headers: this.headers });
  }

  getEspecialista(id:number): Observable<Especialista> {
    return this.http.get<Especialista>( this.URL + SERVICE.GETBY + id, { headers: this.headers });
  }

  insertEspecialista(form:any) {
    return this.http.post<Especialista>(this.URL + SERVICE.POST, form);
  }

  updateEspecialista(form:any, id:number) {
    return this.http.put<Especialista>(this.URL + SERVICE.PUT + id, form, { headers: this.headers });
  }

  deleteEspecialista(id:number) {
    return this.http.delete<Especialista>(this.URL + SERVICE.DELETE + id, { headers: this.headers });
  }
}
