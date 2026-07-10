import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../core/auth/auth.service';

/** โครงหน้าหลัก: topbar + sidebar (แนวทาง A จาก wireframe) */
@Component({
  selector: 'bms-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <header class="topbar">
      <div class="brand"><div class="mark">BM</div><b>B.M. SERVICE</b><span>· ระบบหลังบ้าน</span></div>
      <button class="btn" style="margin-left:auto" data-testid="btn-logout" (click)="logout()">ออกจากระบบ</button>
    </header>
    <div class="layout">
      <aside class="side" data-testid="sidebar">
        <div class="grp">ภาพรวม</div>
        <a class="nav" routerLink="/dashboard" routerLinkActive="on">แดชบอร์ด</a>
        <div class="grp">เอกสารงานขาย</div>
        <a class="nav" routerLink="/quotations/new" routerLinkActive="on">ใบเสนอราคา</a>
        <div class="grp">แคตตาล็อก</div>
        <a class="nav" routerLink="/products" routerLinkActive="on">สินค้า</a>
      </aside>
      <main class="main"><router-outlet /></main>
    </div>
  `,
  styles: `
    .topbar{height:52px;background:var(--card);border-bottom:1px solid var(--line);
      display:flex;align-items:center;gap:10px;padding:0 18px;position:sticky;top:0;z-index:30}
    .brand{display:flex;align-items:center;gap:10px}
    .brand b{color:var(--navy)} .brand span{color:var(--mut2);font-size:12px}
    .mark{width:30px;height:30px;border-radius:8px;background:var(--navy);color:#fff;
      display:grid;place-items:center;font-weight:700;font-size:12px}
    .layout{display:flex;min-height:calc(100vh - 52px)}
    .side{width:216px;background:var(--card);border-right:1px solid var(--line);padding:14px 10px;flex-shrink:0}
    .grp{font-size:10.5px;letter-spacing:.8px;color:var(--mut2);text-transform:uppercase;padding:14px 10px 6px;font-weight:600}
    .nav{display:block;padding:8px 10px;border-radius:8px;color:#4b4742;text-decoration:none;font-size:13.5px}
    .nav:hover{background:var(--bg)}
    .nav.on{background:var(--navy-soft);color:var(--navy);font-weight:600}
    .main{flex:1;min-width:0;padding:20px 24px}
  `,
})
export class ShellComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  logout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
