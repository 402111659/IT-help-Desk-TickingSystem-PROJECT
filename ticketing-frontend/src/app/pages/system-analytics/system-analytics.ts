import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { TicketService, Ticket } from '../../services/ticket.service';

import Chart from 'chart.js/auto';

@Component({
  selector: 'app-system-analytics',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './system-analytics.html',
  styleUrl: './system-analytics.css'
})
export class SystemAnalytics implements AfterViewInit, OnDestroy {

  /* =========================================================
     CANVAS REFERENCES
     ========================================================= */

  @ViewChild('volumeChart')
  volumeChart!: ElementRef<HTMLCanvasElement>;

  @ViewChild('statusChart')
  statusChart!: ElementRef<HTMLCanvasElement>;

  @ViewChild('priorityChart')
  priorityChart!: ElementRef<HTMLCanvasElement>;

  @ViewChild('technicianChart')
  technicianChart!: ElementRef<HTMLCanvasElement>;


  /* =========================================================
     CHART INSTANCES
     ========================================================= */

  private volumeChartInstance?: Chart;
  private statusChartInstance?: Chart;
  private priorityChartInstance?: Chart;
  private technicianChartInstance?: Chart;


  /* =========================================================
     USER INFORMATION
     ========================================================= */

  userEmail = '';
  userInitial = '?';

  currentDate = '';


  /* =========================================================
     TICKETS
     ========================================================= */

  tickets: Ticket[] = [];

  loadingTickets = true;

  errorMessage = '';


  /* =========================================================
     CONSTRUCTOR
     ========================================================= */

  constructor(
    private ticketService: TicketService,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef
  ) {

    if (!this.checkAdmin()) {
      return;
    }

    this.loadUser();
    this.setDate();
    this.loadTickets();
  }


  /* =========================================================
     ADMIN SECURITY CHECK
     ========================================================= */

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


  /* =========================================================
     INITIALISE CHARTS
     ========================================================= */

  ngAfterViewInit(): void {

    if (this.tickets.length > 0) {
      this.createCharts();
    }
  }


  /* =========================================================
     LOAD USER
     ========================================================= */

  loadUser(): void {

    const email = localStorage.getItem('userEmail');

    if (email) {

      this.userEmail = email;
      this.userInitial = email.charAt(0).toUpperCase();

    } else {

      this.userEmail = 'Administrator';
      this.userInitial = 'A';

    }
  }


  /* =========================================================
     DATE
     ========================================================= */

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


  /* =========================================================
     LOAD TICKETS
     ========================================================= */

  loadTickets(): void {

    this.loadingTickets = true;
    this.errorMessage = '';

    const token = localStorage.getItem('token');

    if (!token) {

      this.loadingTickets = false;

      this.router.navigate(['/login']);

      return;
    }

    this.ticketService.getAllTickets().subscribe({

      next: (tickets: Ticket[]) => {

        this.tickets = tickets || [];

        this.loadingTickets = false;

        this.changeDetectorRef.detectChanges();

        setTimeout(() => {
          this.createCharts();
        }, 50);
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
            'You do not have permission to access system analytics.';

        } else if (error.status === 0) {

          this.errorMessage =
            'Unable to connect to the server. Make sure Spring Boot is running.';

        } else {

          this.errorMessage =
            'Unable to load ticket analytics from the server.';
        }

        this.changeDetectorRef.detectChanges();
      }
    });
  }


  /* =========================================================
     KPI GETTERS
     ========================================================= */

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

    return this.tickets.filter(
      ticket =>
        ticket.status !== 'RESOLVED' &&
        ticket.status !== 'CLOSED'
    ).length;
  }


  get highPriorityTickets(): number {

    return this.tickets.filter(
      ticket =>
        ticket.priority === 'HIGH' ||
        ticket.priority === 'CRITICAL'
    ).length;
  }


  get assignedTickets(): number {

    return this.tickets.filter(
      ticket => this.hasAssignedTechnician(ticket)
    ).length;
  }


  get unassignedTickets(): number {

    return this.tickets.filter(
      ticket => !this.hasAssignedTechnician(ticket)
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


  get assignmentRate(): number {

    if (this.totalTickets === 0) {
      return 0;
    }

    return Math.round(
      (this.assignedTickets / this.totalTickets) * 100
    );
  }


  /* =========================================================
     CHECK ASSIGNMENT
     ========================================================= */

  hasAssignedTechnician(ticket: Ticket): boolean {

    const item: any = ticket;

    return !!(
      item.technician ||
      item.assignedTechnician ||
      item.assignedTo ||
      item.technicianId
    );
  }


  /* =========================================================
     CREATE ALL CHARTS
     ========================================================= */

  createCharts(): void {

    if (!this.volumeChart ||
        !this.statusChart ||
        !this.priorityChart ||
        !this.technicianChart) {

      return;
    }

    this.destroyCharts();

    this.createVolumeChart();
    this.createStatusChart();
    this.createPriorityChart();
    this.createTechnicianChart();
  }


  /* =========================================================
     CHART DEFAULTS
     ========================================================= */

  private chartTextColor = '#9aa6b1';

  private chartTitleColor = '#dce4e9';

  private gridColor = 'rgba(255,255,255,0.06)';


  /* =========================================================
     VOLUME CHART
     ========================================================= */

  createVolumeChart(): void {

    const labels = this.getLastSixMonths();

    const values = labels.map(month => {

      return this.tickets.filter(ticket => {

        const dateValue = (ticket as any).createdAt;

        if (!dateValue) {
          return false;
        }

        const date = new Date(dateValue);

        return (
          date.getFullYear() === month.year &&
          date.getMonth() === month.month
        );

      }).length;

    });


    this.volumeChartInstance = new Chart(
      this.volumeChart.nativeElement,
      {
        type: 'line',

        data: {
          labels: labels.map(
            month => month.label
          ),

          datasets: [
            {
              label: 'Tickets Created',

              data: values,

              borderWidth: 2,

              tension: 0.35,

              fill: false,

              pointRadius: 4,

              pointHoverRadius: 6
            }
          ]
        },

        options: {

          responsive: true,

          maintainAspectRatio: false,

          plugins: {

            legend: {
              display: true,

              labels: {
                color: this.chartTextColor,

                font: {
                  size: 12
                }
              }
            }
          },

          scales: {

            x: {
              ticks: {
                color: this.chartTextColor,

                font: {
                  size: 11
                }
              },

              grid: {
                color: this.gridColor
              }
            },

            y: {

              beginAtZero: true,

              ticks: {
                color: this.chartTextColor,

                precision: 0,

                font: {
                  size: 11
                }
              },

              grid: {
                color: this.gridColor
              }
            }
          }
        }
      }
    );
  }


  /* =========================================================
     STATUS DOUGHNUT
     ========================================================= */

  createStatusChart(): void {

    const values = [
      this.openTickets,
      this.inProgressTickets,
      this.resolvedTickets,
      this.closedTickets
    ];


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
              data: values,

              borderWidth: 2
            }
          ]
        },

        options: {

          responsive: true,

          maintainAspectRatio: false,

          cutout: '62%',

          plugins: {

            legend: {

              position: 'bottom',

              labels: {

                color: this.chartTextColor,

                padding: 16,

                font: {
                  size: 11
                }
              }
            }
          }
        }
      }
    );
  }


  /* =========================================================
     PRIORITY BAR CHART
     ========================================================= */

  createPriorityChart(): void {

    const priorityValues = [

      this.tickets.filter(
        ticket => ticket.priority === 'LOW'
      ).length,

      this.tickets.filter(
        ticket => ticket.priority === 'MEDIUM'
      ).length,

      this.tickets.filter(
        ticket => ticket.priority === 'HIGH'
      ).length,

      this.tickets.filter(
        ticket => ticket.priority === 'CRITICAL'
      ).length
    ];


    this.priorityChartInstance = new Chart(
      this.priorityChart.nativeElement,
      {
        type: 'bar',

        data: {

          labels: [
            'Low',
            'Medium',
            'High',
            'Critical'
          ],

          datasets: [
            {
              label: 'Tickets',

              data: priorityValues,

              borderWidth: 0,

              borderRadius: 5
            }
          ]
        },

        options: {

          responsive: true,

          maintainAspectRatio: false,

          plugins: {

            legend: {
              display: false
            }
          },

          scales: {

            x: {

              ticks: {
                color: this.chartTextColor,

                font: {
                  size: 11
                }
              },

              grid: {
                display: false
              }
            },

            y: {

              beginAtZero: true,

              ticks: {
                color: this.chartTextColor,

                precision: 0,

                font: {
                  size: 11
                }
              },

              grid: {
                color: this.gridColor
              }
            }
          }
        }
      }
    );
  }


  /* =========================================================
     TECHNICIAN WORKLOAD
     ========================================================= */

  createTechnicianChart(): void {

    const workload = new Map<string, number>();


    this.tickets.forEach(ticket => {

      const technician = this.getTechnicianName(ticket);

      if (!technician) {
        return;
      }

      workload.set(
        technician,
        (workload.get(technician) || 0) + 1
      );

    });


    let entries = Array.from(
      workload.entries()
    );


    entries.sort(
      (a, b) => b[1] - a[1]
    );


    entries = entries.slice(0, 8);


    if (entries.length === 0) {

      entries = [
        ['No technicians assigned', 0]
      ];
    }


    this.technicianChartInstance = new Chart(
      this.technicianChart.nativeElement,
      {
        type: 'bar',

        data: {

          labels: entries.map(
            entry => entry[0]
          ),

          datasets: [
            {
              label: 'Assigned Tickets',

              data: entries.map(
                entry => entry[1]
              ),

              borderWidth: 0,

              borderRadius: 5
            }
          ]
        },

        options: {

          indexAxis: 'y',

          responsive: true,

          maintainAspectRatio: false,

          plugins: {

            legend: {
              display: false
            }
          },

          scales: {

            x: {

              beginAtZero: true,

              ticks: {

                color: this.chartTextColor,

                precision: 0,

                font: {
                  size: 10
                }
              },

              grid: {
                color: this.gridColor
              }
            },

            y: {

              ticks: {

                color: this.chartTextColor,

                font: {
                  size: 10
                }
              },

              grid: {
                display: false
              }
            }
          }
        }
      }
    );
  }


  /* =========================================================
     GET TECHNICIAN NAME
     ========================================================= */

  getTechnicianName(ticket: Ticket): string {

    const item: any = ticket;


    if (item.technician) {

      if (typeof item.technician === 'string') {
        return item.technician;
      }

      if (item.technician.email) {
        return item.technician.email;
      }

      if (item.technician.name) {
        return item.technician.name;
      }

      if (item.technician.firstName) {

        return `${item.technician.firstName} ${
          item.technician.lastName || ''
        }`.trim();
      }
    }


    if (item.assignedTechnician) {

      if (typeof item.assignedTechnician === 'string') {
        return item.assignedTechnician;
      }

      if (item.assignedTechnician.email) {
        return item.assignedTechnician.email;
      }

      if (item.assignedTechnician.name) {
        return item.assignedTechnician.name;
      }
    }


    if (item.assignedTo) {

      if (typeof item.assignedTo === 'string') {
        return item.assignedTo;
      }

      if (item.assignedTo.email) {
        return item.assignedTo.email;
      }

      if (item.assignedTo.name) {
        return item.assignedTo.name;
      }
    }


    if (item.technicianEmail) {
      return item.technicianEmail;
    }


    return '';
  }


  /* =========================================================
     LAST SIX MONTHS
     ========================================================= */

  getLastSixMonths(): {
    label: string;
    month: number;
    year: number;
  }[] {

    const result = [];

    const now = new Date();


    for (let i = 5; i >= 0; i--) {

      const date = new Date(
        now.getFullYear(),
        now.getMonth() - i,
        1
      );


      result.push({

        label: date.toLocaleDateString(
          'en-ZA',
          {
            month: 'short'
          }
        ),

        month: date.getMonth(),

        year: date.getFullYear()
      });
    }


    return result;
  }


  /* =========================================================
     NAVIGATION
     ========================================================= */

  goToDashboard(): void {

    this.router.navigate([
      '/admin-dashboard'
    ]);
  }


  viewTickets(): void {

    this.router.navigate([
      '/tickets'
    ]);
  }


  /* =========================================================
     LOGOUT
     ========================================================= */

  logout(): void {

    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');

    this.router.navigate([
      '/login'
    ]);
  }


  /* =========================================================
     DESTROY CHARTS
     ========================================================= */

  destroyCharts(): void {

    this.volumeChartInstance?.destroy();

    this.statusChartInstance?.destroy();

    this.priorityChartInstance?.destroy();

    this.technicianChartInstance?.destroy();
  }


  ngOnDestroy(): void {

    this.destroyCharts();
  }
}