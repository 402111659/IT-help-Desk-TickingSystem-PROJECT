import { Injectable } from '@angular/core';

import {
  HttpClient,
  HttpHeaders
} from '@angular/common/http';

import { Observable } from 'rxjs';


// =====================================================
// TICKET INTERFACE
// =====================================================

export interface Ticket {

  id: number;

  ticketNumber: string;

  title: string;

  description: string;

  status: string;

  priority: string;

  createdAt: string;

  updatedAt: string;

  assignedTechnician?: {
    id: number;
    email?: string;
    firstName?: string;
    lastName?: string;
  } | null;

  createdBy?: {
    id: number;
    email?: string;
    firstName?: string;
    lastName?: string;
  } | null;

}


// =====================================================
// CREATE TICKET REQUEST
// =====================================================

export interface CreateTicketRequest {

  title: string;

  description: string;

  priority: string;

  status: string;

}


// =====================================================
// COMMENT INTERFACE
// =====================================================

export interface Comment {

  id: number;

  message: string;

  createdAt: string;

  userEmail: string;

  ticketId: number;

}


// =====================================================
// ADD COMMENT REQUEST
// =====================================================

export interface AddCommentRequest {

  message: string;

}


// =====================================================
// TICKET SERVICE
// =====================================================

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  // ===================================================
  // AWS ELASTIC BEANSTALK BACKEND
  // ===================================================

  private apiUrl =
    'http://ticketingsystem-prod.eba-89fs2nnj.us-east-1.elasticbeanstalk.com/api/tickets';


  constructor(
    private http: HttpClient
  ) {}


  // =====================================================
  // AUTHORIZATION HEADER
  // =====================================================

  private getHeaders(): HttpHeaders {

    const token =
      localStorage.getItem('token');


    return new HttpHeaders({

      Authorization:
        `Bearer ${token}`

    });

  }


  // =====================================================
  // GET ALL TICKETS
  // =====================================================

  getAllTickets(): Observable<Ticket[]> {

    return this.http.get<Ticket[]>(

      this.apiUrl,

      {
        headers:
          this.getHeaders()
      }

    );

  }


  // =====================================================
  // GET ONE TICKET
  // =====================================================

  getTicketById(
    id: number
  ): Observable<Ticket> {

    return this.http.get<Ticket>(

      `${this.apiUrl}/${id}`,

      {
        headers:
          this.getHeaders()
      }

    );

  }


  // =====================================================
  // CREATE TICKET
  // =====================================================

  createTicket(
    ticket: CreateTicketRequest
  ): Observable<Ticket> {

    return this.http.post<Ticket>(

      this.apiUrl,

      ticket,

      {
        headers:
          this.getHeaders()
      }

    );

  }


  // =====================================================
  // UPDATE ENTIRE TICKET
  // =====================================================

  updateTicket(
    id: number,
    ticket: Ticket
  ): Observable<Ticket> {

    return this.http.put<Ticket>(

      `${this.apiUrl}/${id}`,

      ticket,

      {
        headers:
          this.getHeaders()
      }

    );

  }


  // =====================================================
  // UPDATE STATUS
  // =====================================================

  updateTicketStatus(
    id: number,
    status: string
  ): Observable<Ticket> {

    return this.http.put<Ticket>(

      `${this.apiUrl}/${id}/status`,

      JSON.stringify(status),

      {
        headers:
          this.getHeaders().set(
            'Content-Type',
            'application/json'
          )
      }

    );

  }


  // =====================================================
  // UPDATE PRIORITY
  // =====================================================

  updateTicketPriority(
    id: number,
    priority: string
  ): Observable<Ticket> {

    return this.http.put<Ticket>(

      `${this.apiUrl}/${id}/priority`,

      JSON.stringify(priority),

      {
        headers:
          this.getHeaders().set(
            'Content-Type',
            'application/json'
          )
      }

    );

  }


  // =====================================================
  // ASSIGN TECHNICIAN
  // =====================================================

  assignTechnician(
    ticketId: number,
    technicianId: number
  ): Observable<Ticket> {

    return this.http.put<Ticket>(

      `${this.apiUrl}/${ticketId}/assign/${technicianId}`,

      {},

      {
        headers:
          this.getHeaders()
      }

    );

  }


  // =====================================================
  // DELETE TICKET
  // =====================================================

  deleteTicket(
    id: number
  ): Observable<void> {

    return this.http.delete<void>(

      `${this.apiUrl}/${id}`,

      {
        headers:
          this.getHeaders()
      }

    );

  }


  // =====================================================
  // GET ASSIGNED TICKETS
  // =====================================================

  getAssignedTickets(): Observable<Ticket[]> {

    return this.http.get<Ticket[]>(

      `${this.apiUrl}/assigned`,

      {
        headers:
          this.getHeaders()
      }

    );

  }


  // =====================================================
  // GET COMMENTS FOR TICKET
  // =====================================================

  getComments(
    ticketId: number
  ): Observable<Comment[]> {

    return this.http.get<Comment[]>(

      `${this.apiUrl}/${ticketId}/comments`,

      {
        headers:
          this.getHeaders()
      }

    );

  }


  // =====================================================
  // ADD COMMENT
  // =====================================================

  addComment(
    ticketId: number,
    message: string
  ): Observable<Comment> {

    const request: AddCommentRequest = {

      message:
        message.trim()

    };


    console.log(
      'COMMENT REQUEST BODY:',
      request
    );


    console.log(
      'COMMENT REQUEST JSON:',
      JSON.stringify(request)
    );


    return this.http.post<Comment>(

      `${this.apiUrl}/${ticketId}/comments`,

      request,

      {
        headers:
          this.getHeaders().set(
            'Content-Type',
            'application/json'
          )
      }

    );

  }


  // =====================================================
  // GET MY TICKETS
  // EMPLOYEE ONLY
  // =====================================================

  getMyTickets(): Observable<Ticket[]> {

    return this.http.get<Ticket[]>(

      `${this.apiUrl}/my-tickets`,

      {
        headers:
          this.getHeaders()
      }

    );

  }

}