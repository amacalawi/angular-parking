import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadCreditComponent } from './load-credit.component';

describe('LoadCreditComponent', () => {
  let component: LoadCreditComponent;
  let fixture: ComponentFixture<LoadCreditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadCreditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadCreditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
