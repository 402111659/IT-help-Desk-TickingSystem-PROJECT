import { Component } from '@angular/core';

import {
  FormsModule
} from '@angular/forms';

import {
  Router,
  RouterLink
} from '@angular/router';

import {
  UserService,
  CreateTechnicianRequest
} from '../../services/user.service';


@Component({
  selector: 'app-create-technician',

  standalone: true,

  imports: [
    FormsModule,
    RouterLink
  ],

  templateUrl: './create-technician.html',

  styleUrl: './create-technician.css'
})
export class CreateTechnician {

  firstName = '';

  lastName = '';

  email = '';

  password = '';

  loading = false;

  successMessage = '';

  errorMessage = '';


  constructor(
    private userService: UserService,
    private router: Router
  ) {}


  // =====================================================
  // CREATE TECHNICIAN
  // =====================================================

  createTechnician(): void {

    this.successMessage = '';

    this.errorMessage = '';


    // -----------------------------------------------------
    // VALIDATION
    // -----------------------------------------------------

    if (!this.firstName.trim()) {

      this.errorMessage =
        'Please enter the technician first name.';

      return;

    }


    if (!this.lastName.trim()) {

      this.errorMessage =
        'Please enter the technician last name.';

      return;

    }


    if (!this.email.trim()) {

      this.errorMessage =
        'Please enter the technician email.';

      return;

    }


    if (!this.email.includes('@')) {

      this.errorMessage =
        'Please enter a valid email address.';

      return;

    }


    if (!this.password) {

      this.errorMessage =
        'Please enter a temporary password.';

      return;

    }


    if (this.password.length < 6) {

      this.errorMessage =
        'Password must contain at least 6 characters.';

      return;

    }


    // -----------------------------------------------------
    // REQUEST
    // -----------------------------------------------------

    const technician: CreateTechnicianRequest = {

      firstName:
        this.firstName.trim(),

      lastName:
        this.lastName.trim(),

      email:
        this.email.trim(),

      password:
        this.password

    };


    console.log(
      'Creating technician:',
      technician
    );


    this.loading = true;


    // -----------------------------------------------------
    // SEND REQUEST
    // -----------------------------------------------------

    this.userService
      .createTechnician(technician)
      .subscribe({

        next: (response) => {

          console.log(
            'Technician created successfully:',
            response
          );


          this.loading = false;


          this.successMessage =
            'Technician created successfully.';


          // Clear form

          this.firstName = '';

          this.lastName = '';

          this.email = '';

          this.password = '';


          // Return to users page

          setTimeout(() => {

            this.router.navigate([
              '/users'
            ]);

          }, 1000);

        },


        error: (error) => {

          console.error(
            'Failed to create technician:',
            error
          );


          this.loading = false;


          // -------------------------------------------------
          // ERROR HANDLING
          // -------------------------------------------------

          if (error.status === 400) {

            this.errorMessage =
              'Invalid technician information. Please check your details.';

          }

          else if (error.status === 401) {

            this.errorMessage =
              'Your session has expired. Please log in again.';

          }

          else if (error.status === 403) {

            this.errorMessage =
              'You do not have permission to create a technician.';

          }

          else if (error.status === 409) {

            this.errorMessage =
              'A user with this email already exists.';

          }

          else if (error.status === 0) {

            this.errorMessage =
              'Cannot connect to the server. Make sure Spring Boot is running.';

          }

          else {

            this.errorMessage =
              'Unable to create technician. Please try again.';

          }

        }

      });

  }


  // =====================================================
  // CANCEL
  // =====================================================

  cancel(): void {

    this.router.navigate([
      '/users'
    ]);

  }

}