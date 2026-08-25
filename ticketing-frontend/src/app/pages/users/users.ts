import {
  Component,
  ChangeDetectorRef
} from '@angular/core';

import {
  Router,
  RouterLink
} from '@angular/router';

import {
  FormsModule
} from '@angular/forms';

import {
  UserService,
  UserResponse
} from '../../services/user.service';


@Component({
  selector: 'app-users',

  standalone: true,

  imports: [
    RouterLink,
    FormsModule
  ],

  templateUrl: './users.html',

  styleUrl: './users.css'
})
export class Users {

  // =====================================================
  // USERS
  // =====================================================

  users: UserResponse[] = [];


  // =====================================================
  // LOADING / ERROR
  // =====================================================

  loading = true;

  errorMessage = '';

  successMessage = '';


  // =====================================================
  // SEARCH / FILTER
  // =====================================================

  searchTerm = '';

  selectedRole = 'ALL';


  // =====================================================
  // ROLE MANAGEMENT
  // =====================================================

  selectedUserRoles: {
    [id: number]: string
  } = {};

  updatingUserId: number | null = null;


  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(
    private userService: UserService,

    private router: Router,

    private changeDetectorRef: ChangeDetectorRef
  ) {

    this.checkAdmin();

  }


  // =====================================================
  // CHECK ADMIN ROLE
  // =====================================================

  checkAdmin(): void {

    const role =
      localStorage.getItem('role');

    console.log(
      'Users page role:',
      role
    );


    // ===================================================
    // ADMIN
    // ===================================================

    if (role === 'ADMIN') {

      console.log(
        'ADMIN authorized to access Users page.'
      );

      this.loadUsers();

      return;

    }


    // ===================================================
    // TECHNICIAN
    // ===================================================

    if (role === 'TECHNICIAN') {

      console.warn(
        'TECHNICIAN attempted to access Users page.'
      );

      this.router.navigateByUrl(
        '/technician-dashboard'
      );

      return;

    }


    // ===================================================
    // EMPLOYEE / UNKNOWN
    // ===================================================

    console.warn(
      'Unauthorized user attempted to access Users page.'
    );

    this.router.navigateByUrl(
      '/dashboard'
    );

  }


  // =====================================================
  // LOAD USERS
  // =====================================================

  loadUsers(): void {

    console.log(
      'Loading users...'
    );

    this.loading = true;

    this.errorMessage = '';

    this.successMessage = '';


    this.userService
      .getAllUsers()
      .subscribe({

        // =================================================
        // SUCCESS
        // =================================================

        next: (
          users: UserResponse[]
        ) => {

          console.log(
            'Users received:',
            users
          );


          this.users =
            users;


          this.loading =
            false;


          console.log(
            'Loading:',
            this.loading
          );


          console.log(
            'Users count:',
            this.users.length
          );


          // =================================================
          // SET CURRENT ROLE FOR EACH USER
          // =================================================

          this.selectedUserRoles = {};


          this.users.forEach(
            user => {

              this.selectedUserRoles[user.id] =
                user.role;

            }
          );


          // =================================================
          // UPDATE UI
          // =================================================

          this.changeDetectorRef.detectChanges();

        },


        // =================================================
        // ERROR
        // =================================================

        error: (
          error
        ) => {

          console.error(
            'Failed to load users:',
            error
          );


          this.loading =
            false;


          if (
            error.status === 403
          ) {

            this.errorMessage =
              'You do not have permission to view users.';

          }

          else if (
            error.status === 401
          ) {

            this.errorMessage =
              'Your session has expired. Please log in again.';

          }

          else {

            this.errorMessage =
              'Unable to load users from the server.';

          }


          this.changeDetectorRef.detectChanges();

        }

      });

  }


  // =====================================================
  // FILTER USERS
  // =====================================================

  get filteredUsers(): UserResponse[] {

    const search =
      this.searchTerm
        .trim()
        .toLowerCase();


    return this.users.filter(
      user => {

        // =================================================
        // SEARCH
        // =================================================

        const matchesSearch =

          !search

          ||

          user.firstName
            .toLowerCase()
            .includes(search)

          ||

          user.lastName
            .toLowerCase()
            .includes(search)

          ||

          user.email
            .toLowerCase()
            .includes(search);


        // =================================================
        // ROLE FILTER
        // =================================================

        const matchesRole =

          this.selectedRole === 'ALL'

          ||

          user.role ===
            this.selectedRole;


        return (
          matchesSearch &&
          matchesRole
        );

      }
    );

  }


  // =====================================================
  // UPDATE USER ROLE
  // =====================================================

  updateUserRole(
    user: UserResponse
  ): void {

    const newRole =
      this.selectedUserRoles[user.id];


    // =================================================
    // VALIDATE ROLE
    // =================================================

    if (!newRole) {

      return;

    }


    // =================================================
    // NOTHING CHANGED
    // =================================================

    if (
      newRole === user.role
    ) {

      return;

    }


    console.log(
      'Updating user role:',
      user.id,
      newRole
    );


    this.updatingUserId =
      user.id;


    this.successMessage =
      '';

    this.errorMessage =
      '';


    // =================================================
    // UPDATE ROLE
    // =================================================

    this.userService
      .updateUserRole(
        user.id,
        newRole
      )
      .subscribe({

        // =================================================
        // SUCCESS
        // =================================================

        next: (
          updatedUser: UserResponse
        ) => {

          console.log(
            'User role updated:',
            updatedUser
          );


          // =================================================
          // FIND USER
          // =================================================

          const index =
            this.users.findIndex(
              existingUser =>
                existingUser.id ===
                user.id
            );


          // =================================================
          // UPDATE USER
          // =================================================

          if (
            index !== -1
          ) {

            this.users[index] =
              updatedUser;

          }


          // =================================================
          // UPDATE SELECTED ROLE
          // =================================================

          this.selectedUserRoles[
            updatedUser.id
          ] =
            updatedUser.role;


          // =================================================
          // RESET UPDATE STATE
          // =================================================

          this.updatingUserId =
            null;


          // =================================================
          // SUCCESS MESSAGE
          // =================================================

          this.successMessage =
            `${updatedUser.firstName} ${updatedUser.lastName}'s role was updated successfully.`;


          console.log(
            'Role update successful.'
          );


          this.changeDetectorRef.detectChanges();

        },


        // =================================================
        // ERROR
        // =================================================

        error: (
          error
        ) => {

          console.error(
            'Failed to update user role:',
            error
          );


          this.updatingUserId =
            null;


          if (
            error.status === 403
          ) {

            this.errorMessage =
              'You do not have permission to change user roles.';

          }

          else if (
            error.status === 401
          ) {

            this.errorMessage =
              'Your session has expired. Please log in again.';

          }

          else if (
            error.status === 400
          ) {

            this.errorMessage =
              'Invalid role information.';

          }

          else {

            this.errorMessage =
              'Unable to update the user role.';

          }


          this.changeDetectorRef.detectChanges();

        }

      });

  }


  // =====================================================
  // GO TO ADMIN DASHBOARD
  // =====================================================

  goToAdminDashboard(): void {

    console.log(
      'Returning to ADMIN dashboard...'
    );


    // Make absolutely sure the logged-in user
    // is still an administrator.

    const role =
      localStorage.getItem('role');


    if (role !== 'ADMIN') {

      console.warn(
        'Current user is not ADMIN.'
      );


      if (role === 'TECHNICIAN') {

        this.router.navigateByUrl(
          '/technician-dashboard'
        );

      }

      else {

        this.router.navigateByUrl(
          '/dashboard'
        );

      }

      return;

    }


    // =================================================
    // ADMIN → ADMIN DASHBOARD
    // =================================================

    this.router.navigateByUrl(
      '/admin-dashboard'
    );

  }


  // =====================================================
  // LOGOUT
  // =====================================================

  logout(): void {

    console.log(
      'Admin logging out from users page...'
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