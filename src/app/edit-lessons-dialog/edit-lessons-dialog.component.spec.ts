import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLessonsDialogComponent } from './edit-lessons-dialog.component';

describe('EditLessonsDialogComponent', () => {
  let component: EditLessonsDialogComponent;
  let fixture: ComponentFixture<EditLessonsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditLessonsDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditLessonsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
