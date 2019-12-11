import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FixedRateComponent } from './fixed-rate.component';

describe('FixedRateComponent', () => {
  let component: FixedRateComponent;
  let fixture: ComponentFixture<FixedRateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FixedRateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FixedRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
