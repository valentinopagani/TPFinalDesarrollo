import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

type Status = 'loading' | 'success' | 'error';

@Component({
  selector: 'app-verify-email',
  imports: [RouterLink],
  templateUrl: './verify-email.html',
})
export class VerifyEmailPage implements OnInit {
  private route = inject(ActivatedRoute);
  private auth = inject(AuthService);
  private toast = inject(ToastService);

  status = signal<Status>('loading');
  loading = signal(false);

  async ngOnInit(): Promise<void> {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (!token) {
      this.status.set('error');
      this.toast.error('Falta el token de verificación');
      return;
    }

    try {
      const res = await firstValueFrom(this.auth.verifyEmail(token));
      this.status.set('success');
      this.toast.success(res.message || 'Email verificado correctamente');
    } catch (err: any) {
      this.status.set('error');
      this.toast.error(err.error?.message || 'Token inválido o expirado');
    }
  }

  async resend(): Promise<void> {
    this.loading.set(true);
    try {
      const res = await firstValueFrom(this.auth.resendVerification());
      this.toast.success(res.message || 'Email reenviado');
    } catch (err: any) {
      if (err.status === 401) {
        this.toast.error('Iniciá sesión para poder reenviar el email');
      } else {
        this.toast.error(err.error?.message || 'No se pudo reenviar el email');
      }
    } finally {
      this.loading.set(false);
    }
  }
}
