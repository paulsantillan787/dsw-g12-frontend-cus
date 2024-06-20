import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { Usuario } from '../models/usuario';
import { MODEL, SERVICE } from '../constants/api';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  readonly URL: string = MODEL.USUARIO
  headers: HttpHeaders;
  constructor(private http: HttpClient) {
    const token = localStorage.getItem('token');
    this.headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>( this.URL + SERVICE.GET, { headers: this.headers });
  }

  getUsuario(documento: string): Observable<Usuario> {
    return this.http.get<Usuario>( this.URL + SERVICE.GETBY + documento, { headers: this.headers });
  }

  insertUsuario(form:any) {
    return this.http.post<Usuario>(this.URL + SERVICE.POST, form);
  }

  updateUsuario(form:any, id:number) {
    return this.http.put<Usuario>(this.URL + SERVICE.PUT + id, form, { headers: this.headers });
  }

  deleteUsuario(id:number) {
    return this.http.delete<Usuario>(this.URL + SERVICE.DELETE + id, { headers: this.headers });
  }

  login(form:any) {
    return this.http.post<Usuario>(this.URL + SERVICE.LOGIN, form);
  }

  validator(correo:string) {
    return this.http.post<Usuario>(this.URL + SERVICE.VALIDATOR, correo);
  }
}
