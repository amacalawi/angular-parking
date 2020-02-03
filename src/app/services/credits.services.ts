import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from '../core/services/api.service';

@Injectable({
    providedIn: 'root'
})
export class CreditService {

  constructor(private apiService: ApiService) { }

  create(payroll: any, id: number, amount: any): Observable<any> {
    return this.apiService
    .post(`/load-credits/${id}/${amount}/create`, payroll)
    .pipe(
        map((body: any) => body)
      );
  }
  
  getAllLoadCredits(id: number): Observable<any> {
    return this.apiService
    .get(`/load-credits/${id}`)
    .pipe(
        map((body: any) => body)
    );
  }

}
