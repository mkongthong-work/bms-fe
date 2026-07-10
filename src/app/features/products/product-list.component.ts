import { Component, inject, signal } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap, startWith } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProductsService } from '../../core/api/products.service';
import { Product } from '../../core/models';

@Component({
  selector: 'bms-product-list',
  standalone: true,
  imports: [ReactiveFormsModule, DecimalPipe, DatePipe],
  template: `
    <div class="head">
      <div><h1>สินค้า</h1><p class="sub">ค้นหาด้วยชื่อหรือรหัสรุ่น (SKU)</p></div>
      <button class="btn primary" data-testid="btn-add-product">+ เพิ่มสินค้า</button>
    </div>
    <input class="search" placeholder="ค้นหาสินค้า…" [formControl]="q" data-testid="input-product-search">
    <div class="card" style="padding:0;margin-top:12px">
      <table data-testid="product-table">
        <thead><tr><th>รหัส</th><th>ชื่อสินค้า</th><th>หน่วย</th>
          <th class="r">ราคาขาย</th><th>สถานะ</th><th>แก้ไขล่าสุด</th></tr></thead>
        <tbody>
          @for (p of items(); track p.id) {
            <tr>
              <td class="mono">{{ p.sku }}</td>
              <td>{{ p.name_th }}</td>
              <td>{{ p.unit }}</td>
              <td class="r">{{ p.sell_price | number:'1.2-2' }}</td>
              <td><span class="chip" [class.g]="p.status === 'published'">
                {{ p.status === 'published' ? 'เผยแพร่' : 'ร่าง' }}</span></td>
              <td class="mut">{{ p.updated_at | date:'d MMM yy' }}</td>
            </tr>
          } @empty {
            <tr><td colspan="6" class="empty">ยังไม่มีสินค้า — กด "เพิ่มสินค้า" เพื่อเริ่มสร้างแคตตาล็อก</td></tr>
          }
        </tbody>
      </table>
    </div>
  `,
  styles: `
    .head{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:14px}
    .sub{color:var(--mut);font-size:12.5px;margin:4px 0 0}
    .search{max-width:380px}
    table{width:100%;border-collapse:collapse;font-size:13.5px}
    th{font-size:11.5px;color:var(--mut);text-align:left;padding:10px 14px;border-bottom:1px solid var(--line)}
    td{padding:10px 14px;border-bottom:1px solid var(--line)}
    tr:last-child td{border-bottom:none}
    .r{text-align:right} .mut{color:var(--mut2)} .mono{font-family:monospace}
    .chip{font-size:11px;border-radius:999px;padding:2px 9px;background:var(--bg);color:var(--mut)}
    .chip.g{background:#e6f2ea;color:#1d7a46}
    .empty{text-align:center;color:var(--mut2);padding:32px}
  `,
})
export class ProductListComponent {
  private api = inject(ProductsService);

  readonly q = new FormControl('', { nonNullable: true });
  readonly items = signal<Product[]>([]);

  constructor() {
    this.q.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(q => this.api.list(q)),
      takeUntilDestroyed(),
    ).subscribe(res => this.items.set(res.items ?? []));
  }
}
