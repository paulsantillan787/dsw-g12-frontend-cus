import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { Respuesta } from '../models/respuesta';
import { MODEL, SERVICE } from '../constants/api';

@Injectable({
  providedIn: 'root'
})
export class RespuestaService {
  readonly URL: string = MODEL.RESPUESTA
  headers: HttpHeaders;

  constructor(private http:HttpClient) {
    const token = localStorage.getItem('token');
    this.headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getRespuestas(): Observable<Respuesta[]> {
    return this.http.get<Respuesta[]>(this.URL + SERVICE.GET, { headers: this.headers });
  }

  getRespuestasByTest(id:any): Observable<Respuesta[]> {
    return this.http.get<Respuesta[]>(this.URL + SERVICE.GETBY + id, { headers: this.headers });
  }

  insertRespuesta(form:any) {
    return this.http.post<Respuesta>(this.URL + SERVICE.POST, form, { headers: this.headers });
  }

  updateRespuesta(form:any, id:number) {
    return this.http.put<Respuesta>(this.URL + SERVICE.PUT + id, form, { headers: this.headers });
  }

  deleteRespuesta(id:number) {
    return this.http.delete<Respuesta>(this.URL + SERVICE.DELETE + id, { headers: this.headers });
  }

  getRespuestasDTO(id:any): Observable<any> {
    return this.http.get(this.URL + SERVICE.DTO + SERVICE.GETBY + id, { headers: this.headers });
  }
}
