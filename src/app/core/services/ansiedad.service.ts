import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { Ansiedad } from '../models/ansiedad';
import { MODEL, SERVICE } from '../constants/api';

@Injectable({
  providedIn: 'root'
})
export class AnsiedadService {
  readonly URL: string = MODEL.ANSIEDAD
  headers: HttpHeaders;
  
  constructor(private http: HttpClient) {
    const token = localStorage.getItem('token');
    this.headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getAnsiedades(): Observable<Ansiedad[]> {
    return this.http.get<Ansiedad[]>( this.URL + SERVICE.GET, { headers: this.headers });
  }

  insertAnsiedad(form:any) {
    return this.http.post<Ansiedad>(this.URL + SERVICE.POST, form, { headers: this.headers });
  }

  updateAnsiedad(form:any, id:number) {
    return this.http.put<Ansiedad>(this.URL + SERVICE.PUT + id, form, { headers: this.headers });
  }

  deleteAnsiedad(id:number) {
    return this.http.delete<Ansiedad>(this.URL + SERVICE.DELETE + id, { headers: this.headers });
  }
}
