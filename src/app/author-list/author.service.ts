import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Author } from './author.model';

@Injectable({
  providedIn: 'root'
})
export class AuthorService {

  private apiUrl = 'http://localhost:8080/autor';

  constructor(private http:HttpClient) {}

  createAuthors(author:Author): Observable<Author>{
    return this.http.post<Author>(this.apiUrl, author);
  }

  updateAuthors(author:Author){
    return this.http.put(this.apiUrl, author);
  }

  getAuthors(): Observable<Author[]>{
    return this.http.get<Author[]>(this.apiUrl);
  }

  deleteAuthors(idAutor:string){
    return this.http.delete(`${this.apiUrl}/${idAutor}`);
  }
}
