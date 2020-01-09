import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from '../core/services/api.service';

@Injectable({
    providedIn: 'root'
})
export class TransactionService {

  constructor(private apiService: ApiService) { }

  checkin(payroll: any, rfid: any): Observable<any> {
    return this.apiService
    .post(`/transactions/${rfid}/checkin`, payroll)
    .pipe(
        map((body: any) => body)
      );
  }

  autocheckin(rfid: any): Observable<any> {
    return this.apiService
    .post(`/transactions/${rfid}/auto-checkin`)
    .pipe(
        map((body: any) => body)
      );
  }

  checkout(payroll: any, id): Observable<any> {
    return this.apiService
    .post(`/transactions/${id}/checkout`, payroll)
    .pipe(
        map((body: any) => body)
      );
  }

  generate(payroll: any): Observable<any> {
    return this.apiService
    .post(`/transactions/generate`, payroll)
    .pipe(
        map((body: any) => body)
      );
  }

  find(id): Observable<any> {
    return this.apiService
    .post(`/transactions/${id}/find`)
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
