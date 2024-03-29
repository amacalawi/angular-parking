import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from '../core/services/api.service';

@Injectable({
    providedIn: 'root'
})
export class FixedRateService {

  constructor(private apiService: ApiService) { }

  create(payroll: any): Observable<any> {
    return this.apiService
    .post(`/fixed-rates`, payroll)
    .pipe(
        map((body: any) => body)
      );
  }

  update(payroll: any, id): Observable<any> {
    return this.apiService
    .put(`/fixed-rates/${id}/update`, payroll)
    .pipe(
        map((body: any) => body)
      );
  }

  modify(id): Observable<any> {
    return this.apiService
    .put(`/fixed-rates/${id}/modify`)
    .pipe(
        map((body: any) => body)
      );
  }

  find(id): Observable<any> {
    return this.apiService
    .get(`/fixed-rates/${id}/find`)
    .pipe(
        map((body: any) => body)
      );
  }

  getAllFixedRate(payroll: any): Observable<any> {
    return this.apiService
    .get(`/fixed-rates/${payroll}`)
    .pipe(
        map((body: any) => body)
    );
  }
}
