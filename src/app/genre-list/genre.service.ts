import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Genre } from './genre.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GenreService {

  private apiUrl = 'http://localhost:8080/genero'

  private http = inject(HttpClient)

  createGenres(genre: Genre): Observable<Genre>{
    return this.http.post<Genre>(this.apiUrl, genre);
  }

  updateGenres(genre: Genre): Observable<Genre>{
    return this.http.put<Genre>(this.apiUrl, genre);
  }

  getGenres(): Observable<Genre[]>{
    return this.http.get<Genre[]>(this.apiUrl);
  } 

  deleteGenres(idGenero: string){
    return this.http.delete(`${this.apiUrl}/${idGenero}`);
  }
}
