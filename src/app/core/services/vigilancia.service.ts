import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { Vigilancia } from '../models/vigilancia';
import { MODEL, SERVICE } from '../constants/api';

@Injectable({
  providedIn: 'root'
})
export class VigilanciaService {
  readonly URL: string = MODEL.VIGILANCIA
  headers: HttpHeaders;
  constructor(private http: HttpClient) {
    const token = localStorage.getItem('token');
    this.headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getVigilancias(): Observable<Vigilancia[]> {
    return this.http.get<Vigilancia[]>( this.URL + SERVICE.GET, { headers: this.headers });
  }

  insertVigilancia(form:any) {
    return this.http.post<Vigilancia>(this.URL + SERVICE.POST, form, { headers: this.headers });
  }

  updateVigilancia(form:any, id:number) {
    return this.http.put<Vigilancia>(this.URL + SERVICE.PUT + id, form, { headers: this.headers });
  }

  deleteVigilancia(id:number) {
    return this.http.delete<Vigilancia>(this.URL + SERVICE.DELETE + id, { headers: this.headers });
  }

  getVigilanciasDTO(): Observable<any[]> {
    return this.http.get<any[]>(this.URL + SERVICE.DTO + SERVICE.GET, { headers: this.headers });
  }
}
