import { Pipe, PipeTransform } from "@angular/core";
import { Mission } from "src/app/core/model/mission";

@Pipe({ name: 'filterByStatut' })
export class FilterByStatutPipe implements PipeTransform {
  transform(missions: Mission[], statut: string): Mission[] {
    return statut ? missions.filter(m => m.statut === statut) : missions;
  }
}