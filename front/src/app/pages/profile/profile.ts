import { Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  imports: [DatePipe],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class ProfilePage {
  auth = inject(AuthService);
}
