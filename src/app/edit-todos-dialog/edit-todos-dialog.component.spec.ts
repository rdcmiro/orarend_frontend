import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTodosDialogComponent } from './edit-todos-dialog.component';

describe('EditTodosDialogComponent', () => {
  let component: EditTodosDialogComponent;
  let fixture: ComponentFixture<EditTodosDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditTodosDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditTodosDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
