import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from '../core/services/api.service';

@Injectable({
    providedIn: 'root'
})
export class DashboardService {

  constructor(private apiService: ApiService) { }
  
  getAllSales(): Observable<any> {
    return this.apiService
    .get(`/dashboard/get-all-sales`)
    .pipe(
        map((body: any) => body)
    );
  }

  downloadSales(): Observable<any> {
    return this.apiService
    .get(`/dashboard/download-sales`)
    .pipe(
        map((body: any) => body)
    );
  }
}
