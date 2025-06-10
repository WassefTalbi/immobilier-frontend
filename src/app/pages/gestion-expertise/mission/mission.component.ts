import { Component, OnInit,ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Mission } from 'src/app/core/model/mission';
import { MissionService } from 'src/app/core/services/mission.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
@Component({
  selector: 'app-mission',
  templateUrl: './mission.component.html',
  styleUrl: './mission.component.scss'
})
export class MissionComponent implements OnInit {



  @ViewChild('addMissionModal') addMissionModal!: ModalDirective;
  @ViewChild('missionDetailsModal') missionDetailsModal: any;
  @ViewChild('deleteMissionModal') deleteMissionModal!: ModalDirective;

  breadCrumbItems = [{ label: 'Dashboard', link: '/' }, { label: 'Missions', active: true }];
  missions: any[] = [];
  filteredMissions: any[] = [];

  selectedStatut: string = '';
  term: string = '';
  missionForm!: FormGroup;

  newMission: Partial<Mission> = {};
  selectedMission: any = null;
  deleteMissionId: number | null = null;

  constructor(private fb: FormBuilder,private missionService: MissionService, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.initForm();
    this.loadMissions(); 
  }

  initForm() {
    this.missionForm = this.fb.group({
      title: ['', Validators.required],
      dateDebut: ['', Validators.required],
      
    });
  }

  loadMissions() {
    this.missionService.getMissions().subscribe({
      next: (missions) => {
        this.missions = missions;
        this.filteredMissions = missions;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des missions', err);
        this.toastr.error('Erreur lors du chargement des missions', 'Erreur');
      }
    });
  }
  

  getColor(statut: string): string {
    switch (statut) {
      case 'EN_COURS': return 'secondary';
      case 'CONFIRMEE': return 'info';
      case 'TERMINEE': return 'success';
      case 'EXPIREE': return 'warning';
      default: return 'secondary';
    }
  }

  getStatusSymbol(statut: string): string {
    switch (statut) {
      case 'EN_COURS': return '🕓';
      case 'CONFIRMEE': return '✅';
      case 'TERMINEE': return '✔️';
      case 'EXPIREE': return '⛔';
      default: return '';
    }
  }
  
  getStatusLabel(statut: string): string {
    switch (statut) {
      case 'EN_COURS': return 'En cours';
      case 'CONFIRMEE': return 'Confirmée';
      case 'TERMINEE': return 'Terminée';
      case 'EXPIREE': return 'Expirée';
      default: return '';
    }
  }

  filterdata() {
  const termLower = this.term?.trim().toLowerCase() || '';
  const selectedStatut = this.selectedStatut;

  this.filteredMissions = this.missions.filter(mission => {
    const title = mission.title?.toLowerCase() || '';
    const statut = mission.statut || '';
    return (
      (!termLower || title.includes(termLower)) &&
      (!selectedStatut || statut === selectedStatut)
    );
  });
}

  saveMission() {
    if (this.missionForm.invalid) {
      this.toastr.error('Veuillez remplir tous les champs requis.', 'Erreur');
      return;
    }
  
    const missionData = this.missionForm.value;
  
    this.missionService.saveMission(missionData).subscribe({
      next: (savedMission) => {
        this.missions.push(savedMission);  
        this.filterdata();
        this.missionForm.reset();
        this.addMissionModal.hide();
        this.toastr.success('Mission créée avec succès !', 'Succès');
      },
      error: (err) => {
        console.error('Erreur lors de la création de la mission', err);
        this.toastr.error('Erreur lors de la création de la mission.', 'Erreur');
      }
    });
  }

  openMissionDetails(mission: any): void {
    this.selectedMission = mission;
    this.missionDetailsModal.show();
  }
  getRoleLabel(authorities: any[]): string {
    if (!authorities || authorities.length === 0) return 'N/A';
    switch (authorities[0].authority) {
      case 'TECHNICIEN': return 'Technicien';
      case 'REDACTEUR': return 'Rédacteur';
      case 'VERIFICATEUR': return 'Vérificateur';
      default: return authorities[0].authority;
    }
  }

  confirmDeleteMission(id: number): void {
    this.deleteMissionId = id;
    this.deleteMissionModal.show();
  }
  
  deleteMission(): void {
    if (!this.deleteMissionId) return;
  
    this.missionService.deleteMission(this.deleteMissionId).subscribe({
      next: () => {
        this.toastr.success('Mission supprimée avec succès !', 'Succès');
        this.missions = this.missions.filter(m => m.id !== this.deleteMissionId);
        this.filterdata();
        this.deleteMissionModal.hide();
        this.deleteMissionId = null;
      },
      error: (err) => {
        console.error('Erreur lors de la suppression', err);
        this.toastr.error('Erreur lors de la suppression de la mission.', 'Erreur');
        this.deleteMissionModal.hide();
      }
    });
  }
  

}
