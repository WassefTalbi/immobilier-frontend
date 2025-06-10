import { Affectation } from "./affectation";

export interface Mission {
  id: number;
  titre: string;
  dateDebut: string;
  dateFin: string;
  statut: 'EN_ATTENTE' | 'CONFIRMEE' | 'ANNULEE';
  affectations: Affectation[];
}