import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Editorial } from './editorial.model';

@Injectable({
  providedIn: 'root'
})
export class EditorialService {

  private apiUrl = 'http://localhost:8080/editorial'

  constructor(private http: HttpClient) {}

  createEditorials(editorial: Editorial): Observable<Editorial>{
    return this.http.post<Editorial>(this.apiUrl, editorial);
  }

  updateEditorials(editorial: Editorial){
    return this.http.put(this.apiUrl, editorial);
  }

  getEditorials(): Observable<Editorial[]>{
    return this.http.get<Editorial[]>(this.apiUrl);
  }

  deleteEditorials(idEditorial: string){
    return this.http.delete(`${this.apiUrl}/${idEditorial}`);
  }
}
