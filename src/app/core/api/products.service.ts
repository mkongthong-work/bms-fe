import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Product } from '../models';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private http = inject(HttpClient);

  list(q = '', page = 1) {
    const params = new HttpParams().set('q', q).set('page', page);
    return this.http.get<{ items: Product[]; page: number }>('/api/v1/products', { params });
  }

  create(p: Partial<Product>) {
    return this.http.post<{ id: string }>('/api/v1/products', p);
  }
}
