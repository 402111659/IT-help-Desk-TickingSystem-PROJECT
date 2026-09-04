import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-oauth2-callback',
  standalone: true,
  templateUrl: './oauth2-callback.html',
  styleUrl: './oauth2-callback.css'
})
export class OAuth2Callback implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {

      const token = params['token'];
      const email = params['email'];
      const id = params['id'];

      console.log('Google OAuth callback received');

      // Make sure a token was received
      if (!token) {
        console.error('No JWT token received from Google login.');
        this.router.navigate(['/login']);
        return;
      }

      // Store JWT token
      localStorage.setItem('token', token);

      // Store email
      if (email) {
        localStorage.setItem('userEmail', email);
      }

      // Store user ID
      if (id) {
        localStorage.setItem('userId', id);
      }

      // Extract role from JWT
      const role = this.getRoleFromToken(token);

      if (!role) {
        console.error('Could not determine user role.');

        localStorage.clear();

        this.router.navigate(['/login']);

        return;
      }

      // Store role
      localStorage.setItem('role', role);

      console.log('Google login successful');
      console.log('Email:', email);
      console.log('User ID:', id);
      console.log('Role:', role);

      // Redirect user based on role
      switch (role) {

        case 'ADMIN':
          this.router.navigate(['/admin-dashboard']);
          break;

        case 'TECHNICIAN':
          this.router.navigate(['/technician-dashboard']);
          break;

        case 'EMPLOYEE':
          this.router.navigate(['/dashboard']);
          break;

        default:
          console.error('Unknown user role:', role);

          localStorage.clear();

          this.router.navigate(['/login']);
          break;
      }
    });
  }

  private getRoleFromToken(token: string): string | null {

    try {

      const parts = token.split('.');

      // JWT must contain header, payload and signature
      if (parts.length !== 3) {
        return null;
      }

      // Decode JWT payload
      const payload = JSON.parse(
        atob(parts[1])
      );

      const role = payload.role;

      if (!role) {
        return null;
      }

      return String(role).toUpperCase();

    } catch (error) {

      console.error(
        'Failed to decode JWT:',
        error
      );

      return null;
    }
  }
}