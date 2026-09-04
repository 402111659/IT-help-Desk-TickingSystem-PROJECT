import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketStatistics } from './ticket-statistics';

describe('TicketStatistics', () => {
  let component: TicketStatistics;
  let fixture: ComponentFixture<TicketStatistics>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketStatistics],
    }).compileComponents();

    fixture = TestBed.createComponent(TicketStatistics);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
