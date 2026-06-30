import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-reset-password',
  imports: [FormsModule, RouterLink],
  templateUrl: './reset-password.html',
})
export class ResetPasswordPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private auth = inject(AuthService);
  private toast = inject(ToastService);

  token = '';
  password = '';
  confirmPassword = '';
  loading = signal(false);

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') ?? '';
    if (!this.token) {
      this.toast.error('Falta el token de recuperación');
    }
  }

  async submit(): Promise<void> {
    if (this.password !== this.confirmPassword) {
      this.toast.error('Las contraseñas no coinciden');
      return;
    }

    this.loading.set(true);
    try {
      const res = await firstValueFrom(
        this.auth.resetPassword(this.token, this.password),
      );
      this.toast.success(res.message || 'Contraseña actualizada');
      this.router.navigate(['/login']);
    } catch (err: any) {
      this.toast.error(err.error?.message || 'Token inválido o expirado');
    } finally {
      this.loading.set(false);
    }
  }
}
