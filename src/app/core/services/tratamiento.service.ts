import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { Tratamiento } from '../models/tratamiento';
import { MODEL, SERVICE } from '../constants/api';

@Injectable({
  providedIn: 'root'
})
export class TratamientoService {
  readonly URL: string = MODEL.TRATAMIENTO
  headers: HttpHeaders;
  constructor(private http: HttpClient) {const token = localStorage.getItem('token');
    this.headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getTratamientos(): Observable<Tratamiento[]> {
    return this.http.get<Tratamiento[]>( this.URL + SERVICE.GET, { headers: this.headers });
  }

  getTratamiento(id:number): Observable<Tratamiento> {
    return this.http.get<Tratamiento>(this.URL + SERVICE.GETBY + id, { headers: this.headers });
  }

  insertTratamiento(form:any) {
    return this.http.post<Tratamiento>(this.URL + SERVICE.POST, form, { headers: this.headers });
  }

  updateTratamiento(form:any, id:number) {
    return this.http.put<Tratamiento>(this.URL + SERVICE.PUT + id, form, { headers: this.headers });
  }

  deleteTratamiento(id:number) {
    return this.http.delete<Tratamiento>(this.URL + SERVICE.DELETE + id, { headers: this.headers });
  }
}
