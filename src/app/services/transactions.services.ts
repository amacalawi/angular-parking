import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from '../core/services/api.service';

@Injectable({
    providedIn: 'root'
})
export class TransactionService {

  constructor(private apiService: ApiService) { }

  create(payroll: any): Observable<any> {
    return this.apiService
    .post(`/vehicles`, payroll)
    .pipe(
        map((body: any) => body)
      );
  }

  update(payroll: any, id): Observable<any> {
    return this.apiService
    .post(`/vehicles/${id}/update`, payroll)
    .pipe(
        map((body: any) => body)
      );
  }

  find(id): Observable<any> {
    return this.apiService
    .post(`/vehicles/${id}/find`)
    .pipe(
        map((body: any) => body)
      );
  }

  getAllQueuedParking(payroll: any): Observable<any> {
    return this.apiService
    .get(`/transactions/${payroll}`)
    .pipe(
        map((body: any) => body)
    );
  }
}
