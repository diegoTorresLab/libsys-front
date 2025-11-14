import { Component, inject, DestroyRef, Input, Output, EventEmitter, OnChanges, SimpleChanges} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthorService } from '../author.service';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { Author } from '../author.model';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
@Component({
  selector: 'app-author-form',

  imports: [
    ReactiveFormsModule,
    ButtonModule,
    ToastModule,
    RouterModule,
    DialogModule,
    InputTextModule
  ],
  templateUrl: './author-form.component.html',
  styleUrl: './author-form.component.css',
})
export class AuthorFormComponent implements OnChanges {
  @Input() visible = false;
  @Input () selectedAuthor: Author | null = null; 
  @Output() onClose = new EventEmitter<void>();
  
  private authorService = inject(AuthorService);
  private messageService = inject(MessageService);
  private destroyRef = inject(DestroyRef);

  form = new FormGroup({
    idAutor: new FormControl<string | null>({value: null, disabled: true}),
    nombre: new FormControl('', {
      validators: [Validators.required, Validators.minLength(2)],
    }),
    apellido: new FormControl('', {
      validators: [Validators.required, Validators.minLength(2)],
    }),
    paisOrigen: new FormControl('', {
      validators: [Validators.required, Validators.minLength(4)],
    }),
    biografia: new FormControl('', {
      validators: [Validators.required],
    }),
    fechaRegistro: new FormControl<string | null>({value: null, disabled: true}),
  });

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['selectedAuthor']){
      const author = changes['selectedAuthor'].currentValue;
      if(author){
        this.form.patchValue(author);
      }else{
        this.form.reset()
      }
    }
  }
  onSubmit(){
    if(this.formIsInvalid()){
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.getRawValue();

    const author: Author = {
    idAutor: formValue.idAutor ?? null,
    nombre: formValue.nombre ?? '',
    apellido: formValue.apellido ?? '',
    paisOrigen: formValue.paisOrigen ?? '',
    biografia: formValue.biografia ?? '',
    fechaRegistro: formValue.fechaRegistro ?? null
  }

    if(author.idAutor){
      const subscription = this.authorService.updateAuthors(author).subscribe({
        next: () => {
            this.messageService.add({
            severity: 'success',
            summary: 'Actualizado',
            detail: 'El autor se ha actualizado correctamente',
          });
          this.closedDialog();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Ha ocurrido un error al actualizar el autor',
          });
        }
      });
      this.destroyRef.onDestroy(() => subscription.unsubscribe());
    } else {
      const subscription = this.authorService.createAuthors(author).subscribe({
        next: () => {
            this.messageService.add({
            severity: 'success',
            summary: 'Guardado',
            detail: 'El autor se ha guardado correctamente',
          });
          this.closedDialog();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Ha ocurrido un error al guardar el autor',
          });
        }
      });
      this.destroyRef.onDestroy(() => subscription.unsubscribe());
    }
  }

  formIsInvalid() {
    return this.form.dirty && this.form.touched && this.form.invalid;
  }

  closedDialog(){
    this.form.reset();
    this.onClose.emit();
  }
} 
