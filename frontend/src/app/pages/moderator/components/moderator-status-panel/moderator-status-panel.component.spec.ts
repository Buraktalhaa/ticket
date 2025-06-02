import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModeratorStatusPanelComponent } from './moderator-status-panel.component';

describe('ModeratorStatusPanelComponent', () => {
  let component: ModeratorStatusPanelComponent;
  let fixture: ComponentFixture<ModeratorStatusPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModeratorStatusPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModeratorStatusPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
