import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItSupport } from './it-support';

describe('ItSupport', () => {
  let component: ItSupport;
  let fixture: ComponentFixture<ItSupport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItSupport],
    }).compileComponents();

    fixture = TestBed.createComponent(ItSupport);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
