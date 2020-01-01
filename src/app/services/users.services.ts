import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from '../core/services/api.service';

@Injectable({
    providedIn: 'root'
})
export class UserService {

  constructor(private apiService: ApiService) { }

  create(payroll: any): Observable<any> {
    return this.apiService
    .post(`/users`, payroll)
    .pipe(
        map((body: any) => body)
      );
  }

  update(payroll: any, id): Observable<any> {
    return this.apiService
    .put(`/users/${id}/update`, payroll)
    .pipe(
        map((body: any) => body)
      );
  }

  modify(id): Observable<any> {
    return this.apiService
    .put(`/users/${id}/modify`)
    .pipe(
        map((body: any) => body)
      );
  }

  find(id): Observable<any> {
    return this.apiService
    .get(`/users/${id}/find`)
    .pipe(
        map((body: any) => body)
      );
  }

  getAllUsers(payroll: any): Observable<any> {
    return this.apiService
    .get(`/users/${payroll}`)
    .pipe(
        map((body: any) => body)
    );
  }
}
