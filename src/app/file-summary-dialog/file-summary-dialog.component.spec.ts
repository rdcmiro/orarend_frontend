import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileSummaryDialogComponent } from './file-summary-dialog.component';

describe('FileSummaryDialogComponent', () => {
  let component: FileSummaryDialogComponent;
  let fixture: ComponentFixture<FileSummaryDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileSummaryDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FileSummaryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
