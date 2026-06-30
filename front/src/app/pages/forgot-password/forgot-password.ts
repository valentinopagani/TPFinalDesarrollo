import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-forgot-password',
  imports: [FormsModule, RouterLink],
  templateUrl: './forgot-password.html',
})
export class ForgotPasswordPage {
  private auth = inject(AuthService);
  private toast = inject(ToastService);

  email = '';
  loading = signal(false);
  sent = signal(false);

  async submit(): Promise<void> {
    this.loading.set(true);
    try {
      const res = await firstValueFrom(this.auth.forgotPassword(this.email));
      this.sent.set(true);
      this.toast.info(res.message || 'Si el email existe, recibirás un link');
    } catch (err: any) {
      this.toast.error(err.error?.message || 'No se pudo procesar la solicitud');
    } finally {
      this.loading.set(false);
    }
  }
}
