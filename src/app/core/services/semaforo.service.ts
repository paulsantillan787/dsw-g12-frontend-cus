import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { Semaforo } from '../models/semaforo';
import { MODEL, SERVICE } from '../constants/api';

@Injectable({
  providedIn: 'root'
})
export class SemaforoService {
  readonly URL: string = MODEL.SEMAFORO;
  headers: HttpHeaders;

  constructor(private http: HttpClient) {
    const token = localStorage.getItem('token');
    this.headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getSemaforos(): Observable<Semaforo[]> {
    return this.http.get<Semaforo[]>( this.URL + SERVICE.GET, { headers: this.headers });
  }
}
