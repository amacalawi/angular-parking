import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubcriptionRateComponent } from './subcription-rate.component';

describe('SubcriptionRateComponent', () => {
  let component: SubcriptionRateComponent;
  let fixture: ComponentFixture<SubcriptionRateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubcriptionRateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubcriptionRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
