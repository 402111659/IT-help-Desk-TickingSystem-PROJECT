import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../auth/auth';

@Component({
  selector: 'app-register',
  standalone: true,

  imports: [
    FormsModule
  ],

  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {

  // =====================================================
  // REGISTRATION FORM
  // =====================================================

  firstName = '';

  lastName = '';

  email = '';

  password = '';

  confirmPassword = '';

  errorMessage = '';

  successMessage = '';

  loading = false;

  showPassword = false;

  showConfirmPassword = false;


  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(
    private auth: Auth,
    private router: Router
  ) {}


  // =====================================================
  // REGISTER
  // =====================================================

  register(): void {

    console.log('REGISTER BUTTON CLICKED');

    // Clear previous messages

    this.errorMessage = '';

    this.successMessage = '';


    // ===================================================
    // VALIDATION
    // ===================================================

    if (
      !this.firstName.trim() ||
      !this.lastName.trim() ||
      !this.email.trim() ||
      !this.password ||
      !this.confirmPassword
    ) {

      this.errorMessage =
        'Please complete all required fields.';

      return;
    }


    // ===================================================
    // PASSWORD MATCH
    // ===================================================

    if (
      this.password !== this.confirmPassword
    ) {

      this.errorMessage =
        'Passwords do not match.';

      return;
    }


    // ===================================================
    // PASSWORD LENGTH
    // ===================================================

    if (this.password.length < 6) {

      this.errorMessage =
        'Password must be at least 6 characters.';

      return;
    }


    // ===================================================
    // START LOADING
    // =====================================================

    this.loading = true;


    // ===================================================
    // REGISTER EMPLOYEE
    // ===================================================

    this.auth
      .register({

        firstName:
          this.firstName.trim(),

        lastName:
          this.lastName.trim(),

        email:
          this.email.trim(),

        password:
          this.password

      })
      .subscribe({

        // ===============================================
        // SUCCESS
        // ===============================================

        next: (response) => {

          console.log(
            'Registration successful:',
            response
          );


          this.loading = false;


          this.successMessage =
            'Account created successfully.';


          // =============================================
          // REDIRECT TO LOGIN
          // =============================================

          setTimeout(() => {

            this.router.navigate([
              '/login'
            ]);

          }, 1500);

        },


        // ===============================================
        // ERROR
        // ===============================================

        error: (error) => {

          console.error(
            'Registration failed:',
            error
          );


          this.loading = false;


          // =============================================
          // DUPLICATE EMAIL
          // =============================================

          if (error.status === 409) {

            this.errorMessage =
              'An account with this email already exists.';

          }


          // =============================================
          // VALIDATION ERROR
          // =============================================

          else if (error.status === 400) {

            this.errorMessage =
              'Please check your information and try again.';

          }


          // =============================================
          // SERVER ERROR
          // =============================================

          else if (error.status === 0) {

            this.errorMessage =
              'Cannot connect to the server. Make sure Spring Boot is running.';

          }


          // =============================================
          // OTHER ERROR
          // =============================================

          else {

            this.errorMessage =
              'Registration failed. Please try again.';

          }

        }

      });

  }


  // =====================================================
  // TOGGLE PASSWORD
  // =====================================================

  togglePassword(): void {

    this.showPassword =
      !this.showPassword;

  }


  // =====================================================
  // TOGGLE CONFIRM PASSWORD
  // =====================================================

  toggleConfirmPassword(): void {

    this.showConfirmPassword =
      !this.showConfirmPassword;

  }


  // =====================================================
  // BACK TO LOGIN
  // =====================================================

  goToLogin(): void {

    this.router.navigate([
      '/login'
    ]);

  }

}