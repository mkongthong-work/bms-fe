import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'bms-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="wrap">
      <form class="card box" [formGroup]="form" (ngSubmit)="submit()">
        <div class="mark">BM</div>
        <h1>เข้าสู่ระบบหลังบ้าน</h1>
        <p class="sub">B.M. Service Admin</p>
        <label for="email">อีเมล</label>
        <input id="email" type="email" formControlName="email" data-testid="input-email" autocomplete="username">
        <label for="password" style="margin-top:12px">รหัสผ่าน</label>
        <input id="password" type="password" formControlName="password" data-testid="input-password" autocomplete="current-password">
        @if (error()) { <p class="err" data-testid="login-error">{{ error() }}</p> }
        <button class="btn primary" style="width:100%;margin-top:16px" data-testid="btn-login"
                [disabled]="form.invalid || loading()">
          {{ loading() ? 'กำลังเข้าสู่ระบบ…' : 'เข้าสู่ระบบ' }}
        </button>
      </form>
    </div>
  `,
  styles: `
    .wrap{min-height:100vh;display:grid;place-items:center}
    .box{width:360px;padding:28px}
    .mark{width:44px;height:44px;border-radius:10px;background:var(--navy);color:#fff;
      display:grid;place-items:center;font-weight:700;margin-bottom:14px}
    .sub{color:var(--mut);font-size:12.5px;margin:4px 0 20px}
    .err{color:var(--red);font-size:12.5px;margin:10px 0 0}
  `,
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  readonly loading = signal(false);
  readonly error = signal('');

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  submit(): void {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.error.set('');
    const { email, password } = this.form.getRawValue();
    this.auth.login(email, password).subscribe({
      next: () => this.router.navigateByUrl('/dashboard'),
      error: err => {
        this.loading.set(false);
        this.error.set(err.error?.error ?? 'เข้าสู่ระบบไม่สำเร็จ ลองอีกครั้ง');
      },
    });
  }
}
