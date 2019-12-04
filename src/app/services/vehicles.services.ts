import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from '../core/services/api.service';

@Injectable({
    providedIn: 'root'
})
export class VehicleService {

  constructor(private apiService: ApiService) { }

  create(payroll: any): Observable<any> {
    return this.apiService
    .post(`/events`, payroll)
    .pipe(
        map((body: any) => body)
      );
  }

  getAllVehicles(): Observable<any> {
    return this.apiService
    .get(`/vehicles`)
    .pipe(
        map((body: any) => body)
    );
  }
}
