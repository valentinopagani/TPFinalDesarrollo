import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginPage {
  private auth = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  error = '';
  loading = signal(false);

  async submit(): Promise<void> {
    this.error = '';
    this.loading.set(true);
    try {
      await firstValueFrom(this.auth.login({ email: this.email, password: this.password }));
      this.router.navigate(['/']);
    } catch (err: any) {
      this.error = err.error?.message || 'Error al iniciar sesión';
    } finally {
      this.loading.set(false);
    }
  }
}
