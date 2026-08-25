import {
  Component,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

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

import {
  UserService,
  UserResponse
} from '../../services/user.service';


@Component({
  selector: 'app-ticket-details',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],

  templateUrl: './ticket-details.html',

  styleUrl: './ticket-details.css'
})
export class TicketDetails {

  // =====================================================
  // TICKET
  // =====================================================

  ticket: Ticket | null = null;

  ticketId = 0;


  // =====================================================
  // TECHNICIANS
  // =====================================================

  technicians: UserResponse[] = [];

  selectedTechnicianId: number | null = null;


  // =====================================================
  // COMMENTS
  // =====================================================

  comments: Comment[] = [];

  commentMessage = '';

  loadingComments = false;

  addingComment = false;

  commentErrorMessage = '';

  commentSuccessMessage = '';


  // =====================================================
  // PAGE STATE
  // =====================================================

  loading = false;

  loadingTechnicians = false;

  updating = false;

  assigningTechnician = false;

  errorMessage = '';

  successMessage = '';


  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(
    private route: ActivatedRoute,

    private router: Router,

    private ticketService: TicketService,

    private userService: UserService,

    private changeDetectorRef: ChangeDetectorRef
  ) {

    this.loadTicket();

  }


  // =====================================================
  // GET CURRENT USER ROLE
  // =====================================================

  getUserRole(): string {

    /*
     * First try the role saved during login.
     */

    const savedRole =
      localStorage.getItem('role');


    if (savedRole) {

      return savedRole.toUpperCase();

    }


    /*
     * If role is not stored, read it from JWT.
     */

    const token =
      localStorage.getItem('token');


    if (!token) {

      return '';

    }


    try {

      const payload =
        token.split('.')[1];


      const decodedPayload =
        JSON.parse(
          atob(payload)
        );


      const role =
        decodedPayload.role;


      if (role) {

        const normalizedRole =
          String(role).toUpperCase();


        /*
         * Save it so other pages can use
         * the same role.
         */

        localStorage.setItem(
          'role',
          normalizedRole
        );


        return normalizedRole;

      }


      return '';

    }

    catch (error) {

      console.error(
        'Unable to determine user role:',
        error
      );


      return '';

    }

  }


  // =====================================================
  // CHECK ADMIN
  // =====================================================

  isAdmin(): boolean {

    return this.getUserRole() === 'ADMIN';

  }


  // =====================================================
  // CHECK TECHNICIAN
  // =====================================================

  isTechnician(): boolean {

    return this.getUserRole() === 'TECHNICIAN';

  }


  // =====================================================
  // CHECK EMPLOYEE
  // =====================================================

  isEmployee(): boolean {

    return this.getUserRole() === 'EMPLOYEE';

  }


  // =====================================================
  // LOAD TICKET
  // =====================================================

  loadTicket(): void {

    const id =
      this.route.snapshot.paramMap.get('id');


    if (!id) {

      this.errorMessage =
        'Invalid ticket ID.';

      return;

    }


    this.ticketId =
      Number(id);


    if (
      isNaN(this.ticketId) ||
      this.ticketId <= 0
    ) {

      this.errorMessage =
        'Invalid ticket ID.';

      return;

    }


    console.log(
      'Loading ticket:',
      this.ticketId
    );


    console.log(
      'Current user role:',
      this.getUserRole()
    );


    this.loading = true;

    this.errorMessage = '';


    this.ticketService
      .getTicketById(this.ticketId)
      .subscribe({

        next: (ticket: Ticket) => {

          console.log(
            'Ticket received:',
            ticket
          );


          this.ticket =
            ticket;


          this.loading =
            false;


          // =================================================
          // ADMIN LOADS TECHNICIANS
          // =================================================

          if (this.isAdmin()) {

            console.log(
              'ADMIN detected - loading technicians'
            );


            this.loadTechnicians();

          }

          else {

            console.log(
              'Non-admin user - technicians will not be loaded'
            );

          }


          // =================================================
          // LOAD COMMENTS
          // =================================================

          this.loadComments();


          this.changeDetectorRef
            .detectChanges();

        },


        error: (error) => {

          console.error(
            'Failed to load ticket:',
            error
          );


          this.loading =
            false;


          if (error.status === 401) {

            this.errorMessage =
              'Your session has expired. Please log in again.';

          }

          else if (error.status === 403) {

            this.errorMessage =
              'You do not have permission to view this ticket.';

          }

          else if (error.status === 404) {

            this.errorMessage =
              'The requested ticket could not be found.';

          }

          else {

            this.errorMessage =
              'Unable to load this ticket from the server.';

          }


          this.changeDetectorRef
            .detectChanges();

        }

      });

  }


  // =====================================================
  // LOAD TECHNICIANS
  // =====================================================

  loadTechnicians(): void {

    /*
     * Only ADMIN can load the technician list.
     */

    if (!this.isAdmin()) {

      console.log(
        'Technician list blocked because current user is not ADMIN.'
      );

      return;

    }


    console.log(
      'Loading technicians...'
    );


    this.loadingTechnicians =
      true;


    this.userService
      .getAllUsers()
      .subscribe({

        next: (users: UserResponse[]) => {

          console.log(
            'Users received:',
            users
          );


          this.technicians =
            users.filter(
              user =>
                user.role === 'TECHNICIAN'
            );


          console.log(
            'Technicians:',
            this.technicians
          );


          // =================================================
          // SELECT CURRENT TECHNICIAN
          // =================================================

          if (
            this.ticket?.assignedTechnician?.id
          ) {

            this.selectedTechnicianId =
              this.ticket.assignedTechnician.id;

          }


          this.loadingTechnicians =
            false;


          this.changeDetectorRef
            .detectChanges();

        },


        error: (error) => {

          console.error(
            'Failed to load technicians:',
            error
          );


          this.loadingTechnicians =
            false;


          this.changeDetectorRef
            .detectChanges();

        }

      });

  }


  // =====================================================
  // LOAD COMMENTS
  // =====================================================

  loadComments(): void {

    if (!this.ticketId) {

      return;

    }


    console.log(
      'Loading comments for ticket:',
      this.ticketId
    );


    this.loadingComments =
      true;


    this.commentErrorMessage =
      '';


    this.ticketService
      .getComments(this.ticketId)
      .subscribe({

        next: (comments: Comment[]) => {

          console.log(
            'Comments received:',
            comments
          );


          this.comments =
            comments;


          this.loadingComments =
            false;


          this.changeDetectorRef
            .detectChanges();

        },


        error: (error) => {

          console.error(
            'Failed to load comments:',
            error
          );


          this.loadingComments =
            false;


          if (error.status === 401) {

            this.commentErrorMessage =
              'Your session has expired. Please log in again.';

          }

          else if (error.status === 403) {

            this.commentErrorMessage =
              'You do not have permission to view comments on this ticket.';

          }

          else if (error.status === 404) {

            this.commentErrorMessage =
              'This ticket could not be found.';

          }

          else {

            this.commentErrorMessage =
              'Unable to load comments.';

          }


          this.changeDetectorRef
            .detectChanges();

        }

      });

  }


  // =====================================================
  // ADD COMMENT
  // =====================================================

  addComment(): void {

    const message =
      this.commentMessage.trim();


    if (!message) {

      this.commentErrorMessage =
        'Please enter a comment.';

      this.commentSuccessMessage =
        '';

      return;

    }


    if (!this.ticket) {

      this.commentErrorMessage =
        'Ticket information is not available.';

      this.commentSuccessMessage =
        '';

      return;

    }


    if (this.addingComment) {

      return;

    }


    console.log(
      'Adding comment to ticket:',
      this.ticket.id
    );


    console.log(
      'Comment user:',
      localStorage.getItem('userEmail')
    );


    console.log(
      'Comment user role:',
      this.getUserRole()
    );


    this.addingComment =
      true;


    this.commentErrorMessage =
      '';


    this.commentSuccessMessage =
      '';


    this.ticketService
      .addComment(
        this.ticket.id,
        message
      )
      .subscribe({

        next: (comment: Comment) => {

          console.log(
            'Comment added:',
            comment
          );


          this.commentMessage =
            '';


          this.addingComment =
            false;


          this.commentSuccessMessage =
            'Comment added successfully.';


          this.loadComments();


          this.changeDetectorRef
            .detectChanges();

        },


        error: (error) => {

          console.error(
            'Failed to add comment:',
            error
          );


          this.addingComment =
            false;


          if (error.status === 401) {

            this.commentErrorMessage =
              'Your session has expired. Please log in again.';

          }

          else if (error.status === 403) {

            this.commentErrorMessage =
              'You are not allowed to comment on this ticket.';

          }

          else if (error.status === 404) {

            this.commentErrorMessage =
              'The ticket could not be found.';

          }

          else {

            this.commentErrorMessage =
              'Unable to add your comment.';

          }


          this.changeDetectorRef
            .detectChanges();

        }

      });

  }


  // =====================================================
  // ASSIGN TECHNICIAN
  // =====================================================

  assignTechnician(): void {

    if (!this.isAdmin()) {

      this.errorMessage =
        'Only administrators can assign technicians.';

      this.successMessage =
        '';

      return;

    }


    if (!this.ticket) {

      return;

    }


    if (
      this.selectedTechnicianId === null
    ) {

      this.errorMessage =
        'Please select a technician.';

      this.successMessage =
        '';

      return;

    }


    this.assigningTechnician =
      true;


    this.successMessage =
      '';


    this.errorMessage =
      '';


    console.log(
      'Assigning technician:',
      this.selectedTechnicianId
    );


    this.ticketService
      .assignTechnician(
        this.ticket.id,
        this.selectedTechnicianId
      )
      .subscribe({

        next: (updatedTicket: Ticket) => {

          console.log(
            'Technician assigned:',
            updatedTicket
          );


          this.ticket =
            updatedTicket;


          this.assigningTechnician =
            false;


          this.successMessage =
            'Technician assigned successfully.';


          if (
            updatedTicket.assignedTechnician?.id
          ) {

            this.selectedTechnicianId =
              updatedTicket.assignedTechnician.id;

          }


          this.changeDetectorRef
            .detectChanges();

        },


        error: (error) => {

          console.error(
            'Failed to assign technician:',
            error
          );


          this.assigningTechnician =
            false;


          if (error.status === 403) {

            this.errorMessage =
              'You do not have permission to assign technicians.';

          }

          else if (error.status === 401) {

            this.errorMessage =
              'Your session has expired. Please log in again.';

          }

          else if (error.status === 404) {

            this.errorMessage =
              'The selected technician or ticket could not be found.';

          }

          else {

            this.errorMessage =
              'Unable to assign the technician.';

          }


          this.changeDetectorRef
            .detectChanges();

        }

      });

  }


  // =====================================================
  // UPDATE STATUS
  // =====================================================

  updateStatus(
    status: string
  ): void {

    if (!this.ticket) {

      return;

    }


    if (
      !status ||
      status === this.ticket.status
    ) {

      return;

    }


    if (
      !this.isTechnician() &&
      !this.isAdmin()
    ) {

      this.errorMessage =
        'You do not have permission to update the ticket status.';

      return;

    }


    this.updating =
      true;


    this.successMessage =
      '';


    this.errorMessage =
      '';


    console.log(
      'Updating ticket status:',
      status
    );


    this.ticketService
      .updateTicketStatus(
        this.ticket.id,
        status
      )
      .subscribe({

        next: (updatedTicket: Ticket) => {

          console.log(
            'Status updated:',
            updatedTicket
          );


          this.ticket =
            updatedTicket;


          this.updating =
            false;


          this.successMessage =
            'Ticket status updated successfully.';


          this.changeDetectorRef
            .detectChanges();

        },


        error: (error) => {

          console.error(
            'Failed to update status:',
            error
          );


          this.updating =
            false;


          if (error.status === 403) {

            this.errorMessage =
              'You do not have permission to update this ticket.';

          }

          else if (error.status === 401) {

            this.errorMessage =
              'Your session has expired. Please log in again.';

          }

          else {

            this.errorMessage =
              'Unable to update the ticket status.';

          }


          this.changeDetectorRef
            .detectChanges();

        }

      });

  }


  // =====================================================
  // UPDATE PRIORITY
  // =====================================================

  updatePriority(
    priority: string
  ): void {

    if (!this.ticket) {

      return;

    }


    if (
      !priority ||
      priority === this.ticket.priority
    ) {

      return;

    }


    if (
      !this.isTechnician() &&
      !this.isAdmin()
    ) {

      this.errorMessage =
        'You do not have permission to update the ticket priority.';

      return;

    }


    this.updating =
      true;


    this.successMessage =
      '';


    this.errorMessage =
      '';


    console.log(
      'Updating ticket priority:',
      priority
    );


    this.ticketService
      .updateTicketPriority(
        this.ticket.id,
        priority
      )
      .subscribe({

        next: (updatedTicket: Ticket) => {

          console.log(
            'Priority updated:',
            updatedTicket
          );


          this.ticket =
            updatedTicket;


          this.updating =
            false;


          this.successMessage =
            'Ticket priority updated successfully.';


          this.changeDetectorRef
            .detectChanges();

        },


        error: (error) => {

          console.error(
            'Failed to update priority:',
            error
          );


          this.updating =
            false;


          if (error.status === 403) {

            this.errorMessage =
              'You do not have permission to update this ticket.';

          }

          else if (error.status === 401) {

            this.errorMessage =
              'Your session has expired. Please log in again.';

          }

          else {

            this.errorMessage =
              'Unable to update the ticket priority.';

          }


          this.changeDetectorRef
            .detectChanges();

        }

      });

  }


  // =====================================================
  // DELETE TICKET
  // =====================================================

  deleteTicket(): void {

    if (!this.isAdmin()) {

      this.errorMessage =
        'Only administrators can delete tickets.';

      return;

    }


    if (!this.ticket) {

      return;

    }


    const confirmed =
      window.confirm(
        `Are you sure you want to delete ${this.ticket.ticketNumber}?`
      );


    if (!confirmed) {

      return;

    }


    this.updating =
      true;


    this.successMessage =
      '';


    this.errorMessage =
      '';


    this.ticketService
      .deleteTicket(
        this.ticket.id
      )
      .subscribe({

        next: () => {

          console.log(
            'Ticket deleted successfully.'
          );


          /*
           * After deleting a ticket, ADMIN returns
           * to the Admin Dashboard.
           */

          if (this.isAdmin()) {

            this.router.navigateByUrl(
              '/admin-dashboard'
            );

          }

          else if (this.isTechnician()) {

            this.router.navigateByUrl(
              '/technician-dashboard'
            );

          }

          else {

            this.router.navigateByUrl(
              '/dashboard'
            );

          }

        },


        error: (error) => {

          console.error(
            'Failed to delete ticket:',
            error
          );


          this.updating =
            false;


          if (error.status === 403) {

            this.errorMessage =
              'You do not have permission to delete this ticket.';

          }

          else if (error.status === 401) {

            this.errorMessage =
              'Your session has expired. Please log in again.';

          }

          else {

            this.errorMessage =
              'Unable to delete the ticket.';

          }


          this.changeDetectorRef
            .detectChanges();

        }

      });

  }


  // =====================================================
  // BACK TO DASHBOARD
  // =====================================================

  backToDashboard(): void {

    const role =
      this.getUserRole();


    console.log(
      'Returning from ticket. User role:',
      role
    );


    // ===================================================
    // ADMIN
    // ===================================================

    if (role === 'ADMIN') {

      console.log(
        'ADMIN detected - returning to Admin Dashboard'
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
        'TECHNICIAN detected - returning to Technician Dashboard'
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
        'EMPLOYEE detected - returning to Employee Dashboard'
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
      'Unknown user role. Returning to login.'
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
      'Logging out from ticket details...'
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


    this.router.navigateByUrl(
      '/login'
    );

  }

}