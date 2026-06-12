import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthResponse, LoginDto, RegisterDto } from '../models/auth';
import { SafeUser } from '../models/user';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = `${environment.apiUrl}/auth`;
  private readonly tokenKey = 'access_token';

  user = signal<SafeUser | null>(null);

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
    this.initializeUser();
  }

  private initializeUser(): void {
    const token = this.getToken();
    if (token) {
      this.me().subscribe({
        error: () => this.logout(),
      });
    }
  }

  register(dto: RegisterDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.api}/register`, dto).pipe(
      tap((res) => {
        if (res?.access_token) {
          this.handleAuth(res);
        }
      }),
    );
  }

  login(dto: LoginDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.api}/login`, dto).pipe(
      tap((res) => {
        if (res?.access_token) {
          this.handleAuth(res);
        }
      }),
    );
  }

  me(): Observable<SafeUser> {
    return this.http.get<SafeUser>(`${this.api}/me`).pipe(
      tap((user) => this.user.set(user)),
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.user.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    return this.user()?.role === 'admin';
  }

  private handleAuth(res: AuthResponse): void {
    if (res?.access_token && res?.user) {
      localStorage.setItem(this.tokenKey, res.access_token);
      this.user.set(res.user);
    }
  }
}
