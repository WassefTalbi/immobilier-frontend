import { Component, ViewChild } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { RapportService } from 'src/app/core/services/rapport.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

export interface Report {
  id: number;
  rapportName: string;
  fileName: string;
  uploadDate: string;
  uploadBy: { firstName: string; lastName: string } | null;
}

@Component({
  selector: 'app-rapport',
  templateUrl: './rapport.component.html',
  styleUrls: ['./rapport.component.scss'],
  providers: [DecimalPipe]
})
export class RapportComponent {
  @ViewChild('deleteModal') deleteModal?: ModalDirective;

  breadCrumbItems = [
    { label: 'Documents', active: true },
    { label: 'Rapports', active: true }
  ];

  currentPage = 1;
  itemsPerPage = 9;
  totalItems = 0;

  allReports: any[] = [];
  filteredReports: any[] = [];
  displayedReports: any[] = [];
  searchTerm = '';

  selectedFile: File | null = null;
  uploadProgress:any = 0;
  deleteId: any ;

  constructor(
    private reportService: RapportService,
    private toastr: ToastrService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.loadReports();
  }

  loadReports(): void {
    this.reportService.getAllReports().subscribe({
      next: (reports) => {
        console.log(reports);
        
        this.allReports = reports;
        this.filteredReports = [...this.allReports];
        this.totalItems = this.filteredReports.length;
        this.updateDisplayedReports();
      },
      error: (err) => {
        this.toastr.error('Erreur lors du chargement des rapports', 'Erreur');
        console.error(err);
      }
    });
  }
  getReportFileUrl(fileName: string): SafeResourceUrl {
    const url = `http://localhost:1919/api/rapports/download/${fileName}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
  getReportDirectUrl(fileName: string): string {
    return `http://localhost:1919/api/rapports/download/${fileName}`;
  }
  openReport(report: Report): void {
    const url = this.getReportDirectUrl(report.fileName);
    window.open(url, '_blank');
  }
  trackById(index: number, item: Report): number {
    return item.id;
  }
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  uploadFile(): void {
    if (!this.selectedFile) return;

    const rapportName = this.selectedFile.name;
    this.uploadProgress = 0;

    this.reportService.uploadReport(this.selectedFile, rapportName).subscribe({
      next: (progress) => {
        if (progress === 100) {
          this.toastr.success('Rapport uploadé avec succès', 'Succès');
          this.selectedFile = null;
          this.loadReports();
        }
        this.uploadProgress = progress;
      },
      error: (err) => {
        this.toastr.error("Échec de l'upload du rapport", 'Erreur');
        console.error(err);
        this.uploadProgress = 0;
      }
    });
  }

  filterReports(): void {
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      this.filteredReports = this.allReports.filter(report =>
        report.rapportName.toLowerCase().includes(term) ||
        (report.uploadBy?.firstName?.toLowerCase().includes(term) || '') ||
        (report.uploadBy?.lastName?.toLowerCase().includes(term) || '')
      );
    } else {
      this.filteredReports = [...this.allReports];
    }
    this.currentPage = 1;
    this.updateDisplayedReports();
  }

  downloadReport(report: Report): void {
    this.reportService.downloadReport(report.fileName).subscribe({
      next: (file) => {
        const blob = new Blob([file], { type: 'application/octet-stream' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = report.fileName;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        this.toastr.error('Échec du téléchargement', 'Erreur');
        console.error(err);
      }
    });
  }

  confirmDelete(id: number): void {
    this.deleteId = id;
    this.deleteModal?.show();
  }
  
  deleteReport(): void {
    if (!this.deleteId) return;
  
    this.reportService.deleteReport(this.deleteId).subscribe({
      next: () => {
        this.toastr.success('Rapport supprimé avec succès', 'Succès');
        this.loadReports();
        this.deleteModal?.hide();
      },
      error: (err) => {
        this.toastr.error('Échec de la suppression', 'Erreur');
        console.error(err);
        this.deleteModal?.hide();
      }
    });
  }

  pageChanged(event: any): void {
    this.currentPage = event.page;
    this.itemsPerPage = event.itemsPerPage;
    this.updateDisplayedReports();
  }

  private updateDisplayedReports(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayedReports = this.filteredReports.slice(startIndex, endIndex);
  }
}
