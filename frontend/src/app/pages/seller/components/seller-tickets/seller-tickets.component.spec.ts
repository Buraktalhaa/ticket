import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerTicketsComponent } from './seller-tickets.component';

describe('SellerTicketsComponent', () => {
  let component: SellerTicketsComponent;
  let fixture: ComponentFixture<SellerTicketsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellerTicketsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellerTicketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
