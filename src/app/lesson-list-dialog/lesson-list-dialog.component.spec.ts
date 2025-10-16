import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonListDialogComponent } from './lesson-list-dialog.component';

describe('LessonListDialogComponent', () => {
  let component: LessonListDialogComponent;
  let fixture: ComponentFixture<LessonListDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LessonListDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LessonListDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
