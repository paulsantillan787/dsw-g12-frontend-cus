import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Especialista } from '../models/especialista';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EspecialistaService {
  readonly BASE_URL: string = 'http://localhost:5000/especialistas';
  headers: HttpHeaders;

  constructor(private http: HttpClient) {
    const token = localStorage.getItem('token');
    this.headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getEspecialistas(): Observable<Especialista[]> {
    return this.http.get<Especialista[]>(`${this.BASE_URL}/get`, { headers: this.headers });
  }

  insert(form: any) {
    return this.http.post<Especialista>(`${this.BASE_URL}/insert`, form, { headers: this.headers });
  }

  update(form: any) {
    return this.http.put<Especialista>(`${this.BASE_URL}/update`, form, { headers: this.headers });
  }

  delete(especialista: Especialista) {
    return this.http.delete(`${this.BASE_URL}/delete/${especialista.id_especialista}`, { headers: this.headers });
  }

}
