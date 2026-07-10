/** โมเดลกลาง — ให้ตรงกับ JSON ของ Go API */
export interface Product {
  id: string;
  sku: string;
  name_th: string;
  name_en: string;
  unit: string;
  sell_price: number;
  status: 'draft' | 'published';
  updated_at: string;
}

export interface QuotationItem {
  sku: string;
  name: string;
  qty: number;
  unit: string;
  unit_price: number;
  discount: number;
}
