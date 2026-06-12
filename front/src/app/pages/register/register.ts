import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class RegisterPage {
  private auth = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  confirmPassword = '';
  error = '';
  loading = signal(false);

  async submit(): Promise<void> {
    this.error = '';
    this.loading.set(true);

    if (this.password !== this.confirmPassword) {
      this.error = 'Las contraseñas no coinciden';
      this.loading.set(false);
      return;
    }

    try {
      await firstValueFrom(this.auth.register({ email: this.email, password: this.password }));
      this.router.navigate(['/']);
    } catch (err: any) {
      this.error = err.error?.message || 'Error al registrarse';
    } finally {
      this.loading.set(false);
    }
  }
}
