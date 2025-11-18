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
import { InputTextarea } from 'primeng/inputtextarea';
@Component({
  selector: 'app-author-form',

  imports: [
    ReactiveFormsModule,
    ButtonModule,
    ToastModule,
    RouterModule,
    DialogModule,
    InputTextModule,
    InputTextarea
  ],
  templateUrl: './author-form.component.html',
  styleUrl: './author-form.component.css',
})
export class AuthorFormComponent implements OnChanges {
  @Input() visible = false;
  @Input () selectedAuthor: Author | null = null; 
  @Output() onClosed = new EventEmitter<void>();
  
  private authorService = inject(AuthorService);
  private messageService = inject(MessageService);
  private destroyRef = inject(DestroyRef);

  form = new FormGroup({
    idAutor: new FormControl<string | null>({value: null, disabled: true}),
    nombreCompleto: new FormControl('', {
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
      nombreCompleto: formValue.nombreCompleto ?? '',
      paisOrigen: formValue.paisOrigen ?? '',
      biografia: formValue.biografia ?? '',
      fechaRegistro: formValue.fechaRegistro ?? null
    }

    if(author.idAutor){
      this.updateAuthor(author);
    } else {
      this.createAuthor(author);
    }
  }

  updateAuthor(author: Author){
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
            detail: 'Ha ocurrido un error al actualizar el autor, por favor intentelo de nuevo',
          });
        }
      });
      this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  createAuthor(author: Author){
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
            detail: 'Ha ocurrido un error al guardar el autor, por favor intentelo de nuevo',
          });
        }
      });
      this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }
  

  formIsInvalid() {
    return this.form.dirty && this.form.touched && this.form.invalid;
  }

  closedDialog(){
    this.form.reset();
    this.onClosed.emit();
  }
} 
