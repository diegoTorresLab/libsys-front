import { Component, inject, OnInit, DestroyRef } from '@angular/core';
import { Genre } from './genre.model';
import { GenreService } from './genre.service';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { GenreFormComponent } from './genre-form/genre-form.component';
@Component({
  selector: 'app-genre-list',
  imports: [
    TableModule,
    InputTextModule,
    CommonModule,
    ButtonModule,
    RouterModule,
    ToastModule,
    ConfirmDialogModule,
    GenreFormComponent,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './genre-list.component.html',
  styleUrl: './genre-list.component.css'
})
export class GenreListComponent implements OnInit{
  genre: Genre[] = [];
  visibleForm = false;
  selectedGenre: Genre | null = null;

  private genreService = inject(GenreService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.getGenres();  
  }

  getGenres(){
    const subscription = this.genreService.getGenres().subscribe({
      next: (data) => {
        this.genre = data;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al obtener generos',
          life: 3000,
        });
      }
    });
    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  deleteGenres(idGenero: string){
    const subscription = this.genreService.deleteGenres(idGenero).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Confirmado',
          detail: 'Genero Eliminado',
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo eliminar genero',
        });
      }
    });
    this.destroyRef.onDestroy(() => subscription.unsubscribe())
  }

  confirmation(event: Event, idGenero: string) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: '¿Estas seguro de querer borrar este genero?',
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
        this.deleteGenres(idGenero);
      },
    });
  }

  openForm(genre?: Genre){
    this.selectedGenre = genre || null;
    this.visibleForm = true;
  }

  closeDialog(){
    this.visibleForm = false;
    this.getGenres();
  }
}
