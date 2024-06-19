import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { Alternativa } from '../models/alternativa';
import { MODEL, SERVICE } from '../constants/api';

@Injectable({
  providedIn: 'root'
})
export class AlternativaService {
  readonly URL: string = MODEL.ALTERNATIVA
  headers: HttpHeaders;

  constructor(private http:HttpClient) {
    const token = localStorage.getItem('token');
    this.headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getAlternativas(): Observable<Alternativa[]> {
    return this.http.get<Alternativa[]>(this.URL + SERVICE.GET, { headers: this.headers });
  }

  insertAlternativa(form:any) {
    return this.http.post<Alternativa>(this.URL + SERVICE.POST, form, { headers: this.headers });
  }

  updateAlternativa(form:any, id:number) {
    return this.http.put<Alternativa>(this.URL + SERVICE.PUT + id, form, { headers: this.headers });
  }

  deleteAlternativa(id:number) {
    return this.http.delete<Alternativa>(this.URL + SERVICE.DELETE + id, { headers: this.headers });
  }
}
