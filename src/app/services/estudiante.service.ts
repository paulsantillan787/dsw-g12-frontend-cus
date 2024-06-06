import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Estudiante } from '../models/estudiante';

@Injectable({
  providedIn: 'root'
})
export class EstudianteService {
  readonly BASE_URL: string = 'http://localhost:5000/estudiantes';

  constructor(private http: HttpClient) { }

  getEstudiantes(): Observable<Estudiante[]> {
    return this.http.get<Estudiante[]>(`${this.BASE_URL}/get`);
  }

  insert(form: any) {
    return this.http.post<Estudiante>(`${this.BASE_URL}/insert`, form);
  }

  update(form: any) {
    return this.http.put<Estudiante>(`${this.BASE_URL}/update`, form);
  }

  delete(estudiante: Estudiante) {
    return this.http.delete(`${this.BASE_URL}/delete/${estudiante.cod_alumno}`);
  }
}
