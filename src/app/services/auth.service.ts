// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AuthResult {
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private _token: string | null = null;

  constructor(private http: HttpClient) {}

  /** Sends credentials, stores JWT on success */
  login(username: string, password: string): Observable<AuthResult> {
    return this.http
      .post<AuthResult>(`${this.apiUrl}/login`, { username, password })
      .pipe(
        tap((res) => {
          this._token = res.token;
        })
      );
  }

  /** Registers a new user */
  register(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { username, password });
  }

  /** Returns the stored JWT (or null) */
  get token(): string | null {
    return this._token;
  }

  /** Clears the stored token */
  logout(): void {
    this._token = null;
  }
}
