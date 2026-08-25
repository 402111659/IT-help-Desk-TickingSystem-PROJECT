import { Routes } from '@angular/router';

import { Tickets } from './pages/tickets/tickets';
import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { CreateTicket } from './pages/create-ticket/create-ticket';
import { TicketDetails } from './pages/ticket-details/ticket-details';
import { EmployeeTicketDetails } from './pages/employee-ticket-details/employee-ticket-details';
import { Users } from './pages/users/users';
import { CreateTechnician } from './pages/create-technician/create-technician';
import { TechnicianDashboard } from './pages/technician-dashboard/technician-dashboard';
import { AdminDashboard } from './pages/admin-dashboard/admin-dashboard';

export const routes: Routes = [

  // =====================================================
  // ROOT
  // =====================================================

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },


  // =====================================================
  // LOGIN
  // =====================================================

  {
    path: 'login',
    component: Login
  },


  // =====================================================
  // ADMIN DASHBOARD
  // =====================================================

  {
    path: 'admin-dashboard',
    component: AdminDashboard
  },


  // =====================================================
  // TECHNICIAN DASHBOARD
  // =====================================================

  {
    path: 'technician-dashboard',
    component: TechnicianDashboard
  },


  // =====================================================
  // EMPLOYEE DASHBOARD
  // =====================================================

  {
    path: 'dashboard',
    component: Dashboard
  },


  // =====================================================
  // ALL TICKETS
  // =====================================================

  {
    path: 'tickets',
    component: Tickets
  },


  // =====================================================
  // ADMIN / TECHNICIAN TICKET DETAILS
  // =====================================================

  {
    path: 'tickets/:id',
    component: TicketDetails
  },


  // =====================================================
  // EMPLOYEE TICKET DETAILS
  // =====================================================

  {
    path: 'employee-ticket-details/:id',
    component: EmployeeTicketDetails
  },


  // =====================================================
  // CREATE TICKET
  // =====================================================

  {
    path: 'create-ticket',
    component: CreateTicket
  },


  // =====================================================
  // USERS
  // =====================================================

  {
    path: 'users',
    component: Users
  },


  // =====================================================
  // CREATE TECHNICIAN
  // =====================================================

  {
    path: 'create-technician',
    component: CreateTechnician
  },


  // =====================================================
  // UNKNOWN ROUTE
  // =====================================================

  {
    path: '**',
    redirectTo: 'login'
  }

];