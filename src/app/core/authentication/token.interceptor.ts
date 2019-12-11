import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { tap } from 'rxjs/internal/operators/tap';
import { Router } from '@angular/router';
import { CredentialsService } from './credentials.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(public credentialsService: CredentialsService, private route: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${this.credentialsService.credentials ? this.credentialsService.credentials.token : ''}`
      }
    });

    return next
        .handle(request).pipe(
            tap(event => {
            if (event instanceof HttpResponse) {
            }
        }, (err: any) => {
            // || err.status === 500 add in production only.
            if (err.status === 401) {
              localStorage.clear();
              this.route.navigate(['/login']);
            }
        }
    ));
  }
}