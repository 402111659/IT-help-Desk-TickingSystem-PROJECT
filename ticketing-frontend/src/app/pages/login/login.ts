import { Component } from '@angular/core';

import { FormsModule } from '@angular/forms';

import { Router } from '@angular/router';

import { RouterLink } from '@angular/router';

import { Auth } from '../../auth/auth';


@Component({
  selector: 'app-login',

  standalone: true,

  imports: [
    FormsModule,
    RouterLink
  ],

  templateUrl: './login.html',

  styleUrl: './login.css'
})
export class Login {

  // =====================================================
  // LOGIN FORM
  // =====================================================

  email = '';

  password = '';

  errorMessage = '';

  loading = false;


  // =====================================================
  // PASSWORD VISIBILITY
  // =====================================================

  showPassword = false;


  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(
    private auth: Auth,
    private router: Router
  ) {}


  // =====================================================
  // TOGGLE PASSWORD VISIBILITY
  // =====================================================

  togglePassword(): void {

    this.showPassword =
      !this.showPassword;

  }


  // =====================================================
  // GOOGLE LOGIN
  // =====================================================

  continueWithGoogle(): void {

    console.log(
      'Starting Google authentication...'
    );


    // ===================================================
    // REDIRECT TO AWS SPRING BOOT GOOGLE OAUTH2
    // ===================================================

    window.location.href =
      'http://ticketingsystem-prod.eba-89fs2nnj.us-east-1.elasticbeanstalk.com/oauth2/authorization/google';

  }


  // =====================================================
  // LOGIN
  // =====================================================

  login(): void {

    console.log(
      'LOGIN BUTTON CLICKED'
    );


    // Clear previous error

    this.errorMessage = '';


    // ===================================================
    // VALIDATION
    // ===================================================

    if (
      !this.email.trim() ||
      !this.password
    ) {

      this.errorMessage =
        'Please enter your email and password.';

      return;

    }


    // ===================================================
    // START LOADING
    // ===================================================

    this.loading = true;


    // ===================================================
    // LOGIN REQUEST
    // ===================================================

    this.auth
      .login({
        email: this.email.trim(),
        password: this.password
      })
      .subscribe({

        // =================================================
        // LOGIN SUCCESS
        // =================================================

        next: (response) => {

          console.log(
            'Login successful'
          );


          console.log(
            'JWT:',
            response.token
          );


          // =================================================
          // GET ROLE FROM JWT
          // =================================================

          const role =
            this.getRoleFromToken(
              response.token
            );


          console.log(
            'Logged in user role:',
            role
          );


          // =================================================
          // INVALID ROLE
          // =================================================

          if (!role) {

            console.error(
              'No valid role found in JWT.'
            );


            this.loading = false;


            this.errorMessage =
              'Your account has an invalid role.';

            return;

          }


          // =================================================
          // CLEAR OLD SESSION DATA
          // =================================================

          localStorage.removeItem(
            'token'
          );

          localStorage.removeItem(
            'userEmail'
          );

          localStorage.removeItem(
            'userId'
          );

          localStorage.removeItem(
            'role'
          );


          // =================================================
          // SAVE NEW JWT
          // =================================================

          localStorage.setItem(
            'token',
            response.token
          );


          // =================================================
          // SAVE EMAIL
          // =================================================

          localStorage.setItem(
            'userEmail',
            response.email
          );


          // =================================================
          // SAVE USER ID
          // =================================================

          if (
            response.id !== undefined &&
            response.id !== null
          ) {

            localStorage.setItem(
              'userId',
              response.id.toString()
            );

          }


          // =================================================
          // SAVE USER ROLE
          // =================================================

          localStorage.setItem(
            'role',
            role
          );


          console.log(
            'Session saved:',
            {
              email: response.email,
              role: role,
              userId: response.id
            }
          );


          // =================================================
          // STOP LOADING
          // =================================================

          this.loading = false;


          // =================================================
          // ROLE-BASED REDIRECT
          // =================================================

          switch (role) {

            // ===============================================
            // ADMIN
            // ===============================================

            case 'ADMIN':

              console.log(
                'Redirecting ADMIN to admin dashboard...'
              );


              this.router.navigate([
                '/admin-dashboard'
              ]);

              break;


            // ===============================================
            // TECHNICIAN
            // ===============================================

            case 'TECHNICIAN':

              console.log(
                'Redirecting TECHNICIAN to technician dashboard...'
              );


              this.router.navigate([
                '/technician-dashboard'
              ]);

              break;


            // ===============================================
            // EMPLOYEE
            // ===============================================

            case 'EMPLOYEE':

              console.log(
                'Redirecting EMPLOYEE to employee dashboard...'
              );


              this.router.navigate([
                '/dashboard'
              ]);

              break;


            // ===============================================
            // UNKNOWN ROLE
            // ===============================================

            default:

              console.error(
                'Unknown user role:',
                role
              );


              // Clear invalid session

              localStorage.removeItem(
                'token'
              );

              localStorage.removeItem(
                'userEmail'
              );

              localStorage.removeItem(
                'userId'
              );

              localStorage.removeItem(
                'role'
              );


              this.errorMessage =
                'Your account has an invalid role.';

              break;

          }

        },


        // =================================================
        // LOGIN ERROR
        // =================================================

        error: (error) => {

          console.error(
            'Login failed:',
            error
          );


          this.loading = false;


          // ===============================================
          // UNAUTHORIZED
          // ===============================================

          if (error.status === 401) {

            this.errorMessage =
              'Invalid email or password.';

          }


          // ===============================================
          // FORBIDDEN
          // ===============================================

          else if (error.status === 403) {

            this.errorMessage =
              'Access denied.';

          }


          // ===============================================
          // SERVER NOT AVAILABLE
          // ===============================================

          else if (error.status === 0) {

            this.errorMessage =
              'Cannot connect to the server. Make sure Spring Boot is running.';

          }


          // ===============================================
          // OTHER ERROR
          // ===============================================

          else {

            this.errorMessage =
              'Login failed. Please try again.';

          }

        }

      });

  }


  // =====================================================
  // READ ROLE FROM JWT
  // =====================================================

  private getRoleFromToken(
    token: string
  ): string | null {

    try {

      // =================================================
      // JWT FORMAT
      //
      // HEADER.PAYLOAD.SIGNATURE
      // =================================================

      const parts =
        token.split('.');


      if (parts.length !== 3) {

        console.error(
          'Invalid JWT format.'
        );

        return null;

      }


      // =================================================
      // GET PAYLOAD
      // =================================================

      const payload =
        parts[1];


      // =================================================
      // DECODE PAYLOAD
      // =================================================

      const decodedPayload =
        JSON.parse(
          atob(payload)
        );


      console.log(
        'JWT payload:',
        decodedPayload
      );


      // =================================================
      // GET ROLE
      // =================================================

      const role =
        decodedPayload.role;


      if (!role) {

        return null;

      }


      // =================================================
      // NORMALIZE ROLE
      // =================================================

      return String(
        role
      ).trim().toUpperCase();

    }

    catch (error) {

      console.error(
        'Unable to read JWT:',
        error
      );


      return null;

    }

  }

}