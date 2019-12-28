import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from '../core/services/api.service';

@Injectable({
    providedIn: 'root'
})
export class SubscriptionService {

  constructor(private apiService: ApiService) { }

  create(payroll: any, id: number, total_amount: number): Observable<any> {
    return this.apiService
    .post(`/subscriptions/${id}/${total_amount}/create`, payroll)
    .pipe(
        map((body: any) => body)
      );
  }

  update(payroll: any, id: number, total_amount: number): Observable<any> {
    return this.apiService
    .put(`/subscriptions/${id}/${total_amount}/update`, payroll)
    .pipe(
        map((body: any) => body)
      );
  }

  find(id): Observable<any> {
    return this.apiService
    .get(`/subscriptions/${id}/find`)
    .pipe(
        map((body: any) => body)
      );
  }

  delete(id): Observable<any> {
    return this.apiService
    .delete(`/subscriptions/${id}/delete`)
    .pipe(
        map((body: any) => body)
      );
  }

  modify(id): Observable<any> {
    return this.apiService
    .put(`/subscriptions/${id}/modify`)
    .pipe(
        map((body: any) => body)
      );
  }
}
