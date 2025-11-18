import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { Book } from './book.model';
import { BookService } from './book.service';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { BookFormComponent } from './book-form/book-form.component';

@Component({
  selector: 'app-book-list',
  imports: [
    TableModule,
    InputTextModule,
    CommonModule,
    ButtonModule,
    RouterModule,
    ToastModule,
    ConfirmDialogModule,
    BookFormComponent
],
  providers: [MessageService, ConfirmationService],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.css'
})
export class BookListComponent implements OnInit{
  book: Book[] = [];
  visibleForm = false;
  visibleCard = false;
  selectedBook: Book | null = null;

  private bookService = inject(BookService);
  private messageService = inject(MessageService);
  private confirmationService = inject (ConfirmationService);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.getBooks();  
  }

  getBooks(){
    const subscription = this.bookService.getBooks().subscribe({
      next: (data) => {
        this.book = data;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al obtener libros',
          life: 3000,
        });
      }
    });
    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  deleteBooks(idLibro: string){
    const subscription = this.bookService.deleteBooks(idLibro).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Confirmado',
          detail: 'Libro Eliminado',
        });
        this.getBooks();
      },
      error: () => {
          this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo eliminar el libro',
        });
      },
    });
    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  confirmation(event: Event, idLibro: string){
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: '¿Estas seguro de querer borrar este libro?',
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
        this.deleteBooks(idLibro);
      },
    });
  }

  openForm(book?: Book){
    this.selectedBook = book || null;
    this.visibleForm = true;
  }

  closedDialog(){
    this.visibleForm = false;
    this.visibleCard = false;
    this.getBooks();
  }
}
