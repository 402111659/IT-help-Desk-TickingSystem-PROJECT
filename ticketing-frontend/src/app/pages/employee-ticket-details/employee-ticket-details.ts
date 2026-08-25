import {
  Component,
  ChangeDetectorRef
} from '@angular/core';

import { DatePipe } from '@angular/common';

import {
  ActivatedRoute,
  Router,
  RouterLink
} from '@angular/router';

import {
  TicketService,
  Ticket,
  Comment
} from '../../services/ticket.service';


@Component({
  selector: 'app-employee-ticket-details',

  standalone: true,

  imports: [
    RouterLink,
    DatePipe
  ],

  templateUrl: './employee-ticket-details.html',

  styleUrl: './employee-ticket-details.css'
})
export class EmployeeTicketDetails {

  // =====================================================
  // USER
  // =====================================================

  userEmail = '';

  userInitial = '?';


  // =====================================================
  // TICKET
  // =====================================================

  ticket: Ticket | null = null;

  ticketId = 0;


  // =====================================================
  // COMMENTS
  // =====================================================

  comments: Comment[] = [];


  // =====================================================
  // PAGE STATE
  // =====================================================

  loadingTicket = false;

  loadingComments = false;

  ticketError = '';

  commentError = '';


  constructor(
    private route: ActivatedRoute,

    private router: Router,

    private ticketService: TicketService,

    private changeDetectorRef: ChangeDetectorRef
  ) {

    this.loadUser();

    this.getTicketId();

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
  // GET TICKET ID FROM URL
  // =====================================================

  getTicketId(): void {

    const id =
      this.route.snapshot.paramMap.get('id');

    if (!id) {

      this.ticketError =
        'Ticket could not be found.';

      return;

    }

    this.ticketId =
      Number(id);

    this.loadTicket();

    this.loadComments();

  }


  // =====================================================
  // LOAD TICKET
  // =====================================================

  loadTicket(): void {

    this.loadingTicket = true;

    this.ticketError = '';


    this.ticketService
      .getTicketById(this.ticketId)
      .subscribe({

        next: (ticket: Ticket) => {

          console.log(
            'Employee ticket received:',
            ticket
          );

          this.ticket = ticket;

          this.loadingTicket = false;

          this.changeDetectorRef.detectChanges();

        },

        error: (error) => {

          console.error(
            'Failed to load employee ticket:',
            error
          );

          this.loadingTicket = false;


          if (error.status === 401) {

            this.ticketError =
              'Your session has expired. Please log in again.';

          }

          else if (error.status === 403) {

            this.ticketError =
              'You do not have permission to view this ticket.';

          }

          else if (error.status === 404) {

            this.ticketError =
              'Ticket not found.';

          }

          else {

            this.ticketError =
              'Unable to load the ticket.';

          }


          this.changeDetectorRef.detectChanges();

        }

      });

  }


  // =====================================================
  // LOAD COMMENTS
  // =====================================================

  loadComments(): void {

    this.loadingComments = true;

    this.commentError = '';


    this.ticketService
      .getComments(this.ticketId)
      .subscribe({

        next: (comments: Comment[]) => {

          console.log(
            'Employee ticket comments:',
            comments
          );

          this.comments = comments;

          this.loadingComments = false;

          this.changeDetectorRef.detectChanges();

        },

        error: (error) => {

          console.error(
            'Failed to load comments:',
            error
          );

          this.loadingComments = false;

          this.commentError =
            'Comments could not be loaded.';

          this.changeDetectorRef.detectChanges();

        }

      });

  }


  // =====================================================
  // GO BACK TO DASHBOARD
  // =====================================================

  backToDashboard(): void {

    this.router.navigate([
      '/dashboard'
    ]);

  }


  // =====================================================
  // LOGOUT
  // =====================================================

  logout(): void {

    localStorage.removeItem(
      'token'
    );

    localStorage.removeItem(
      'userEmail'
    );

    localStorage.removeItem(
      'userId'
    );

    this.router.navigate([
      '/login'
    ]);

  }

}