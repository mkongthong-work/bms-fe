import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { tap } from 'rxjs';

interface LoginResponse { access_token: string; role: string }

const TOKEN_KEY = 'bms.token';

/**
 * เก็บ token ใน sessionStorage: หมดเมื่อปิดแท็บ ลดความเสี่ยง token ค้างบนเครื่องสาธารณะ
 * (ระยะถัดไปแนะนำย้ายเป็น httpOnly cookie + refresh token ฝั่ง server)
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  readonly role = signal<string | null>(null);

  get token(): string | null { return sessionStorage.getItem(TOKEN_KEY); }
  get isLoggedIn(): boolean { return this.token !== null; }

  login(email: string, password: string) {
    return this.http.post<LoginResponse>('/api/v1/auth/login', { email, password }).pipe(
      tap(res => {
        sessionStorage.setItem(TOKEN_KEY, res.access_token);
        this.role.set(res.role);
      }),
    );
  }

  logout(): void {
    sessionStorage.removeItem(TOKEN_KEY);
    this.role.set(null);
  }
}
