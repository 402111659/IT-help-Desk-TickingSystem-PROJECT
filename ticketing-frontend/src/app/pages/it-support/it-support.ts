import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-it-support',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './it-support.html',
  styleUrl: './it-support.css'
})
export class ItSupport {

  userEmail = '';
  userInitial = '?';

  constructor(private router: Router) {
    this.loadUser();
  }

  loadUser(): void {
    const email = localStorage.getItem('userEmail');

    if (email) {
      this.userEmail = email;
      this.userInitial = email.charAt(0).toUpperCase();
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');

    this.router.navigate(['/login']);
  }
}