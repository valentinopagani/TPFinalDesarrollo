import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ProductsService } from '../../services/products.service';
import { Product } from '../../models/product';

@Component({
  selector: 'app-product-detail',
  imports: [RouterLink],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
})
export class ProductDetailPage implements OnInit {
  private route = inject(ActivatedRoute);
  private productsService = inject(ProductsService);

  product = signal<Product | null>(null);
  error = '';

  async ngOnInit(): Promise<void> {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    try {
      const p = await firstValueFrom(this.productsService.findOne(id));
      this.product.set(p);
    } catch {
      this.error = 'Producto no encontrado';
    }
  }
}
