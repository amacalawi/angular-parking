import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from '../core/services/api.service';

@Injectable({
    providedIn: 'root'
})
export class CustomerService {

  constructor(private apiService: ApiService) { }

  create(payroll: any): Observable<any> {
    return this.apiService
    .post(`/customers`, payroll)
    .pipe(
        map((body: any) => body)
      );
  }

  update(payroll: any, id): Observable<any> {
    return this.apiService
    .put(`/customers/${id}/update`, payroll)
    .pipe(
        map((body: any) => body)
      );
  }

  modify(id): Observable<any> {
    return this.apiService
    .put(`/customers/${id}/modify`)
    .pipe(
        map((body: any) => body)
      );
  }

  find(id): Observable<any> {
    return this.apiService
    .get(`/customers/${id}/find`)
    .pipe(
        map((body: any) => body)
      );
  }

  getAllCustomers(payroll: any): Observable<any> {
    return this.apiService
    .get(`/customers/${payroll}`)
    .pipe(
        map((body: any) => body)
    );
  }
}
