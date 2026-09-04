import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TicketService, Ticket } from '../../services/ticket.service';

@Component({
  selector: 'app-my-tickets',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './my-tickets.html',
  styleUrl: './my-tickets.css'
})
export class MyTickets implements OnInit {

  // =====================================================
  // USER
  // =====================================================

  userEmail = '';
  userInitial = '?';

  currentDate = '';


  // =====================================================
  // TICKETS
  // =====================================================

  tickets: Ticket[] = [];

  filteredTickets: Ticket[] = [];

  loadingTickets = false;

  ticketError = '';


  // =====================================================
  // FILTER
  // =====================================================

  activeFilter = 'ALL';


  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(
    private ticketService: TicketService,
    private router: Router
  ) {}


  // =====================================================
  // INITIALIZE
  // =====================================================

  ngOnInit(): void {

    this.loadUser();

    this.setDate();

    this.loadTickets();

  }


  // =====================================================
  // LOAD USER
  // =====================================================

  loadUser(): void {

    const email =
      localStorage.getItem('userEmail');

    if (email) {

      this.userEmail = email;

      this.userInitial =
        email.charAt(0).toUpperCase();

    }

  }


  // =====================================================
  // SET DATE
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
  // LOAD MY TICKETS
  // =====================================================

  loadTickets(): void {

    this.loadingTickets = true;

    this.ticketError = '';


    this.ticketService
      .getMyTickets()
      .subscribe({

        next: (tickets: Ticket[]) => {

          this.tickets = tickets;

          this.applyFilter();

          this.loadingTickets = false;

        },


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

        }

      });

  }


  // =====================================================
  // FILTER TICKETS
  // =====================================================

  filterTickets(
    filter: string
  ): void {

    this.activeFilter = filter;

    this.applyFilter();

  }


  // =====================================================
  // APPLY FILTER
  // =====================================================

  applyFilter(): void {

    if (this.activeFilter === 'ALL') {

      this.filteredTickets =
        this.tickets;

      return;

    }


    this.filteredTickets =
      this.tickets.filter(
        ticket =>
          ticket.status === this.activeFilter
      );

  }


  // =====================================================
  // VIEW TICKET
  // =====================================================

  viewTicket(
    ticketId: number
  ): void {

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

    this.router.navigate(['/login']);

  }

}