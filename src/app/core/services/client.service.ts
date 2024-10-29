import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GlobalComponent } from 'src/app/global-component';
const API_URL = GlobalComponent.API_URL;
const USER=GlobalComponent.user;
@Injectable({
  providedIn: 'root'
})
export class ClientService {
  constructor(private http: HttpClient) {}

  getAllClient(): Observable<any> {
    return this.http.get(`${API_URL+USER}all-client`);
  }

  getClientById(id: number): Observable<any> {
    return this.http.get(`${API_URL+USER}findById/${id}`);
  }

  deleteClient(id: number): Observable<any> {
    return this.http.delete(`${API_URL+USER}delete/${id}`);
  }
}
