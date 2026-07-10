import { Component } from '@angular/core';

@Component({
  selector: 'bms-dashboard',
  standalone: true,
  template: `
    <h1>แดชบอร์ด</h1>
    <p style="color:var(--mut)">ภาพรวมยอดขายและเอกสารค้างชำระ — ต่อ API ในเฟสถัดไป</p>
  `,
})
export class DashboardComponent {}
