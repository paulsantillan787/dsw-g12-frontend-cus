import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { TipoTest } from '../models/tipo_test';
import { MODEL, SERVICE } from '../constants/api';

@Injectable({
  providedIn: 'root'
})
export class TipoTestService {
  readonly URL: string = MODEL.TIPO_TEST
  headers: HttpHeaders;

  constructor(private http: HttpClient) {
    const token = localStorage.getItem('token');
    this.headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getTiposTest(): Observable<TipoTest[]> {
    return this.http.get<TipoTest[]>( this.URL + SERVICE.GET, { headers: this.headers });
  }

  insertTipoTest(form:any) {
    return this.http.post<TipoTest>(this.URL + SERVICE.POST, form, { headers: this.headers });
  }

  updateTipoTest(form:any, id:number) {
    return this.http.put<TipoTest>(this.URL + SERVICE.PUT + id, form, { headers: this.headers });
  }

  deleteTipoTest(id:number) {
    return this.http.delete<TipoTest>(this.URL + SERVICE.DELETE + id, { headers: this.headers });
  }
}
