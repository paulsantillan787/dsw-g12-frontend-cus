import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  readonly BASE_URL: string = 'http://localhost:5000/usuarios';

  constructor(private http: HttpClient) { }

  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.BASE_URL}/get`);
  }

  insert(form: any) {
    return this.http.post<Usuario>(`${this.BASE_URL}/insert`, form);
  }

  update(form: any) {
    return this.http.put<Usuario>(`${this.BASE_URL}/update`, form);
  }

  delete(usuario: Usuario) {
    return this.http.delete(`${this.BASE_URL}/delete/${usuario.documento}`);
  }

  login(form: any) {// Reemplaza esto con el endpoint de inicio de sesión de tu API
    return this.http.post(`${this.BASE_URL}/login`, form);
  }
}
