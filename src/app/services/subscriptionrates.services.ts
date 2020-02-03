import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from '../core/services/api.service';

@Injectable({
    providedIn: 'root'
})
export class SubscriptionRateService {

  constructor(private apiService: ApiService) { }

  create(payroll: any): Observable<any> {
    return this.apiService
    .post(`/subscription-rates`, payroll)
    .pipe(
        map((body: any) => body)
      );
  }

  update(payroll: any, id): Observable<any> {
    return this.apiService
    .put(`/subscription-rates/${id}/update`, payroll)
    .pipe(
        map((body: any) => body)
      );
  }

  modify(id): Observable<any> {
    return this.apiService
    .put(`/subscription-rates/${id}/modify`)
    .pipe(
        map((body: any) => body)
      );
  }

  find(id): Observable<any> {
    return this.apiService
    .get(`/subscription-rates/${id}/find`)
    .pipe(
        map((body: any) => body)
      );
  }

  getAllSubscriptionRate(payroll: any): Observable<any> {
    return this.apiService
    .get(`/subscription-rates/${payroll}`)
    .pipe(
        map((body: any) => body)
    );
  }
}
