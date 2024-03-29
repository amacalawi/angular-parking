import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from '../core/services/api.service';

@Injectable({
    providedIn: 'root'
})
export class CustomerTypeService {

  constructor(private apiService: ApiService) { }

  getAllCustomerTypes(payroll: any): Observable<any> {
    return this.apiService
    .get(`/customer-types/${payroll}`)
    .pipe(
        map((body: any) => body)
    );
  }

  filter(id): Observable<any> {
    return this.apiService
    .get(`/customer-types/${id}/filter`)
    .pipe(
        map((body: any) => body)
      );
  }

}
