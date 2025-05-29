import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignButtonComponent } from './sign-button.component';

describe('SignButtonComponent', () => {
  let component: SignButtonComponent;
  let fixture: ComponentFixture<SignButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
