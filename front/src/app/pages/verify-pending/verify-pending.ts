import { Component, inject, signal } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-verify-pending',
  imports: [RouterLink],
  templateUrl: './verify-pending.html',
})
export class VerifyPendingPage {
  private auth = inject(AuthService);
  private toast = inject(ToastService);
  private route = inject(ActivatedRoute);

  loading = signal(false);
  email = signal<string | null>(null);

  async resend(): Promise<void> {
    this.loading.set(true);
    try {
      const res = await firstValueFrom(this.auth.resendVerification(this.email() ?? undefined));
      this.toast.success(res.message || 'Email de verificación reenviado');
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

  constructor() {
    // leer email desde query params (si fue pasado desde el registro)
    const emailParam = this.route.snapshot.queryParams['email'];
    if (emailParam) this.email.set(emailParam);
  }
}
