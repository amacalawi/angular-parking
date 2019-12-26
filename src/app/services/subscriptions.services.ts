import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from '../core/services/api.service';

@Injectable({
    providedIn: 'root'
})
export class SubscriptionService {

  constructor(private apiService: ApiService) { }

  create(payroll: any): Observable<any> {
    return this.apiService
    .post(`/subscriptions`, payroll)
    .pipe(
        map((body: any) => body)
      );
  }

  update(payroll: any, id): Observable<any> {
    return this.apiService
    .put(`/subscriptions/${id}/update`, payroll)
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
}
