import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Credentials, CredentialsService } from './credentials.service';
import { ApiService } from '../services/api.service';
import { map } from 'rxjs/operators';

export interface LoginContext {
  username: string;
  password: string;
  remember?: boolean;
}

/**
 * Provides a base for authentication workflow.
 * The login/logout methods should be replaced with proper implementation.
 */
@Injectable()
export class AuthenticationService {
  constructor(private credentialsService: CredentialsService, private apiService: ApiService) {}

  /**
   * Authenticates the user.
   * @param context The login parameters.
   * @return The user credentials.
   */
  login(context: LoginContext): Observable<any> {
    // Replace by proper authentication call
    var data = {
      email: context.username,
      password: context.password,
      token: '',
      user_id: 0,
      roles: [],
      privileges: []
    };

    return this.apiService
      .post('/auth/login', data).pipe(map(
        user => {
          data = {
            email: context.username,
            password: context.password,
            token: user.token,
            user_id: user.user_id,
            roles: user.roles,
            privileges: user.privileges
          };
          this.credentialsService.setCredentials(data, context.remember);
          return of(user);
        }
      ));
  }
  /**
   * Logs out the user and clear credentials.
   * @return True if the user was logged out successfully.
   */
  logout(): Observable<boolean> {
    // Customize credentials invalidation here
    this.credentialsService.setCredentials();
    return of(true);
  }
}
