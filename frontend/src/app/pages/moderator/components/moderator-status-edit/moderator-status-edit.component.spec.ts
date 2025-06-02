import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModeratorStatusEditComponent } from './moderator-status-edit.component';

describe('ModeratorStatusEditComponent', () => {
  let component: ModeratorStatusEditComponent;
  let fixture: ComponentFixture<ModeratorStatusEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModeratorStatusEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModeratorStatusEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
