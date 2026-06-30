import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { UsersService } from '../../services/users.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-profile',
  imports: [DatePipe, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class ProfilePage {
  auth = inject(AuthService);
  private users = inject(UsersService);
  private toast = inject(ToastService);

  // Cambiar contraseña
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';
  pwLoading = signal(false);

  // Cambiar email
  newEmail = '';
  emailPassword = '';
  emailLoading = signal(false);

  // Reenviar verificación
  resendLoading = signal(false);

  async changePassword(): Promise<void> {
    if (this.newPassword !== this.confirmPassword) {
      this.toast.error('Las contraseñas no coinciden');
      return;
    }
    this.pwLoading.set(true);
    try {
      const res = await firstValueFrom(
        this.users.changePassword({
          currentPassword: this.currentPassword,
          newPassword: this.newPassword,
        }),
      );
      this.toast.success(res.message || 'Contraseña actualizada');
      this.currentPassword = '';
      this.newPassword = '';
      this.confirmPassword = '';
    } catch (err: any) {
      this.toast.error(err.error?.message || 'No se pudo cambiar la contraseña');
    } finally {
      this.pwLoading.set(false);
    }
  }

  async changeEmail(): Promise<void> {
    this.emailLoading.set(true);
    try {
      const res = await firstValueFrom(
        this.users.changeEmail({
          newEmail: this.newEmail,
          password: this.emailPassword,
        }),
      );
      this.toast.success(res.message || 'Email actualizado');
      this.newEmail = '';
      this.emailPassword = '';
      this.auth.me().subscribe(); // refrescar datos del usuario
    } catch (err: any) {
      this.toast.error(err.error?.message || 'No se pudo cambiar el email');
    } finally {
      this.emailLoading.set(false);
    }
  }

  async resend(): Promise<void> {
    this.resendLoading.set(true);
    try {
      const res = await firstValueFrom(this.auth.resendVerification());
      this.toast.success(res.message || 'Email de verificación reenviado');
    } catch (err: any) {
      this.toast.error(err.error?.message || 'No se pudo reenviar el email');
    } finally {
      this.resendLoading.set(false);
    }
  }
}
