import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from '../core/services/api.service';

@Injectable({
    providedIn: 'root'
})
export class CustomerTypeService {

  constructor(private apiService: ApiService) { }

  create(payroll: any): Observable<any> {
    return this.apiService
    .post(`/events`, payroll)
    .pipe(
        map((body: any) => body)
      );
  }

  getAllCustomerTypes(): Observable<any> {
    return this.apiService
    .get(`/customer-types`)
    .pipe(
        map((body: any) => body)
    );
  }
}
