import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class RapportService {

  private baseUrl = 'http://localhost:1919/api/rapports';

  constructor(private http: HttpClient) {}
  uploadReport(file: File, name: string): Observable<number | HttpEvent<any>> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('rapportName', name);
  
    return this.http.post(`${this.baseUrl}/upload`, formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      map(event => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          return Math.round(100 * event.loaded / event.total);
        } else if (event.type === HttpEventType.Response) {
          return 100;
        }
        return 0;
      })
    );
  }
  
  getAllReports(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}`);
  }
  
  downloadReport(fileName: string): Observable<Blob> {
    return this.http.get(`/${this.baseUrl}/download/${fileName}`, { responseType: 'blob' });
  }
  
  deleteReport(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
  
}
