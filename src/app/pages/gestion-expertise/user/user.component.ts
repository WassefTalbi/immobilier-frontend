import { Component, ViewChild } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { UserProfileService } from 'src/app/core/services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  providers: [DecimalPipe]
})
export class UserComponent {
  term: string = '';
  breadCrumbItems!: Array<{}>;
  deleteID: any;
  instructorGrid: any[] = []; // Toutes les données originales
  filteredInstructors: any[] = []; // Données filtrées
  displayedInstructors: any[] = []; // Données affichées (page actuelle)
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  
  @ViewChild('deleteRecordModal', { static: false }) deleteRecordModal?: ModalDirective;

  constructor(
    private userService: UserProfileService, 
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Utilisateurs', active: true },
      { label: 'Liste', active: true }
    ];

    this.loadUsers();
  }

  loadUsers(): void {
    document.getElementById('elmLoader')?.classList.remove('d-none');
    
    this.userService.getAllUsers().subscribe({
      next: (data:any) => {
        this.instructorGrid = data;
        this.filteredInstructors = [...this.instructorGrid];
        this.totalItems = this.filteredInstructors.length;
        this.updatePagination();
        document.getElementById('elmLoader')?.classList.add('d-none');
      },
      error: (err) => {
        console.error('Error loading users:', err);
        this.toastr.error('Erreur lors du chargement des utilisateurs', 'Erreur');
        document.getElementById('elmLoader')?.classList.add('d-none');
      }
    });
  }

  showToast(message: string, type: 'success' | 'error'): void {
    if (type === 'success') {
      this.toastr.success(message, 'Succès');
    } else {
      this.toastr.error(message, 'Erreur');
    }
  }

  toggleBlock(userId: string, newNonLocked: boolean): void {
    this.userService.toggleUserBlockStatus(userId, newNonLocked).subscribe({
      next: () => {
        this.updateUserInArray(this.instructorGrid, userId, 'nonLocked', newNonLocked);
        this.updateUserInArray(this.filteredInstructors, userId, 'nonLocked', newNonLocked);
        this.updateUserInArray(this.displayedInstructors, userId, 'nonLocked', newNonLocked);
  
        this.showToast(`Utilisateur ${newNonLocked ? 'débloqué' : 'bloqué'} avec succès`, 'success');
      },
      error: () => {
        this.showToast("Erreur lors du changement du statut", 'error');
      }
    });
  }

  private updateUserInArray(array: any[], userId: string, property: string, value: any): void {
    const index = array.findIndex(u => u.id === userId);
    if (index !== -1) {
      array[index][property] = value;
    }
  }

  removeItem(id: any): void {
    this.deleteID = id;
    this.deleteRecordModal?.show();
  }

  confirmDelete(): void {
    this.userService.deleteUserById(this.deleteID).subscribe({
      next: () => {
        // Remove from all arrays
        this.instructorGrid = this.instructorGrid.filter(u => u.id !== this.deleteID);
        this.filteredInstructors = this.filteredInstructors.filter(u => u.id !== this.deleteID);
        this.totalItems = this.filteredInstructors.length;
        
        // Adjust current page if needed
        if (this.displayedInstructors.length === 0 && this.currentPage > 1) {
          this.currentPage--;
        }
        
        this.updatePagination();
        this.showToast('Utilisateur supprimé avec succès', 'success');
        this.deleteRecordModal?.hide();
      },
      error: (err) => {
        console.error('Error deleting user:', err);
        this.showToast("Erreur lors de la suppression", 'error');
        this.deleteRecordModal?.hide();
      }
    });
  }

  filterdata(): void {
    if (this.term) {
      const termLower = this.term.toLowerCase();
      this.filteredInstructors = this.instructorGrid.filter(user => 
        (user.firstName?.toLowerCase().includes(termLower)) ||
        (user.lastName?.toLowerCase().includes(termLower)) ||
        (user.email?.toLowerCase().includes(termLower)) ||
        (user.contact?.toLowerCase().includes(termLower))
      );
    } else {
      this.filteredInstructors = [...this.instructorGrid];
    }
    
    this.totalItems = this.filteredInstructors.length;
    this.currentPage = 1;
    this.updatePagination();
    this.updateNoResultDisplay();
  }

  updateNoResultDisplay(): void {
    const noResultElement = document.querySelector('.noresult') as HTMLElement;
    const paginationElement = document.getElementById('pagination-element') as HTMLElement;
    
    if (this.term && this.filteredInstructors.length === 0) {
      noResultElement.style.display = 'block';
      paginationElement?.classList.add('d-none');
    } else {
      noResultElement.style.display = 'none';
      paginationElement?.classList.remove('d-none');
    }
  }

  updatePagination(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayedInstructors = this.filteredInstructors.slice(startIndex, endIndex);
  }

  pageChanged(event: any): void {
    this.currentPage = event.page;
    this.itemsPerPage = event.itemsPerPage;
    this.updatePagination();
  }
}