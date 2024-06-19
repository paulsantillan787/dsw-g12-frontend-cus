import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { Clasificacion } from '../models/clasificacion';
import { MODEL, SERVICE } from '../constants/api';

@Injectable({
  providedIn: 'root'
})
export class ClasificacionService {
  readonly URL: string = MODEL.CLASIFICACION;
  headers: HttpHeaders;

  constructor(private http: HttpClient) {
    const token = localStorage.getItem('token');
    this.headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getClasificaciones(): Observable<Clasificacion[]> {
    return this.http.get<Clasificacion[]>(this.URL + SERVICE.GET, { headers: this.headers });
  }

  insertClasificacion(form: any) {
    return this.http.post<Clasificacion>(this.URL + SERVICE.POST, form, { headers: this.headers });
  }

  updateClasificacion(form: any, id: number) {
    return this.http.put<Clasificacion>(this.URL + SERVICE.PUT + id, form, { headers: this.headers });
  }

  deleteClasificacion(id: number) {
    return this.http.delete<Clasificacion>(this.URL + SERVICE.DELETE + id, { headers: this.headers });
  }
}
