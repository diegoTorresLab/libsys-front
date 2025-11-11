import { Component, OnInit } from '@angular/core';
import { Author } from './author.model';
import { AuthorService } from './author.service';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { Toast } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-author-list',
  imports: [
    TableModule,
    InputTextModule,
    CommonModule,
    ButtonModule,
    RouterModule,
    Toast,
    ConfirmDialogModule,
  ],

  providers: [MessageService, ConfirmationService],
  templateUrl: './author-list.component.html',
  styleUrl: './author-list.component.css',
})
export class AuthorListComponent implements OnInit {
  author: Author[] = [];

  constructor(
    private authorService: AuthorService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
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

  createAuthors() {
    //TODO: Implement create by id logic
    console.log('Author created');
  }

  getAuthorsById(id: string) {
    //TODO: Implement get by id logic
    console.log('Update author with  id:', id);
  }

  updateAuthors(id: string) {
    // TODO: Implement update logic, perhaps navigate to edit form
    console.log('Update author with id:', id);
  }

  deleteAuthors(idAutor: string){
    this.authorService.deleteAuthors(idAutor).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Confirmado',
          detail: 'Autor Eliminado',
        });
        this.getAuthors();
      },
      error: () => {
          this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo eliminar el autor',
        });
      },
    })
  }

  confirmation(event: Event, idAutor: string) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: '¿Estas seguro de querer borrar este autor?',
      header: 'Advertencia',
      icon: 'pi pi-info-circle',
      rejectLabel: 'Cancelar',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Borrar',
        severity: 'danger',
      },

      accept: () => {   
        this.deleteAuthors(idAutor);
      },
      reject: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Rejected',
          detail: 'You have rejected',
        });
      },
    });
  }
}
