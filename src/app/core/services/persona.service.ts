import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { Persona } from '../models/persona';
import { MODEL, SERVICE } from '../constants/api';

@Injectable({
  providedIn: 'root'
})
export class PersonaService {
  readonly URL: string = MODEL.PERSONA
  headers: HttpHeaders;
  constructor(private http: HttpClient) {
    const token = localStorage.getItem('token');
    this.headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getPersonas(): Observable<Persona[]> {
    return this.http.get<Persona[]>( this.URL + SERVICE.GET, { headers: this.headers });
  }

  insertPersona(form:any) {
    return this.http.post<Persona>(this.URL + SERVICE.POST, form);
  }

  updatePersona(form:any, documento:string) {
    return this.http.put<Persona>(this.URL + SERVICE.PUT + documento, form, { headers: this.headers });
  }

  deletePersona(documento:string) {
    return this.http.delete<Persona>(this.URL + SERVICE.DELETE + documento, { headers: this.headers });
  }
}
