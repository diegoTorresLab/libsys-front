import { Component, inject, OnInit, DestroyRef } from '@angular/core';
import { Author } from './author.model';
import { AuthorService } from './author.service';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { AuthorFormComponent } from './author-form/author-form.component';
import { AuthorCardComponent } from './author-card/author-card.component';

@Component({
  selector: 'app-author-list',
  imports: [
    TableModule,
    InputTextModule,
    CommonModule,
    ButtonModule,
    RouterModule,
    ToastModule,
    ConfirmDialogModule,
    AuthorFormComponent,
    AuthorCardComponent
  ],

  providers: [MessageService, ConfirmationService],
  templateUrl: './author-list.component.html',
  styleUrl: './author-list.component.css',
})
export class AuthorListComponent implements OnInit {
  author: Author[] = [];
  visibleForm = false;
  visibleCard = false;
  selectedAuthor: Author | null = null;

  private authorService = inject(AuthorService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.getAuthors();
  }

  getAuthors() {
    const subscription = this.authorService.getAuthors().subscribe({
      next: (data) => {
        this.author = data;
        },
      error: (err) => {
        console.log(err);
        this.showError();
      },
    });
    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  showError() {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Error al obtener autores',
      life: 3000,
    });
  }

  deleteAuthors(idAutor: string){
    const subscription = this.authorService.deleteAuthors(idAutor).subscribe({
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
    });
    this.destroyRef.onDestroy(() => subscription.unsubscribe());
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
    });
  }

  createAuthor(author?: Author){
    this.selectedAuthor = author || null;
    this.visibleForm = true;
  }

  updateAuthors(author?: Author){
    this.selectedAuthor = author || null;
    this.visibleForm = true;
  }

  getAuthorsById(author?: Author){
    this.selectedAuthor = author!;
    this.visibleCard = true;
  }

  closeDialog(){
    this.visibleForm = false;
    this.visibleCard = false;
    this.getAuthors();
  }
}
