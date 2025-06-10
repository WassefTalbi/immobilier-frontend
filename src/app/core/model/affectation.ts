import { Utilisateur } from "./utilisateur";

export interface Affectation {
  utilisateur: Utilisateur;
  statut: 'EN_ATTENTE' | 'ACCEPTEE' | 'REFUSEE';
}