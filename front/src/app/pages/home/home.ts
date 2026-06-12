import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ProductsService } from '../../services/products.service';
import { CategoriesService } from '../../services/categories.service';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomePage implements OnInit {
  auth = inject(AuthService);
  private productsService = inject(ProductsService);
  private categoriesService = inject(CategoriesService);

  productCount = signal(0);
  categoryCount = signal(0);
  loading = signal(true);

  async ngOnInit(): Promise<void> {
    if (!this.auth.isAuthenticated()) {
      this.loading.set(false);
      return;
    }
    try {
      const [res, cats] = await Promise.all([
        firstValueFrom(this.productsService.findAll({ page: 1, limit: 1 })),
        firstValueFrom(this.categoriesService.findAll()),
      ]);
      this.productCount.set(res.total);
      this.categoryCount.set(cats.length);
    } catch {
    } finally {
      this.loading.set(false);
    }
  }
}
