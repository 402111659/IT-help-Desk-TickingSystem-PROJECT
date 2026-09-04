import {
  Component,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { TicketService, Ticket } from '../../services/ticket.service';

import Chart from 'chart.js/auto';

@Component({
  selector: 'app-ticket-statistics',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './ticket-statistics.html',
  styleUrl: './ticket-statistics.css'
})
export class TicketStatistics implements AfterViewInit, OnDestroy {

  // ==============================
  // USER INFORMATION
  // ==============================

  userEmail = '';
  userInitial = '?';
  currentDate = '';

  // ==============================
  // TICKETS
  // ==============================

  tickets: Ticket[] = [];

  loadingTickets = true;
  errorMessage = '';

  // ==============================
  // CHART REFERENCES
  // ==============================

  @ViewChild('statusChart')
  statusChart!: ElementRef<HTMLCanvasElement>;

  @ViewChild('priorityChart')
  priorityChart!: ElementRef<HTMLCanvasElement>;

  @ViewChild('comparisonChart')
  comparisonChart!: ElementRef<HTMLCanvasElement>;

  @ViewChild('activityChart')
  activityChart!: ElementRef<HTMLCanvasElement>;

  // ==============================
  // CHART INSTANCES
  // ==============================

  private statusChartInstance?: Chart;
  private priorityChartInstance?: Chart;
  private comparisonChartInstance?: Chart;
  private activityChartInstance?: Chart;

  // ==============================
  // CONSTRUCTOR
  // ==============================

  constructor(
    private router: Router,
    private ticketService: TicketService,
    private changeDetectorRef: ChangeDetectorRef
  ) {

    if (!this.checkAdmin()) {
      return;
    }

    this.loadUser();
    this.setDate();
    this.loadTickets();
  }

  // ==============================
  // ADMIN CHECK
  // ==============================

  checkAdmin(): boolean {

    const role = localStorage.getItem('role');

    if (role === 'ADMIN') {
      return true;
    }

    if (role === 'TECHNICIAN') {
      this.router.navigate(['/technician-dashboard']);
      return false;
    }

    this.router.navigate(['/dashboard']);
    return false;
  }

  // ==============================
  // LOAD USER
  // ==============================

  loadUser(): void {

    const email = localStorage.getItem('userEmail');

    if (email) {
      this.userEmail = email;
      this.userInitial = email.charAt(0).toUpperCase();
    }
  }

  // ==============================
  // DATE
  // ==============================

  setDate(): void {

    this.currentDate = new Date().toLocaleDateString(
      'en-ZA',
      {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }
    );
  }

  // ==============================
  // LOAD TICKETS
  // ==============================

  loadTickets(): void {

    this.loadingTickets = true;
    this.errorMessage = '';

    const token = localStorage.getItem('token');

    if (!token) {

      this.loadingTickets = false;
      this.errorMessage =
        'Your session has expired. Please log in again.';

      this.router.navigate(['/login']);

      return;
    }

    this.ticketService.getAllTickets().subscribe({

      next: (tickets: Ticket[]) => {

        this.tickets = tickets;

        this.loadingTickets = false;

        this.changeDetectorRef.detectChanges();

        setTimeout(() => {
          this.createCharts();
        });
      },

      error: (error) => {

        this.loadingTickets = false;

        if (error.status === 401) {

          this.errorMessage =
            'Your session has expired. Please log in again.';

          localStorage.removeItem('token');
          localStorage.removeItem('userEmail');
          localStorage.removeItem('userId');
          localStorage.removeItem('role');

          this.router.navigate(['/login']);

        } else if (error.status === 403) {

          this.errorMessage =
            'You do not have permission to view ticket statistics.';

        } else if (error.status === 0) {

          this.errorMessage =
            'Unable to connect to the server. Make sure Spring Boot is running.';

        } else {

          this.errorMessage =
            'Unable to load ticket statistics from the server.';
        }

        this.changeDetectorRef.detectChanges();
      }
    });
  }

  // ==============================
  // TICKET STATISTICS
  // ==============================

  get totalTickets(): number {
    return this.tickets.length;
  }

  get openTickets(): number {
    return this.tickets.filter(
      ticket => ticket.status === 'OPEN'
    ).length;
  }

  get inProgressTickets(): number {
    return this.tickets.filter(
      ticket => ticket.status === 'IN_PROGRESS'
    ).length;
  }

  get resolvedTickets(): number {
    return this.tickets.filter(
      ticket => ticket.status === 'RESOLVED'
    ).length;
  }

  get closedTickets(): number {
    return this.tickets.filter(
      ticket => ticket.status === 'CLOSED'
    ).length;
  }

  get unresolvedTickets(): number {
    return this.openTickets + this.inProgressTickets;
  }

  get highPriorityTickets(): number {
    return this.tickets.filter(
      ticket => ticket.priority === 'HIGH'
    ).length;
  }

  get mediumPriorityTickets(): number {
    return this.tickets.filter(
      ticket => ticket.priority === 'MEDIUM'
    ).length;
  }

  get lowPriorityTickets(): number {
    return this.tickets.filter(
      ticket => ticket.priority === 'LOW'
    ).length;
  }

  get resolutionRate(): number {

    if (this.totalTickets === 0) {
      return 0;
    }

    return Math.round(
      ((this.resolvedTickets + this.closedTickets) /
        this.totalTickets) * 100
    );
  }

  get openRate(): number {

    if (this.totalTickets === 0) {
      return 0;
    }

    return Math.round(
      (this.openTickets / this.totalTickets) * 100
    );
  }

  get inProgressRate(): number {

    if (this.totalTickets === 0) {
      return 0;
    }

    return Math.round(
      (this.inProgressTickets / this.totalTickets) * 100
    );
  }

  // ==============================
  // CHART INITIALISATION
  // ==============================

  ngAfterViewInit(): void {

    if (!this.loadingTickets && !this.errorMessage) {
      this.createCharts();
    }
  }

  createCharts(): void {

    this.destroyCharts();

    this.createStatusChart();
    this.createPriorityChart();
    this.createComparisonChart();
    this.createActivityChart();
  }

  // ==============================
  // STATUS CHART
  // ==============================

  createStatusChart(): void {

    if (!this.statusChart) {
      return;
    }

    this.statusChartInstance = new Chart(
      this.statusChart.nativeElement,
      {
        type: 'doughnut',

        data: {
          labels: [
            'Open',
            'In Progress',
            'Resolved',
            'Closed'
          ],

          datasets: [
            {
              data: [
                this.openTickets,
                this.inProgressTickets,
                this.resolvedTickets,
                this.closedTickets
              ],

              borderWidth: 2
            }
          ]
        },

        options: {
          responsive: true,
          maintainAspectRatio: false,

          plugins: {
            legend: {
              position: 'bottom'
            }
          }
        }
      }
    );
  }

  // ==============================
  // PRIORITY CHART
  // ==============================

  createPriorityChart(): void {

    if (!this.priorityChart) {
      return;
    }

    this.priorityChartInstance = new Chart(
      this.priorityChart.nativeElement,
      {
        type: 'bar',

        data: {
          labels: [
            'High',
            'Medium',
            'Low'
          ],

          datasets: [
            {
              label: 'Tickets',

              data: [
                this.highPriorityTickets,
                this.mediumPriorityTickets,
                this.lowPriorityTickets
              ],

              borderWidth: 1
            }
          ]
        },

        options: {
          responsive: true,
          maintainAspectRatio: false,

          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                precision: 0
              }
            }
          },

          plugins: {
            legend: {
              display: false
            }
          }
        }
      }
    );
  }

  // ==============================
  // STATUS COMPARISON CHART
  // ==============================

  createComparisonChart(): void {

    if (!this.comparisonChart) {
      return;
    }

    this.comparisonChartInstance = new Chart(
      this.comparisonChart.nativeElement,
      {
        type: 'bar',

        data: {
          labels: [
            'Open',
            'In Progress',
            'Resolved',
            'Closed'
          ],

          datasets: [
            {
              label: 'Tickets',

              data: [
                this.openTickets,
                this.inProgressTickets,
                this.resolvedTickets,
                this.closedTickets
              ],

              borderWidth: 1
            }
          ]
        },

        options: {
          responsive: true,
          maintainAspectRatio: false,

          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                precision: 0
              }
            }
          },

          plugins: {
            legend: {
              display: false
            }
          }
        }
      }
    );
  }

  // ==============================
  // ACTIVITY CHART
  // ==============================

  createActivityChart(): void {

    if (!this.activityChart) {
      return;
    }

    const months = this.getLastSixMonths();

    const ticketCounts = months.map(month =>
      this.tickets.filter(ticket =>
        this.isTicketInMonth(ticket, month)
      ).length
    );

    this.activityChartInstance = new Chart(
      this.activityChart.nativeElement,
      {
        type: 'line',

        data: {
          labels: months.map(month =>
            month.toLocaleDateString(
              'en-US',
              {
                month: 'short'
              }
            )
          ),

          datasets: [
            {
              label: 'Tickets Created',

              data: ticketCounts,

              tension: 0.3,

              fill: false,

              borderWidth: 2,

              pointRadius: 4
            }
          ]
        },

        options: {
          responsive: true,
          maintainAspectRatio: false,

          scales: {
            y: {
              beginAtZero: true,

              ticks: {
                precision: 0
              }
            }
          }
        }
      }
    );
  }

  // ==============================
  // LAST SIX MONTHS
  // ==============================

  getLastSixMonths(): Date[] {

    const months: Date[] = [];

    const now = new Date();

    for (let i = 5; i >= 0; i--) {

      months.push(
        new Date(
          now.getFullYear(),
          now.getMonth() - i,
          1
        )
      );
    }

    return months;
  }

  // ==============================
  // CHECK TICKET MONTH
  // ==============================

  isTicketInMonth(
    ticket: Ticket,
    month: Date
  ): boolean {

    const createdAt = (ticket as any).createdAt;

    if (!createdAt) {
      return false;
    }

    const ticketDate = new Date(createdAt);

    return (
      ticketDate.getFullYear() === month.getFullYear() &&
      ticketDate.getMonth() === month.getMonth()
    );
  }

  // ==============================
  // DESTROY CHARTS
  // ==============================

  destroyCharts(): void {

    this.statusChartInstance?.destroy();
    this.priorityChartInstance?.destroy();
    this.comparisonChartInstance?.destroy();
    this.activityChartInstance?.destroy();

    this.statusChartInstance = undefined;
    this.priorityChartInstance = undefined;
    this.comparisonChartInstance = undefined;
    this.activityChartInstance = undefined;
  }

  // ==============================
  // NAVIGATION
  // ==============================

  goToDashboard(): void {
    this.router.navigate(['/admin-dashboard']);
  }

  // ==============================
  // LOGOUT
  // ==============================

  logout(): void {

    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');

    this.router.navigate(['/login']);
  }

  // ==============================
  // CLEANUP
  // ==============================

  ngOnDestroy(): void {
    this.destroyCharts();
  }
}