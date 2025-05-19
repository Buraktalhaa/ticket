import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusPanelEditComponent } from './status-panel-edit.component';

describe('StatusPanelEditComponent', () => {
  let component: StatusPanelEditComponent;
  let fixture: ComponentFixture<StatusPanelEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatusPanelEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatusPanelEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
