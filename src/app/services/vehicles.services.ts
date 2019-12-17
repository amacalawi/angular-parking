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
    .post(`/vehicles`, payroll)
    .pipe(
        map((body: any) => body)
      );
  }

  update(payroll: any, id): Observable<any> {
    return this.apiService
    .put(`/vehicles/${id}/update`, payroll)
    .pipe(
        map((body: any) => body)
      );
  }

  find(id): Observable<any> {
    return this.apiService
    .get(`/vehicles/${id}/find`)
    .pipe(
        map((body: any) => body)
      );
  }

  filter(id): Observable<any> {
    return this.apiService
    .get(`/vehicles/${id}/filter`)
    .pipe(
        map((body: any) => body)
      );
  }

  getAllVehicles(payroll: any): Observable<any> {
    return this.apiService
    .get(`/vehicles/${payroll}`)
    .pipe(
        map((body: any) => body)
    );
  }
}
