import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TipoRol } from '../models/tipo_rol';

@Injectable({
  providedIn: 'root'
})
export class TipoRolService {
  readonly BASE_URL: string = 'http://localhost:5000/roles';


  constructor(private http: HttpClient) { }

  getRoles(): Observable<TipoRol[]> {
    return this.http.get<TipoRol[]>(`${this.BASE_URL}/get`);
  }

  insert(form: any) {
    return this.http.post<TipoRol>(`${this.BASE_URL}/insert`, form);
  }

  update(form: any) {
    return this.http.put<TipoRol>(`${this.BASE_URL}/update`, form);
  }

  delete(rol: TipoRol) {
    return this.http.delete(`${this.BASE_URL}/delete/${rol.id_tipo_rol}`);
  }
}
