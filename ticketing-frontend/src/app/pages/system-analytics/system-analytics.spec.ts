import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemAnalytics } from './system-analytics';

describe('SystemAnalytics', () => {
  let component: SystemAnalytics;
  let fixture: ComponentFixture<SystemAnalytics>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SystemAnalytics],
    }).compileComponents();

    fixture = TestBed.createComponent(SystemAnalytics);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
