import { Injectable } from '@angular/core';
import { MODEL, SERVICE } from '../constants/api';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TdoService {
  readonly URL: string = SERVICE.TDO;
  headers: HttpHeaders;

  constructor(private http: HttpClient) {
    const token = localStorage.getItem('token');
    this.headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getTest(id: any): Observable<any> {
    return this.http.get(this.URL + MODEL.TEST + SERVICE.GETBY + id, { headers: this.headers });
  }
}
