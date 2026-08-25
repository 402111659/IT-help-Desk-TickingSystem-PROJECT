import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeTicketDetails } from './employee-ticket-details';

describe('EmployeeTicketDetails', () => {
  let component: EmployeeTicketDetails;
  let fixture: ComponentFixture<EmployeeTicketDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeTicketDetails],
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeTicketDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
