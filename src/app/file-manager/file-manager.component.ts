import {
  Component,
  OnInit,
  NgZone,
  ChangeDetectorRef
} from '@angular/core';
import {
  trigger,
  transition,
  style,
  animate,
  query,
  stagger
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { FileService } from '../services/file.service';
import { LoggedHeaderComponent } from '../logged-header/logged-header.component';
import { FileSummaryDialogComponent } from '../file-summary-dialog/file-summary-dialog.component';

@Component({
  selector: 'app-file-manager',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    MatCheckboxModule,
    MatButtonModule,
    MatProgressBarModule,
    MatIconModule,
    MatTooltipModule,
    MatDialogModule,
    LoggedHeaderComponent
  ],
  templateUrl: './file-manager.component.html',
  styleUrls: ['./file-manager.component.scss'],
  animations: [
    trigger('listAnimation', [
      transition('* => *', [
        query(
          ':enter',
          [
            style({ opacity: 0, transform: 'translateY(8px)' }),
            stagger(70, [
              animate(
                '0.25s ease-out',
                style({ opacity: 1, transform: 'translateY(0)' })
              )
            ])
          ],
          { optional: true }
        )
      ])
    ])
  ]
})
export class FileManagerComponent implements OnInit {
  selectedFile: File | null = null;
  loading = false;
  files: any[] = [];
  hasLoaded = false;
  deletingId: number | null = null;

  constructor(
    private fileService: FileService,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadFiles();
  }

  /** Fájl kiválasztása feltöltéshez */
  onSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
    }
  }

  /** Feltöltés */
  onUpload(): void {
    if (!this.selectedFile) return;
    this.loading = true;
    this.fileService.uploadFile(this.selectedFile).subscribe({
      next: () => {
        this.selectedFile = null;
        this.loading = false;
        this.loadFiles();
      },
      error: (err: any) => {
        console.error('Feltöltés hiba:', err);
        this.loading = false;
      }
    });
  }

  /** Fájlok lekérése */
  loadFiles(): void {
    this.loading = true;
    this.fileService.getAllFiles().subscribe({
      next: (data: any[]) => {
        this.ngZone.run(() => {
          this.files = data.map(f => ({ ...f, selected: false }));
          this.hasLoaded = true;
          this.loading = false;
          this.cdr.detectChanges();
        });
      },
      error: (err: any) => {
        console.error('🔴 Hiba a fájlok lekérésekor:', err);
        this.loading = false;
        this.hasLoaded = true;
      }
    });
  }

  /** Letöltés */
  onDownload(id: number) {
    this.fileService.downloadFile(id).subscribe(res => {
      const blob = res.body!;
      const contentDisposition = res.headers.get('Content-Disposition');
      const match = /filename\*?=(?:UTF-8'')?"?([^"]+)"?/.exec(
        contentDisposition || ''
      );
      const filename = match ? decodeURIComponent(match[1]) : 'file';
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  /** ❌ Törlés */
  onDelete(id: number) {
    if (!confirm('Biztosan törlöd ezt a fájlt?')) return;

    this.deletingId = id;

    this.fileService.deleteFile(id).subscribe({
      next: () => {
        this.deletingId = null;
        this.ngZone.run(() => {
          this.loadFiles();
        });
      },
      error: err => {
        console.error('Törlés hiba:', err);
        this.deletingId = null;
      }
    });
  }

  /** 🧠 AI összefoglaló dialógus megnyitása az adott fájlra */
  openSummaryDialog(file: any): void {
    this.dialog.open(FileSummaryDialogComponent, {
      width: '700px',
      data: {
        id: file.id,
        filename: file.filename
      }
    });
  }
}
