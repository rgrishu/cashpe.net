import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaywithQrComponent } from './paywith-qr.component';

describe('PaywithQrComponent', () => {
  let component: PaywithQrComponent;
  let fixture: ComponentFixture<PaywithQrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaywithQrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaywithQrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
