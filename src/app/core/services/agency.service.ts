import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GlobalComponent } from 'src/app/global-component';
const API_URL = GlobalComponent.API_URL;
const USER=GlobalComponent.user;
@Injectable({
  providedIn: 'root'
})
export class AgencyService {
  constructor(private http: HttpClient) {}

  saveAgency(agency: FormData): Observable<any> {
    return this.http.post(`${API_URL+USER}register-agency`, agency);
  }

  getAllAgency(): Observable<any> {
    return this.http.get(`${API_URL+USER}all-agency`);
  }

  getAgencyById(id: number): Observable<any> {
    return this.http.get(`${API_URL+USER}findById/${id}`);
  }

  updateAgency(id: number, agency: FormData): Observable<any> {
    return this.http.put(`${API_URL+USER}manage-agence/${id}`, agency);
  }

  deleteAgency(id: number): Observable<any> {
    return this.http.delete(`${API_URL+USER}delete/${id}`);
  }
}
