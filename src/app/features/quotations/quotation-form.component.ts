import { Component, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { bahtText } from '../../shared/bahttext';


@Component({
  selector: 'bms-quotation-form',
  standalone: true,
  imports: [ReactiveFormsModule, DecimalPipe],
  template: `
    <h1>สร้างใบเสนอราคา</h1>
    <p class="sub">เลขที่เอกสารออกให้อัตโนมัติเมื่อบันทึก · VAT 7% ตามตั้งค่าบริษัท</p>

    <form [formGroup]="form">
      <section class="card">
        <h2>ลูกค้า</h2>
        <div class="row">
          <div class="f2"><label for="cust">ชื่อลูกค้า / บริษัท</label>
            <input id="cust" formControlName="customer" data-testid="input-customer-name"></div>
          <div class="f1"><label for="tax">เลขประจำตัวผู้เสียภาษี</label>
            <input id="tax" formControlName="taxId" data-testid="input-customer-taxid"></div>
        </div>
      </section>

      <section class="card">
        <h2>รายการสินค้า / บริการ</h2>
        <table formArrayName="items" data-testid="items-table">
          <thead><tr><th>รหัส</th><th>รายการ</th><th class="r">จำนวน</th>
            <th class="r">ราคา/หน่วย</th><th class="r">ส่วนลด</th><th class="r">จำนวนเงิน</th><th></th></tr></thead>
          <tbody>
            @for (row of items.controls; track row; let i = $index) {
              <tr [formGroupName]="i">
                <td style="width:110px"><input formControlName="sku" [attr.data-testid]="'input-sku-' + i"></td>
                <td><input formControlName="name" [attr.data-testid]="'input-item-name-' + i"></td>
                <td style="width:70px"><input class="r" type="number" formControlName="qty"></td>
                <td style="width:110px"><input class="r" type="number" formControlName="unitPrice"></td>
                <td style="width:100px"><input class="r" type="number" formControlName="discount"></td>
                <td class="r amt">{{ rowAmount(i) | number:'1.2-2' }}</td>
                <td style="width:34px"><button type="button" class="del" (click)="removeRow(i)"
                    [attr.data-testid]="'btn-del-' + i">✕</button></td>
              </tr>
            }
          </tbody>
        </table>
        <button type="button" class="addrow" (click)="addRow()" data-testid="btn-add-item">＋ เพิ่มรายการ</button>
      </section>

      <section class="card totals" data-testid="totals-panel">
        <div class="trow"><span>รวมเป็นเงิน</span><b>{{ subtotal() | number:'1.2-2' }}</b></div>
        <div class="trow"><span>ภาษีมูลค่าเพิ่ม 7%</span><b>{{ vat() | number:'1.2-2' }}</b></div>
        <div class="trow grand"><span>จำนวนเงินรวมทั้งสิ้น</span><b>{{ grand() | number:'1.2-2' }}</b></div>
        <p class="words" data-testid="baht-words">( {{ words() }} )</p>
      </section>

      <div class="actions">
        <button type="button" class="btn navy" data-testid="btn-save-draft">บันทึกแบบร่าง</button>
        <button type="button" class="btn primary" data-testid="btn-save-send" [disabled]="form.invalid">
          บันทึกและออก PDF
        </button>
      </div>
    </form>
  `,
  styles: `
    .sub{color:var(--mut);font-size:12.5px;margin:4px 0 14px}
    .card{margin-bottom:14px}
    .card h2{font-size:13.5px;color:var(--navy);margin:0 0 12px;display:flex;gap:8px;align-items:center}
    .card h2::before{content:"";width:3px;height:14px;background:var(--red);border-radius:2px}
    .row{display:flex;gap:12px} .f1{flex:1} .f2{flex:2}
    table{width:100%;border-collapse:collapse}
    th{font-size:11.5px;color:var(--mut);text-align:left;padding:0 6px 8px;border-bottom:1px solid var(--line)}
    td{padding:6px 4px;border-bottom:1px solid var(--line)}
    .r{text-align:right} .amt{font-weight:600;white-space:nowrap;padding-right:8px}
    .del{border:none;background:none;color:var(--mut2);cursor:pointer;border-radius:6px}
    .del:hover{color:var(--red)}
    .addrow{margin-top:10px;border:1.5px dashed var(--line);background:none;border-radius:var(--r-sm);
      width:100%;height:36px;color:var(--navy);font:inherit;font-weight:600;cursor:pointer}
    .addrow:hover{border-color:var(--navy);background:var(--navy-soft)}
    .totals{max-width:380px;margin-left:auto}
    .trow{display:flex;justify-content:space-between;padding:5px 0;font-size:13.5px}
    .trow.grand{background:var(--navy-soft);border-radius:var(--r-sm);padding:9px 12px;color:var(--navy);font-weight:700}
    .words{font-size:12px;color:var(--navy);background:var(--bg);border:1px solid var(--line);
      border-radius:var(--r-sm);padding:8px 12px;margin:10px 0 0}
    .actions{display:flex;gap:10px;justify-content:flex-end}
  `,
})
export class QuotationFormComponent {
  private fb = inject(FormBuilder);

  readonly form = this.fb.nonNullable.group({
    customer: ['', Validators.required],
    taxId: [''],
    items: this.fb.array([this.newItem()]),
  });

  get items(): FormArray { return this.form.controls.items; }

  /** signal จาก valueChanges — ยอดรวมคำนวณใหม่ทุกครั้งที่ฟอร์มเปลี่ยน */
  private formValue = toSignal(this.form.valueChanges, { initialValue: this.form.getRawValue() });

  readonly subtotal = computed(() => {
    const rows = (this.formValue()?.items ?? []) as Array<{ qty?: number; unitPrice?: number; discount?: number }>;
    return rows.reduce((s, r) => s + (r.qty ?? 0) * (r.unitPrice ?? 0) - (r.discount ?? 0), 0);
  });
  readonly vat = computed(() => Math.round(this.subtotal() * 7) / 100);
  readonly grand = computed(() => this.subtotal() + this.vat());
  readonly words = computed(() => bahtText(this.grand()));

  private newItem() {
    return this.fb.nonNullable.group({
      sku: [''],
      name: ['', Validators.required],
      qty: [1, [Validators.required, Validators.min(0)]],
      unitPrice: [0, [Validators.required, Validators.min(0)]],
      discount: [0, Validators.min(0)],
    });
  }

  addRow(): void { this.items.push(this.newItem()); }
  removeRow(i: number): void { if (this.items.length > 1) this.items.removeAt(i); }

  rowAmount(i: number): number {
    const v = this.items.at(i).getRawValue() as { qty: number; unitPrice: number; discount: number };
    return v.qty * v.unitPrice - v.discount;
  }
}
