import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { Ubigeo } from '../models/ubigeo';
import { MODEL, SERVICE } from '../constants/api';

@Injectable({
  providedIn: 'root'
})
export class UbigeoService {
  readonly URL: string = MODEL.UBIGEO
  headers: HttpHeaders;

  constructor(private http: HttpClient) {
    const token = localStorage.getItem('token');
    this.headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getUbigeos(): Observable<Ubigeo[]> {
    return this.http.get<Ubigeo[]>( this.URL + SERVICE.GET, { headers: this.headers });
  }

  getUbigeosDTO(): Observable<any[]> {
    return this.http.get<any[]>( this.URL + SERVICE.DTO +SERVICE.GET, { headers: this.headers });
  }
}
