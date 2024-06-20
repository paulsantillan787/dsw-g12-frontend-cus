import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { Test, TestView } from '../models/test';
import { MODEL, SERVICE } from '../constants/api';

@Injectable({
  providedIn: 'root'
})
export class TestService {
  readonly URL: string = MODEL.TEST
  headers: HttpHeaders;

  constructor(private http:HttpClient) {
    const token = localStorage.getItem('token');
    this.headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getTests(): Observable<Test[]> {
    return this.http.get<Test[]>(this.URL + SERVICE.GET, { headers: this.headers });
  }

  insertTest(form:any) {
    return this.http.post<Test>(this.URL + SERVICE.POST, form, { headers: this.headers });
  }

  updateTest(form:any, id:number) {
    return this.http.put<Test>(this.URL + SERVICE.PUT + id, form, { headers: this.headers });
  }

  deleteTest(id:number) {
    return this.http.delete<Test>(this.URL + SERVICE.DELETE + id, { headers: this.headers });
  }

  getTestView(): Observable<TestView[]> {
    return this.http.get<TestView[]>(this.URL + SERVICE.GET, { headers: this.headers });
  }
}
