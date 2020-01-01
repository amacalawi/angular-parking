import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from '../core/services/api.service';

@Injectable({
    providedIn: 'root'
})
export class RoleService {

  constructor(private apiService: ApiService) { }

  create(payroll: any): Observable<any> {
    return this.apiService
    .post(`/roles`, payroll)
    .pipe(
        map((body: any) => body)
      );
  }

  update(payroll: any, id): Observable<any> {
    return this.apiService
    .put(`/roles/${id}/update`, payroll)
    .pipe(
        map((body: any) => body)
      );
  }

  modify(id): Observable<any> {
    return this.apiService
    .put(`/roles/${id}/modify`)
    .pipe(
        map((body: any) => body)
      );
  }

  find(id): Observable<any> {
    return this.apiService
    .get(`/roles/${id}/find`)
    .pipe(
        map((body: any) => body)
      );
  }

  getAllRoles(payroll: any): Observable<any> {
    return this.apiService
    .get(`/roles/${payroll}`)
    .pipe(
        map((body: any) => body)
    );
  }
}
