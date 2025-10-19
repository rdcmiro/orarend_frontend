import { 
  Component, 
  OnInit, 
  ElementRef, 
  Renderer2, 
  ViewChild 
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoggedHeaderComponent } from '../logged-header/logged-header.component';
import { TodoSectionComponent } from '../todo-section/todo-section.component';
import { ScheduleSectionComponent } from '../schedule-section/schedule-section.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    LoggedHeaderComponent,
    TodoSectionComponent,
    ScheduleSectionComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @ViewChild(ScheduleSectionComponent) scheduleSection!: ScheduleSectionComponent;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.adjustLayout();
  }

  private adjustLayout(): void {
    const header = document.querySelector('.logged-header');
    const container = this.el.nativeElement.querySelector('.home-container');
    if (header && container) {
      const headerHeight = header.clientHeight;
      this.renderer.setStyle(container, 'padding-top', `${headerHeight + 32}px`);
    }
  }

  // 🔹 A gombok a gyermek komponens metódusait hívják
  onAddLesson(): void {
    this.scheduleSection.onAddLesson();
  }

  onManageLessons(): void {
    this.scheduleSection.onManageLessons();
  }

  openEditLessonsDialog(): void {
    this.scheduleSection.openEditLessonsDialog();
  }
}
