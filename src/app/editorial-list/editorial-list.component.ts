import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { Editorial } from './editorial.model';
import { EditorialService } from './editorial.service';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { EditorialFormComponent } from './editorial-form/editorial-form.component';
import { EditorialCardComponent } from './editorial-card/editorial-card.component';

@Component({
  selector: 'app-editorial-list',
  imports: [
    TableModule,
    InputTextModule,
    CommonModule,
    ButtonModule,
    RouterModule,
    ToastModule,
    ConfirmDialogModule,
    EditorialFormComponent,
    EditorialCardComponent

],
  providers: [MessageService, ConfirmationService],
  templateUrl: './editorial-list.component.html',
  styleUrl: './editorial-list.component.css'
})

export class EditorialListComponent implements OnInit{
  editorial: Editorial[] = [];
  visibleForm = false;
  visibleCard = false;
  selectedEditorial: Editorial | null = null;

  private editorialService = inject(EditorialService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.getEditorials();
  }

  getEditorials(){
    const subscription = this.editorialService.getEditorials().subscribe({
      next: (data) => {
        this.editorial = data;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al obtener autores',
          life: 3000,
        });
      },
    });
    this.destroyRef.onDestroy(() => subscription.unsubscribe);
  }

  deleteEditorials(idEditorial: string){
    const subscription = this.editorialService.deleteEditorials(idEditorial).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Confirmado',
          detail: 'Autor Eliminado',
        });
        this.getEditorials();
      },
      error: () => {
          this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo eliminar el autor',
        });
      },
    });
    this.destroyRef.onDestroy(() => subscription.unsubscribe);
  }

  confirmation(event: Event, idEditorial: string){
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: '¿Estas seguro de querer borrar esta editorial?',
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
        this.deleteEditorials(idEditorial);
      },
    });
  }

  openForm(editorial?: Editorial){
    this.selectedEditorial = editorial || null;
    this.visibleForm = true;
  }

  getEditorialsById(editorial?: Editorial){
    this.selectedEditorial = editorial || null;
    this.visibleCard = true;
  }

  closeDialog(){
    this.visibleForm = false;
    this.visibleCard = false;
    this.getEditorials();
  }
}
