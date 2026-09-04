import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


// =====================================================
// LOGIN
// =====================================================

export interface LoginRequest {
  email: string;
  password: string;
}


export interface LoginResponse {
  message: string;
  id: number;
  email: string;
  token: string;
}


// =====================================================
// REGISTER
// =====================================================

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}


export interface RegisterResponse {
  message: string;
  id?: number;
  email?: string;
}


@Injectable({
  providedIn: 'root'
})
export class Auth {

  // =====================================================
  // AWS ELASTIC BEANSTALK API URL
  // =====================================================

  private apiUrl =
    'http://ticketingsystem-prod.eba-89fs2nnj.us-east-1.elasticbeanstalk.com/api/users';


  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(
    private http: HttpClient
  ) {}


  // =====================================================
  // LOGIN
  // =====================================================

  login(
    credentials: LoginRequest
  ): Observable<LoginResponse> {

    return this.http.post<LoginResponse>(
      `${this.apiUrl}/login`,
      credentials
    );

  }


  // =====================================================
  // REGISTER
  // =====================================================

  register(
    user: RegisterRequest
  ): Observable<RegisterResponse> {

    return this.http.post<RegisterResponse>(
      `${this.apiUrl}/register`,
      user
    );

  }

}