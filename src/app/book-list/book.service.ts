import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Book } from './book.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  private apiUrl = 'http://localhost:8080/libro'

  constructor(private http: HttpClient) { }

  createBooks(book: Book): Observable<Book>{
    return this.http.post<Book>(this.apiUrl, book);
  }

  updateBooks(book: Book){
    return this.http.put(this.apiUrl, book);
  }

  getBooks(): Observable<Book[]>{
    return this.http.get<Book[]>(this.apiUrl);
  }

  getBooksById(idLibro: string): Observable<Book>{
    return this.http.get<Book>(`${this.apiUrl}/${idLibro}`);
  }

  deleteBooks(idLibro: string){
    return this.http.delete(`${this.apiUrl}/${idLibro}`)
  }
}

