import {
  Component,
  ChangeDetectorRef,
  AfterViewInit,
  ElementRef,
  ViewChild
} from '@angular/core';

import {
  Router,
  RouterLink
} from '@angular/router';

import {
  CommonModule
} from '@angular/common';

import {
  TicketService,
  Ticket
} from '../../services/ticket.service';


@Component({
  selector: 'app-technician-dashboard',

  standalone: true,

  imports: [
    CommonModule,
    RouterLink
  ],

  templateUrl: './technician-dashboard.html',

  styleUrl: './technician-dashboard.css'
})
export class TechnicianDashboard implements AfterViewInit {

  // =====================================================
  // ASSIGNED TICKETS SECTION
  // =====================================================

  @ViewChild('assignedTicketsSection')
  assignedTicketsSection!: ElementRef<HTMLElement>;


  // =====================================================
  // TICKETS
  // =====================================================

  tickets: Ticket[] = [];


  // =====================================================
  // PAGE STATE
  // =====================================================

  loading = true;

  errorMessage = '';


  // =====================================================
  // USER INFORMATION
  // =====================================================

  userEmail =
    localStorage.getItem('userEmail') || 'Technician';


  userInitial =
    this.userEmail
      .charAt(0)
      .toUpperCase();


  // =====================================================
  // DATE
  // =====================================================

  currentDate =
    new Date().toLocaleDateString(
      'en-ZA',
      {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }
    );


  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(
    private ticketService: TicketService,

    private router: Router,

    private changeDetectorRef: ChangeDetectorRef
  ) {

    this.loadAssignedTickets();

  }


  // =====================================================
  // AFTER VIEW INIT
  // =====================================================

  ngAfterViewInit(): void {

    console.log(
      'Technician dashboard view loaded.'
    );

  }


  // =====================================================
  // LOAD ASSIGNED TICKETS
  // =====================================================

  loadAssignedTickets(): void {

    console.log(
      'Loading technician assigned tickets...'
    );


    this.loading = true;

    this.errorMessage = '';


    const token =
      localStorage.getItem('token');


    // -----------------------------------------------------
    // CHECK JWT
    // -----------------------------------------------------

    if (!token) {

      console.error(
        'No JWT token found.'
      );

      this.loading = false;

      this.errorMessage =
        'Your session has expired. Please log in again.';

      this.router.navigate([
        '/login'
      ]);

      return;

    }


    // -----------------------------------------------------
    // GET ASSIGNED TICKETS
    // -----------------------------------------------------

    this.ticketService
      .getAssignedTickets()
      .subscribe({

        next: (tickets: Ticket[]) => {

          console.log(
            'Assigned tickets received:',
            tickets
          );


          this.tickets = tickets;

          this.loading = false;


          this.changeDetectorRef
            .detectChanges();

        },


        error: (error) => {

          console.error(
            'Failed to load assigned tickets:',
            error
          );


          this.loading = false;


          // -------------------------------------------------
          // UNAUTHORIZED
          // -------------------------------------------------

          if (error.status === 401) {

            this.errorMessage =
              'Your session has expired. Please log in again.';


            localStorage.removeItem('token');

            localStorage.removeItem('userEmail');

            localStorage.removeItem('userId');


            this.router.navigate([
              '/login'
            ]);

          }


          // -------------------------------------------------
          // FORBIDDEN
          // -------------------------------------------------

          else if (error.status === 403) {

            this.errorMessage =
              'You do not have permission to view your assigned tickets.';

          }


          // -------------------------------------------------
          // SERVER OFFLINE
          // -------------------------------------------------

          else if (error.status === 0) {

            this.errorMessage =
              'Unable to connect to the server. Make sure Spring Boot is running.';

          }


          // -------------------------------------------------
          // OTHER ERROR
          // -------------------------------------------------

          else {

            this.errorMessage =
              'Unable to load your assigned tickets.';

          }


          this.changeDetectorRef
            .detectChanges();

        }

      });

  }


  // =====================================================
  // GO TO ASSIGNED TICKETS
  // =====================================================

  goToAssignedTickets(): void {

    console.log(
      'Opening assigned tickets section...'
    );


    // -----------------------------------------------------
    // Make sure the section exists
    // -----------------------------------------------------

    if (!this.assignedTicketsSection) {

      console.error(
        'Assigned tickets section not found.'
      );

      return;

    }


    // -----------------------------------------------------
    // Smooth scroll to assigned tickets
    // -----------------------------------------------------

    this.assignedTicketsSection
      .nativeElement
      .scrollIntoView({

        behavior: 'smooth',

        block: 'start'

      });

  }


  // =====================================================
  // OPEN TICKETS COUNT
  // =====================================================

  get openTickets(): number {

    return this.tickets.filter(
      ticket =>
        ticket.status === 'OPEN'
    ).length;

  }


  // =====================================================
  // IN PROGRESS COUNT
  // =====================================================

  get inProgressTickets(): number {

    return this.tickets.filter(
      ticket =>
        ticket.status === 'IN_PROGRESS'
    ).length;

  }


  // =====================================================
  // RESOLVED COUNT
  // =====================================================

  get resolvedTickets(): number {

    return this.tickets.filter(
      ticket =>
        ticket.status === 'RESOLVED'
    ).length;

  }


  // =====================================================
  // CLOSED COUNT
  // =====================================================

  get closedTickets(): number {

    return this.tickets.filter(
      ticket =>
        ticket.status === 'CLOSED'
    ).length;

  }


  // =====================================================
  // TOTAL COUNT
  // =====================================================

  get totalTickets(): number {

    return this.tickets.length;

  }


  // =====================================================
  // OPEN TICKET DETAILS
  // =====================================================

  openTicket(
    ticketId: number
  ): void {

    console.log(
      'Opening technician ticket:',
      ticketId
    );


    // -----------------------------------------------------
    // Check JWT
    // -----------------------------------------------------

    const token =
      localStorage.getItem('token');


    if (!token) {

      console.error(
        'No JWT token found.'
      );

      this.router.navigate([
        '/login'
      ]);

      return;

    }


    // -----------------------------------------------------
    // Navigate to ticket
    // -----------------------------------------------------

    this.router.navigate([
      '/tickets',
      ticketId
    ]);

  }


  // =====================================================
  // LOGOUT
  // =====================================================

  logout(): void {

    console.log(
      'Technician logging out...'
    );


    localStorage.removeItem('token');

    localStorage.removeItem('userEmail');

    localStorage.removeItem('userId');


    this.router.navigate([
      '/login'
    ]);

  }

}