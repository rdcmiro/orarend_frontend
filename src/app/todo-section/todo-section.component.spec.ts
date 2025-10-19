import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoSectionComponent } from './todo-section.component';

describe('TodoSectionComponent', () => {
  let component: TodoSectionComponent;
  let fixture: ComponentFixture<TodoSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoSectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TodoSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
