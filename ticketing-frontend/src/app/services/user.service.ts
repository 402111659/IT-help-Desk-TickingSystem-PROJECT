import { Injectable } from '@angular/core';

import {
  HttpClient,
  HttpHeaders
} from '@angular/common/http';

import { Observable } from 'rxjs';


// =====================================================
// USER RESPONSE
// =====================================================

export interface UserResponse {

  id: number;

  firstName: string;

  lastName: string;

  email: string;

  role: string;

}


// =====================================================
// CREATE TECHNICIAN REQUEST
// =====================================================

export interface CreateTechnicianRequest {

  firstName: string;

  lastName: string;

  email: string;

  password: string;

}


// =====================================================
// USER SERVICE
// =====================================================

@Injectable({
  providedIn: 'root'
})
export class UserService {

  // =====================================================
  // AWS ELASTIC BEANSTALK API URL
  // =====================================================

  private apiUrl =
    'http://ticketingsystem-prod.eba-89fs2nnj.us-east-1.elasticbeanstalk.com/api/users';


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
  // GET ALL USERS
  // =====================================================

  getAllUsers(): Observable<UserResponse[]> {

    return this.http.get<UserResponse[]>(

      this.apiUrl,

      {
        headers:
          this.getHeaders()
      }

    );

  }


  // =====================================================
  // UPDATE USER ROLE
  // =====================================================

  updateUserRole(
    id: number,
    role: string
  ): Observable<UserResponse> {

    return this.http.put<UserResponse>(

      `${this.apiUrl}/${id}/role`,

      JSON.stringify(role),

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
  // CREATE TECHNICIAN
  // =====================================================

  createTechnician(
    technician: CreateTechnicianRequest
  ): Observable<UserResponse> {

    return this.http.post<UserResponse>(

      `${this.apiUrl}/technicians`,

      technician,

      {
        headers:
          this.getHeaders()
      }

    );

  }

}