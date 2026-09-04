import {
  Component,
  ChangeDetectorRef
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  Router,
  RouterLink
} from '@angular/router';

import {
  FormsModule
} from '@angular/forms';

import {
  TicketService,
  Ticket
} from '../../services/ticket.service';


@Component({
  selector: 'app-tickets',

  standalone: true,

  imports: [
    CommonModule,
    RouterLink,
    FormsModule
  ],

  templateUrl: './tickets.html',

  styleUrl: './tickets.css'
})
export class Tickets {

  // =====================================================
  // TICKETS
  // =====================================================

  tickets: Ticket[] = [];

  loading = false;

  errorMessage = '';


  // =====================================================
  // SEARCH / FILTER
  // =====================================================

  searchTerm = '';

  selectedStatus = 'ALL';

  selectedPriority = 'ALL';


  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(
    private ticketService: TicketService,

    private router: Router,

    private changeDetectorRef: ChangeDetectorRef
  ) {

    this.loadTickets();

  }


  // =====================================================
  // GET CURRENT USER ROLE
  // =====================================================

  getUserRole(): string {

    // -----------------------------------------------------
    // FIRST: CHECK SAVED ROLE
    // -----------------------------------------------------

    const savedRole =
      localStorage.getItem('role');


    if (savedRole) {

      return savedRole.toUpperCase();

    }


    // -----------------------------------------------------
    // SECOND: READ ROLE FROM JWT
    // -----------------------------------------------------

    const token =
      localStorage.getItem('token');


    if (!token) {

      console.warn(
        'No JWT token found.'
      );

      return '';

    }


    try {

      const payload =
        token.split('.')[1];


      if (!payload) {

        console.warn(
          'JWT payload not found.'
        );

        return '';

      }


      const decodedPayload =
        JSON.parse(
          atob(payload)
        );


      const role =
        decodedPayload.role;


      if (!role) {

        console.warn(
          'No role found inside JWT.'
        );

        return '';

      }


      const normalizedRole =
        String(role).toUpperCase();


      // -----------------------------------------------------
      // SAVE ROLE
      // -----------------------------------------------------

      localStorage.setItem(
        'role',
        normalizedRole
      );


      console.log(
        'Role recovered from JWT:',
        normalizedRole
      );


      return normalizedRole;

    }

    catch (error) {

      console.error(
        'Unable to read role from JWT:',
        error
      );


      return '';

    }

  }


  // =====================================================
  // LOAD ALL TICKETS
  // =====================================================

  loadTickets(): void {

    console.log(
      'Loading all tickets...'
    );


    this.loading = true;

    this.errorMessage = '';


    this.ticketService
      .getAllTickets()
      .subscribe({

        // =================================================
        // SUCCESS
        // =================================================

        next: (tickets: Ticket[]) => {

          console.log(
            'All tickets received:',
            tickets
          );


          this.tickets =
            tickets;


          console.log(
            'Total tickets:',
            this.tickets.length
          );


          this.loading =
            false;


          this.changeDetectorRef
            .detectChanges();

        },


        // =================================================
        // ERROR
        // =================================================

        error: (error) => {

          console.error(
            'Failed to load tickets:',
            error
          );


          this.loading =
            false;


          // ------------------------------------------------
          // UNAUTHORIZED
          // ------------------------------------------------

          if (error.status === 401) {

            this.errorMessage =
              'Your session has expired. Please log in again.';

          }


          // ------------------------------------------------
          // FORBIDDEN
          // ------------------------------------------------

          else if (error.status === 403) {

            this.errorMessage =
              'You do not have permission to view all tickets.';

          }


          // ------------------------------------------------
          // NOT FOUND
          // ------------------------------------------------

          else if (error.status === 404) {

            this.errorMessage =
              'The tickets endpoint could not be found.';

          }


          // ------------------------------------------------
          // SERVER / CONNECTION ERROR
          // ------------------------------------------------

          else if (error.status === 0) {

            this.errorMessage =
              'Unable to connect to the server. Make sure Spring Boot is running.';

          }


          // ------------------------------------------------
          // OTHER ERROR
          // ------------------------------------------------

          else {

            this.errorMessage =
              'Unable to load tickets from the server.';

          }


          this.changeDetectorRef
            .detectChanges();

        }

      });

  }


  // =====================================================
  // FILTERED TICKETS
  // =====================================================

  get filteredTickets(): Ticket[] {

    return this.tickets.filter(
      (ticket: Ticket) => {

        // -------------------------------------------------
        // SEARCH VALUE
        // -------------------------------------------------

        const search =
          this.searchTerm
            .trim()
            .toLowerCase();


        // -------------------------------------------------
        // SEARCH MATCH
        // -------------------------------------------------

        const matchesSearch =

          search === '' ||

          String(
            ticket.ticketNumber ?? ''
          )
            .toLowerCase()
            .includes(search) ||

          String(
            ticket.title ?? ''
          )
            .toLowerCase()
            .includes(search) ||

          String(
            ticket.description ?? ''
          )
            .toLowerCase()
            .includes(search);


        // -------------------------------------------------
        // STATUS MATCH
        // -------------------------------------------------

        const matchesStatus =

          this.selectedStatus === 'ALL' ||

          ticket.status ===
            this.selectedStatus;


        // -------------------------------------------------
        // PRIORITY MATCH
        // -------------------------------------------------

        const matchesPriority =

          this.selectedPriority === 'ALL' ||

          ticket.priority ===
            this.selectedPriority;


        // -------------------------------------------------
        // FINAL RESULT
        // -------------------------------------------------

        return (
          matchesSearch &&
          matchesStatus &&
          matchesPriority
        );

      }
    );

  }


  // =====================================================
  // OPEN TICKET
  // =====================================================

  openTicket(
    id: number
  ): void {

    console.log(
      'Opening ticket:',
      id
    );


    this.router.navigate([
      '/tickets',
      id
    ]);

  }


  // =====================================================
  // BACK TO CORRECT DASHBOARD
  // =====================================================

  backToDashboard(): void {

    const role =
      this.getUserRole();


    console.log(
      '======================================'
    );

    console.log(
      'TICKETS PAGE DASHBOARD BUTTON'
    );

    console.log(
      'Current user role:',
      role
    );

    console.log(
      '======================================'
    );


    // ===================================================
    // ADMIN
    // ===================================================

    if (role === 'ADMIN') {

      console.log(
        'ADMIN -> /admin-dashboard'
      );


      this.router.navigateByUrl(
        '/admin-dashboard'
      );


      return;

    }


    // ===================================================
    // TECHNICIAN
    // ===================================================

    if (role === 'TECHNICIAN') {

      console.log(
        'TECHNICIAN -> /technician-dashboard'
      );


      this.router.navigateByUrl(
        '/technician-dashboard'
      );


      return;

    }


    // ===================================================
    // EMPLOYEE
    // ===================================================

    if (role === 'EMPLOYEE') {

      console.log(
        'EMPLOYEE -> /dashboard'
      );


      this.router.navigateByUrl(
        '/dashboard'
      );


      return;

    }


    // ===================================================
    // UNKNOWN ROLE
    // ===================================================

    console.warn(
      'Unknown role:',
      role
    );


    console.warn(
      'Returning to login.'
    );


    this.router.navigateByUrl(
      '/login'
    );

  }


  // =====================================================
  // LOGOUT
  // =====================================================

  logout(): void {

    console.log(
      'Logging out...'
    );


    // -----------------------------------------------------
    // CLEAR SESSION
    // -----------------------------------------------------

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


    // -----------------------------------------------------
    // RETURN TO LOGIN
    // -----------------------------------------------------

    this.router.navigateByUrl(
      '/login'
    );

  }

}