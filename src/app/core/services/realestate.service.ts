import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class RealestateService {
  private apiUrl = '/properties';
  constructor(private http: HttpClient) {}
  saveProperty(property: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, property);
  }

  getAllProperties(): Observable<any> {
    return this.http.get(`${this.apiUrl}/all`);
  }

  getPropertyById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/findById/${id}`);
  }

  updateProperty(id: number, property: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${id}`, property);
  }

  deleteProperty(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }
}
