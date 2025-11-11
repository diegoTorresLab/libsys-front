import { Component, OnInit } from '@angular/core';
import { Author } from './author.model';
import { AuthorService } from './author.service';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-author-list',
  imports: [
    TableModule,
    InputTextModule,
    CommonModule,
    ButtonModule,
    RouterModule,
    Toast,
  ],
  providers: [MessageService],
  templateUrl: './author-list.component.html',
  styleUrl: './author-list.component.css',
})
export class AuthorListComponent implements OnInit {
  author: Author[] = [];

  constructor(
    private authorService: AuthorService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.getAuthors();
  }

  getAuthors() {
    this.authorService.getAuthors().subscribe({
      next: (data) => {
        this.author = data;
      },
      error: (err) => {
        console.log(err);
        this.showError();
      },
    });
  }

  showError() {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Error al obtener autores',
      life: 3000,
    });
  }
  getAuthorsById(id: string){
    //TODO: Implement get by id logic
    console.log('Update author with id:', id);
  }

  updateAuthors(id: string) {
    // TODO: Implement update logic, perhaps navigate to edit form
    console.log('Update author with id:', id);
  }

  deleteAuthors(id: string) {
    //TODO: Implement delete logic
    console.log('Delete author with id:', id);
  }
}
