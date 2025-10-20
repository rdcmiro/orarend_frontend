import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoListDialogComponent } from './todo-list-dialog.component';

describe('TodoListDialogComponent', () => {
  let component: TodoListDialogComponent;
  let fixture: ComponentFixture<TodoListDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoListDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TodoListDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
