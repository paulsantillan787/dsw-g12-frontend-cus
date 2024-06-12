import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  readonly BASE_URL: string = 'http://localhost:5000/usuarios';
  headers: HttpHeaders;

  constructor(private http: HttpClient) {
    const token = localStorage.getItem('token');
    this.headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.BASE_URL}/get`, { headers: this.headers });
  }

  insert(form: any) {
    return this.http.post<Usuario>(`${this.BASE_URL}/insert`, form, { headers: this.headers });
  }

  update(form: any) {
    return this.http.put<Usuario>(`${this.BASE_URL}/update`, form, { headers: this.headers });
  }

  delete(usuario: Usuario) {
    return this.http.delete(`${this.BASE_URL}/delete/${usuario.documento}`, { headers: this.headers });
  }

  login(form: any) {// Reemplaza esto con el endpoint de inicio de sesión de tu API
    return this.http.post(`${this.BASE_URL}/login`, form);
  }
}
