import { Component } from '@angular/core';
import {
  FormsModule
} from '@angular/forms';

import {
  Router,
  RouterLink
} from '@angular/router';

import {
  TicketService
} from '../../services/ticket.service';


@Component({
  selector: 'app-create-ticket',

  standalone: true,

  imports: [
    FormsModule,
    RouterLink
  ],

  templateUrl: './create-ticket.html',

  styleUrl: './create-ticket.css'
})
export class CreateTicket {

  title = '';

  description = '';

  priority = 'MEDIUM';

  loading = false;

  successMessage = '';

  errorMessage = '';


  constructor(
    private ticketService: TicketService,
    private router: Router
  ) {}


  /* =====================================================
     GET USER ROLE
     ===================================================== */

  private getUserRole(): string {

    const token =
      localStorage.getItem('token');

    if (!token) {
      return '';
    }

    try {

      const payload =
        JSON.parse(
          atob(
            token.split('.')[1]
          )
        );

      return payload.role || '';

    } catch (error) {

      console.error(
        'Unable to read user role from JWT:',
        error
      );

      return '';
    }
  }


  /* =====================================================
     NAVIGATE TO DASHBOARD
     ===================================================== */

  private navigateToDashboard(): void {

    const role =
      this.getUserRole();

    console.log(
      'User role:',
      role
    );


    if (role === 'ADMIN') {

      this.router.navigate([
        '/dashboard'
      ]);

      return;
    }


    if (role === 'TECHNICIAN') {

      this.router.navigate([
        '/technician-dashboard'
      ]);

      return;
    }


    this.router.navigate([
      '/dashboard'
    ]);
  }


  /* =====================================================
     CREATE TICKET
     ===================================================== */

  createTicket(): void {

    this.successMessage = '';

    this.errorMessage = '';


    /* -----------------------------
       VALIDATION
       ----------------------------- */

    if (!this.title.trim()) {

      this.errorMessage =
        'Please enter a ticket title.';

      return;
    }


    if (!this.description.trim()) {

      this.errorMessage =
        'Please describe the issue you are experiencing.';

      return;
    }


    if (this.title.length > 100) {

      this.errorMessage =
        'Ticket title cannot exceed 100 characters.';

      return;
    }


    if (this.description.length > 2000) {

      this.errorMessage =
        'Description cannot exceed 2000 characters.';

      return;
    }


    /* -----------------------------
       START LOADING
       ----------------------------- */

    this.loading = true;


    const ticket = {

      title:
        this.title.trim(),

      description:
        this.description.trim(),

      priority:
        this.priority,

      status:
        'OPEN'
    };


    console.log(
      'Creating ticket:',
      ticket
    );


    /* -----------------------------
       SEND TO BACKEND
       ----------------------------- */

    this.ticketService
      .createTicket(ticket)
      .subscribe({

        next: (response) => {

          console.log(
            'Ticket created successfully:',
            response
          );


          this.loading = false;


          this.successMessage =
            'Ticket created successfully.';


          /* Clear form */

          this.title = '';

          this.description = '';

          this.priority = 'MEDIUM';


          /* Return to dashboard */

          setTimeout(() => {

            this.navigateToDashboard();

          }, 1000);
        },


        error: (error) => {

          console.error(
            'Failed to create ticket:',
            error
          );


          this.loading = false;


          if (error.status === 400) {

            this.errorMessage =
              'Invalid ticket information. Please check your details.';

          } else if (error.status === 401) {

            this.errorMessage =
              'Your session has expired. Please log in again.';

          } else if (error.status === 403) {

            this.errorMessage =
              'You do not have permission to create a ticket.';

          } else if (error.status === 0) {

            this.errorMessage =
              'Cannot connect to the server. Make sure Spring Boot is running.';

          } else {

            this.errorMessage =
              'Unable to create ticket. Please try again.';
          }
        }
      });
  }


  /* =====================================================
     CANCEL
     ===================================================== */

  cancel(): void {

    console.log(
      'Cancelling ticket creation...'
    );

    this.navigateToDashboard();
  }

}