import {
  Component,
  ChangeDetectorRef
} from '@angular/core';

import {
  Router,
  RouterLink
} from '@angular/router';

import {
  TicketService,
  Ticket
} from '../../services/ticket.service';


@Component({
  selector: 'app-dashboard',

  standalone: true,

  imports: [
    RouterLink
  ],

  templateUrl: './dashboard.html',

  styleUrl: './dashboard.css'
})
export class Dashboard {

  // =====================================================
  // USER
  // =====================================================

  userEmail = '';

  userName = '';

  userInitial = '?';

  currentDate = '';


  // =====================================================
  // EMPLOYEE TICKETS
  // =====================================================

  tickets: Ticket[] = [];


  // =====================================================
  // TICKET STATISTICS
  // =====================================================

  openTickets = 0;

  inProgressTickets = 0;

  resolvedTickets = 0;

  closedTickets = 0;

  totalTickets = 0;


  // =====================================================
  // PAGE STATE
  // =====================================================

  loadingTickets = false;

  ticketError = '';


  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(
    private router: Router,

    private ticketService: TicketService,

    private changeDetectorRef: ChangeDetectorRef
  ) {

    this.loadUser();

    this.setDate();

    this.loadTickets();

  }


  // =====================================================
  // LOAD LOGGED-IN EMPLOYEE
  // =====================================================

  loadUser(): void {

    const email =
      localStorage.getItem('userEmail');

    if (email) {

      // Store the complete email
      this.userEmail = email;


      // =================================================
      // EXTRACT NAME FROM EMAIL
      // =================================================
      //
      // Example:
      //
      // fatah.abdullahi@gmail.com
      //
      // becomes:
      //
      // fatah.abdullahi
      //
      // =================================================

      this.userName =
        email.split('@')[0];


      // =================================================
      // CAPITALIZE FIRST LETTER
      // =================================================

      this.userName =
        this.userName.charAt(0).toUpperCase() +
        this.userName.slice(1);


      // =================================================
      // USER AVATAR INITIAL
      // =================================================

      this.userInitial =
        this.userName.charAt(0).toUpperCase();

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
  // LOAD EMPLOYEE'S OWN TICKETS
  // =====================================================

  loadTickets(): void {

    console.log(
      'Loading employee tickets...'
    );

    this.loadingTickets = true;

    this.ticketError = '';


    this.ticketService
      .getMyTickets()
      .subscribe({

        // ===============================================
        // SUCCESS
        // ===============================================

        next: (tickets: Ticket[]) => {

          console.log(
            'Employee tickets received:',
            tickets
          );


          // Store employee tickets

          this.tickets = tickets;


          // =============================================
          // TOTAL
          // =============================================

          this.totalTickets =
            tickets.length;


          // =============================================
          // OPEN
          // =============================================

          this.openTickets =
            tickets.filter(
              ticket =>
                ticket.status === 'OPEN'
            ).length;


          // =============================================
          // IN PROGRESS
          // =============================================

          this.inProgressTickets =
            tickets.filter(
              ticket =>
                ticket.status === 'IN_PROGRESS'
            ).length;


          // =============================================
          // RESOLVED
          // =============================================

          this.resolvedTickets =
            tickets.filter(
              ticket =>
                ticket.status === 'RESOLVED'
            ).length;


          // =============================================
          // CLOSED
          // =============================================

          this.closedTickets =
            tickets.filter(
              ticket =>
                ticket.status === 'CLOSED'
            ).length;


          // =============================================
          // DEBUG
          // =============================================

          console.log(
            'Employee ticket statistics:',
            {
              open: this.openTickets,
              inProgress: this.inProgressTickets,
              resolved: this.resolvedTickets,
              closed: this.closedTickets,
              total: this.totalTickets
            }
          );


          // Stop loading

          this.loadingTickets = false;


          // Update UI

          this.changeDetectorRef.detectChanges();

        },


        // ===============================================
        // ERROR
        // ===============================================

        error: (error) => {

          console.error(
            'Failed to load employee tickets:',
            error
          );


          this.loadingTickets = false;


          if (error.status === 401) {

            this.ticketError =
              'Your session has expired. Please log in again.';

          }

          else if (error.status === 403) {

            this.ticketError =
              'You do not have permission to view your tickets.';

          }

          else if (error.status === 404) {

            this.ticketError =
              'The employee tickets endpoint was not found.';

          }

          else {

            this.ticketError =
              'Unable to load your tickets from the server.';

          }


          this.changeDetectorRef.detectChanges();

        }

      });

  }


  // =====================================================
  // VIEW EMPLOYEE TICKET
  // =====================================================

  viewTicket(ticketId: number): void {

    console.log(
      'Opening employee ticket:',
      ticketId
    );


    // IMPORTANT:
    // Employees go to the employee ticket details page.
    //
    // Example:
    // /employee-ticket-details/9
    //
    // This is NOT the admin/technician page:
    // /tickets/9

    this.router.navigate([
      '/employee-ticket-details',
      ticketId
    ]);

  }


  // =====================================================
  // LOGOUT
  // =====================================================

  logout(): void {

    localStorage.removeItem('token');

    localStorage.removeItem('userEmail');

    localStorage.removeItem('userId');

    localStorage.removeItem('role');


    this.router.navigate([
      '/login'
    ]);

  }

}