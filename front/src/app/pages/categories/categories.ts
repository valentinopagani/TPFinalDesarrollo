import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { CategoriesService } from '../../services/categories.service';
import { AuthService } from '../../services/auth.service';
import { BottomSheet } from '../../shared/bottom-sheet/bottom-sheet';
import { Category } from '../../models/category';

@Component({
  selector: 'app-categories',
  imports: [FormsModule, BottomSheet],
  templateUrl: './categories.html',
  styleUrl: './categories.css',
})
export class CategoriesPage implements OnInit {
  private service = inject(CategoriesService);
  auth = inject(AuthService);

  categories = signal<Category[]>([]);
  editingCat = signal<Category | null>(null);
  newName = '';
  editName = '';
  error = '';
  formError = '';
  loading = signal(false);

  async ngOnInit(): Promise<void> {
    await this.load();
  }

  async load(): Promise<void> {
    this.loading.set(true);
    this.error = '';
    try {
      const cats = await firstValueFrom(this.service.findAll());
      this.categories.set(cats);
    } catch {
      this.error = 'Error al cargar categorías';
    } finally {
      this.loading.set(false);
    }
  }

  async create(): Promise<void> {
    if (!this.newName.trim()) return;
    try {
      await firstValueFrom(this.service.create({ name: this.newName }));
      this.newName = '';
      await this.load();
    } catch (err: any) {
      this.error = err.error?.message || 'Error al crear';
    }
  }

  openEdit(cat: Category): void {
    this.editingCat.set(cat);
    this.editName = cat.name;
    this.formError = '';
  }

  cancelEdit(): void {
    this.editingCat.set(null);
    this.editName = '';
    this.formError = '';
  }

  async saveEdit(): Promise<void> {
    const cat = this.editingCat();
    if (!cat || !this.editName.trim()) return;
    this.formError = '';
    try {
      await firstValueFrom(this.service.update(cat.id, { name: this.editName }));
      this.cancelEdit();
      await this.load();
    } catch (err: any) {
      this.formError = err.error?.message || 'Error al actualizar';
    }
  }

  async deleteCategory(id: number): Promise<void> {
    if (!confirm('¿Eliminar categoría?')) return;
    try {
      await firstValueFrom(this.service.remove(id));
      await this.load();
    } catch (err: any) {
      this.error = err.error?.message || 'Error al eliminar';
    }
  }
}
