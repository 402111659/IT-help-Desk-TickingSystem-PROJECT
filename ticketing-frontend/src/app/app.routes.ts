import { Routes } from '@angular/router';

import { OAuth2Callback } from './pages/oauth2-callback/oauth2-callback';
import { ItSupport } from './pages/it-support/it-support';
import { Tickets } from './pages/tickets/tickets';
import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { MyTickets } from './pages/my-tickets/my-tickets';
import { CreateTicket } from './pages/create-ticket/create-ticket';
import { TicketDetails } from './pages/ticket-details/ticket-details';
import { EmployeeTicketDetails } from './pages/employee-ticket-details/employee-ticket-details';

import { Users } from './pages/users/users';
import { CreateTechnician } from './pages/create-technician/create-technician';

import { TechnicianDashboard } from './pages/technician-dashboard/technician-dashboard';
import { AdminDashboard } from './pages/admin-dashboard/admin-dashboard';
import { Help } from './pages/help/help';
import { Register } from './pages/register/register';
import { SystemAnalytics } from './pages/system-analytics/system-analytics';
import { TicketStatistics } from './pages/ticket-statistics/ticket-statistics';

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
  // REGISTER
  // =====================================================

  {
    path: 'register',
    component: Register
  },


  // =====================================================
  // LOGIN
  // =====================================================

  {
    path: 'login',
    component: Login
  },


  // =====================================================
  // GOOGLE OAUTH2 CALLBACK
  // IMPORTANT:
  // This must be before the wildcard route
  // =====================================================

  {
    path: 'oauth2/callback',
    component: OAuth2Callback
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
  // EMPLOYEE MY TICKETS
  // =====================================================

  {
    path: 'my-tickets',
    component: MyTickets
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
// HELP CENTRE
// =====================================================

{
  path: 'help',
  component: Help
},

  // =====================================================
  // UNKNOWN ROUTE
  // IMPORTANT:
  // THIS MUST ALWAYS BE LAST
  // =====================================================

  //IT support
{ path: 'it-support', component: ItSupport },


//Ticket Statistics

{ path: 'ticket-statistics', component: TicketStatistics },

// Analytics page

{ path: 'system-analytics', component: SystemAnalytics },
  {
    path: '**',
    redirectTo: 'login'
  }

];