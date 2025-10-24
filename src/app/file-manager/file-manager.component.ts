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
import { FileService } from '../services/file.service';
import { LoggedHeaderComponent } from '../logged-header/logged-header.component';

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
  uploadedFileId?: number;
  summaryText = '';
  loading = false;
  files: any[] = [];
  hasLoaded = false;

  constructor(
    private fileService: FileService,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
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
      next: (res: any) => {
        this.uploadedFileId = res.id;
        this.selectedFile = null;
        this.loading = false;
        this.loadFiles(); // frissítjük a listát
      },
      error: (err: any) => {
        console.error('Feltöltés hiba:', err);
        this.loading = false;
      }
    });
  }

  /** AI összefoglalás (egyetlen fájlra) */
  onSummarize(): void {
    if (!this.uploadedFileId) return;
    this.loading = true;
    this.fileService.getSummary(this.uploadedFileId).subscribe({
      next: (res: string) => {
        this.summaryText = res;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('AI összefoglalás hiba:', err);
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

  /** Letöltés gomb — fájl letöltése */
  onDownload(id: number) {
    this.fileService.downloadFile(id).subscribe(res => {
      const blob = res.body!;
      const contentDisposition = res.headers.get('Content-Disposition');
      const match = /filename\*?=(?:UTF-8'')?"?([^"]+)"?/.exec(contentDisposition || '');
      const filename = match ? decodeURIComponent(match[1]) : 'file';
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
}
