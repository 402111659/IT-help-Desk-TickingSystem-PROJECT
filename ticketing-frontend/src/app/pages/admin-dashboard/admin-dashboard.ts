import {
  Component,
  ChangeDetectorRef
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

import {
  Router,
  RouterLink
} from '@angular/router';

import {
  TicketService,
  Ticket
} from '../../services/ticket.service';


@Component({
  selector: 'app-admin-dashboard',

  standalone: true,

  imports: [
    CommonModule,
    RouterLink,
    FormsModule
  ],

  templateUrl: './admin-dashboard.html',

  styleUrl: './admin-dashboard.css'
})
export class AdminDashboard {

  // =====================================================
  // ADMIN USER
  // =====================================================

  userEmail = '';

  userInitial = '?';

  currentDate = '';


  // =====================================================
  // TICKETS
  // =====================================================

  tickets: Ticket[] = [];


  // =====================================================
  // TICKET STATISTICS
  // =====================================================

  totalTickets = 0;

  openTickets = 0;

  inProgressTickets = 0;

  resolvedTickets = 0;

  closedTickets = 0;


  // =====================================================
  // PAGE STATE
  // =====================================================

  loadingTickets = false;

  ticketError = '';


  // =====================================================
  // SEARCH
  // =====================================================

  searchTerm = '';


  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(
    private router: Router,

    private ticketService: TicketService,

    private changeDetectorRef: ChangeDetectorRef
  ) {

    /*
     * First verify that the logged-in user
     * is actually an administrator.
     */

    if (!this.checkAdmin()) {
      return;
    }

    this.loadAdmin();

    this.setDate();

    this.loadTickets();

  }


  // =====================================================
  // CHECK ADMIN ROLE
  // =====================================================

  checkAdmin(): boolean {

    const role =
      localStorage.getItem('role');


    console.log(
      'Admin dashboard role:',
      role
    );


    // ===================================================
    // ADMIN IS ALLOWED
    // ===================================================

    if (role === 'ADMIN') {

      return true;

    }


    // ===================================================
    // TECHNICIAN
    // ===================================================

    if (role === 'TECHNICIAN') {

      console.warn(
        'Technician attempted to access admin dashboard.'
      );


      this.router.navigate([
        '/technician-dashboard'
      ]);


      return false;

    }


    // ===================================================
    // EMPLOYEE / UNKNOWN
    // ===================================================

    console.warn(
      'Unauthorized user attempted to access admin dashboard.'
    );


    this.router.navigate([
      '/dashboard'
    ]);


    return false;

  }


  // =====================================================
  // LOAD ADMIN USER
  // =====================================================

  loadAdmin(): void {

    const email =
      localStorage.getItem('userEmail');


    if (email) {

      this.userEmail = email;

      this.userInitial =
        email.charAt(0).toUpperCase();

    }

  }


  // =====================================================
  // SET CURRENT DATE
  // =====================================================

  setDate(): void {

    this.currentDate =
      new Date().toLocaleDateString(
        'en-ZA',
        {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }
      );

  }


  // =====================================================
  // LOAD ALL TICKETS
  // =====================================================

  loadTickets(): void {

    console.log(
      'Loading all tickets for admin...'
    );


    this.loadingTickets = true;

    this.ticketError = '';


    this.ticketService
      .getAllTickets()
      .subscribe({

        // =================================================
        // SUCCESS
        // =================================================

        next: (tickets: Ticket[]) => {

          console.log(
            'Admin tickets received:',
            tickets
          );


          // ===============================================
          // STORE TICKETS
          // ===============================================

          this.tickets =
            tickets;


          // ===============================================
          // TOTAL
          // ===============================================

          this.totalTickets =
            tickets.length;


          // ===============================================
          // OPEN
          // ===============================================

          this.openTickets =
            tickets.filter(
              ticket =>
                ticket.status === 'OPEN'
            ).length;


          // ===============================================
          // IN PROGRESS
          // ===============================================

          this.inProgressTickets =
            tickets.filter(
              ticket =>
                ticket.status === 'IN_PROGRESS'
            ).length;


          // ===============================================
          // RESOLVED
          // ===============================================

          this.resolvedTickets =
            tickets.filter(
              ticket =>
                ticket.status === 'RESOLVED'
            ).length;


          // ===============================================
          // CLOSED
          // ===============================================

          this.closedTickets =
            tickets.filter(
              ticket =>
                ticket.status === 'CLOSED'
            ).length;


          // ===============================================
          // STOP LOADING
          // ===============================================

          this.loadingTickets = false;


          // ===============================================
          // DEBUG
          // ===============================================

          console.log(
            'Admin ticket statistics:',
            {
              total: this.totalTickets,
              open: this.openTickets,
              inProgress: this.inProgressTickets,
              resolved: this.resolvedTickets,
              closed: this.closedTickets
            }
          );


          // ===============================================
          // UPDATE UI
          // ===============================================

          this.changeDetectorRef.detectChanges();

        },


        // =================================================
        // ERROR
        // =================================================

        error: (error) => {

          console.error(
            'Failed to load admin tickets:',
            error
          );


          this.loadingTickets = false;


          // ===============================================
          // UNAUTHORIZED
          // ===============================================

          if (error.status === 401) {

            this.ticketError =
              'Your session has expired. Please log in again.';

          }


          // ===============================================
          // FORBIDDEN
          // ===============================================

          else if (error.status === 403) {

            this.ticketError =
              'You do not have permission to access the admin dashboard.';

          }


          // ===============================================
          // NOT FOUND
          // ===============================================

          else if (error.status === 404) {

            this.ticketError =
              'The tickets endpoint could not be found.';

          }


          // ===============================================
          // OTHER ERROR
          // ===============================================

          else {

            this.ticketError =
              'Unable to load tickets from the server.';

          }


          this.changeDetectorRef.detectChanges();

        }

      });

  }


  // =====================================================
  // FILTERED TICKETS
  // =====================================================

  get filteredTickets(): Ticket[] {

    const search =
      this.searchTerm
        .trim()
        .toLowerCase();


    // ===================================================
    // NO SEARCH
    // ===================================================

    if (!search) {

      return this.tickets.slice(0, 8);

    }


    // ===================================================
    // SEARCH
    // ===================================================

    return this.tickets
      .filter(ticket => {

        return (

          String(
            ticket.ticketNumber ?? ''
          )
            .toLowerCase()
            .includes(search)

          ||

          String(
            ticket.title ?? ''
          )
            .toLowerCase()
            .includes(search)

          ||

          String(
            ticket.description ?? ''
          )
            .toLowerCase()
            .includes(search)

          ||

          String(
            ticket.status ?? ''
          )
            .toLowerCase()
            .includes(search)

          ||

          String(
            ticket.priority ?? ''
          )
            .toLowerCase()
            .includes(search)

        );

      })
      .slice(0, 8);

  }


  // =====================================================
  // VIEW ADMIN TICKET
  // =====================================================

  viewTicket(ticketId: number): void {

    console.log(
      'Admin opening ticket:',
      ticketId
    );


    /*
     * ADMIN / TECHNICIAN:
     *
     * /tickets/:id
     *
     * EMPLOYEE:
     *
     * /employee-ticket-details/:id
     */

    this.router.navigate([
      '/tickets',
      ticketId
    ]);

  }


  // =====================================================
  // RETURN TO ADMIN DASHBOARD
  // =====================================================

  goToDashboard(): void {

    this.router.navigate([
      '/admin-dashboard'
    ]);

  }


  // =====================================================
  // LOGOUT
  // =====================================================

  logout(): void {

    console.log(
      'Admin logging out...'
    );


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


    this.router.navigate([
      '/login'
    ]);

  }

}