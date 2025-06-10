import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Mission } from '../model/mission';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MissionService {

  private apiUrl = 'http://localhost:1919/api/missions';

  constructor(private http: HttpClient) {}

  getMissions(): Observable<Mission[]> {
    return this.http.get<Mission[]>(this.apiUrl);
  }

  saveMission(mission: Partial<Mission>) {
    return this.http.post<Mission>(this.apiUrl, mission);
  }
  deleteMission(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
