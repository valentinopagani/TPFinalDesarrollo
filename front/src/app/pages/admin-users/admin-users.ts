import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { UsersService } from '../../services/users.service';
import { SafeUser, UserRole } from '../../models/user';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-users',
  imports: [DatePipe, FormsModule],
  templateUrl: './admin-users.html',
  styleUrl: './admin-users.css',
})
export class AdminUsersPage implements OnInit {
  private usersService = inject(UsersService);
  auth = inject(AuthService);

  users = signal<SafeUser[]>([]);
  error = '';

  async ngOnInit(): Promise<void> {
    try {
      const users = await firstValueFrom(this.usersService.findAll());
      this.users.set(users);
    } catch {
      this.error = 'Error al cargar usuarios';
    }
  }

  async changeRole(userId: string, role: UserRole): Promise<void> {
    try {
      const updated = await firstValueFrom(this.usersService.updateRole(userId, { role }));
      this.users.update((users) =>
        users.map((u) => (u.id === updated.id ? updated : u)),
      );
    } catch (err: any) {
      this.error = err.error?.message || 'Error al cambiar rol';
    }
  }
}
