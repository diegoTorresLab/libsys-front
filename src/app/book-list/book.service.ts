import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Book } from './book.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  private apiUrl = 'http://localhost:8080/libro'

  private http = inject(HttpClient)

  createBooks(book: Book): Observable<Book>{
    return this.http.post<Book>(this.apiUrl, book);
  }

  updateBooks(book: Book): Observable<Book>{
    return this.http.put<Book>(this.apiUrl, book);
  }

  getBooks(): Observable<Book[]>{
    return this.http.get<Book[]>(this.apiUrl);
  }

  deleteBooks(idLibro: string){
    return this.http.delete(`${this.apiUrl}/${idLibro}`)
  }
}

