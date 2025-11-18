import { Component, DestroyRef, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { GenreService } from '../genre.service';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { Genre } from '../genre.model';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormControl, 
  FormGroup, 
  ReactiveFormsModule, 
  Validators } from '@angular/forms';


@Component({
  selector: 'app-genre-form',
  imports: [
    ReactiveFormsModule, 
    ButtonModule,
    ToastModule,
    RouterModule,
    DialogModule,
    InputTextModule
  ],
  templateUrl: './genre-form.component.html',
  styleUrl: './genre-form.component.css'
})
export class GenreFormComponent implements OnChanges{
  @Input() visible = false;
  @Input() selectedGenre: Genre | null = null;
  @Output() onClosed = new EventEmitter<void>();
  
  private genreService = inject(GenreService);
  private messageService = inject(MessageService);
  private destroyRef = inject(DestroyRef);

  form = new FormGroup({
    idGenero: new FormControl<string | null>({value: null, disabled: true}),
    nombre: new FormControl('', {
      validators: [Validators.required, Validators.minLength(5)],
    })
  })
  ngOnChanges(changes: SimpleChanges): void {
    if(changes['selectedGenre']){
      const genre = changes['selectedGenre'].currentValue;
      if(genre){
        this.form.patchValue(genre);
      }else{
        this.form.reset();
      }
    }
  }

  onSubmit(){
    if(this.formIsInvalid()){
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.getRawValue();

    const genre: Genre = {
      idGenero: formValue.idGenero ?? null,
      nombre: formValue.nombre ?? null,
    }

    if(genre.idGenero){
      this.updateGenre(genre);
    }else{
      this.createGenre(genre);
    }
  }

  updateGenre(genre: Genre){
    const subscription = this.genreService.updateGenres(genre).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Actualizado',
            detail: 'El genero se ha actualizado correctamente',
          });
          this.closedDialog();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Ha ocurrido un error al actualizar el genero, por favor intentelo de nuevo',
          });
        }
      });
      this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  createGenre(genre: Genre){
    const subscription = this.genreService.createGenres(genre).subscribe({
        next: () => {
            this.messageService.add({
            severity: 'success',
            summary: 'Guardado',
            detail: 'El genero se ha guardado correctamente',
          });
          this.closedDialog();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Ha ocurrido un error al guardar el genero, por favor intentelo de nuevo',
          });
        }
      });
      this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }
  
  formIsInvalid(){
    return this.form.dirty && this.form.touched && this.form.invalid
  }

  closedDialog(){
    this.form.reset();
    this.onClosed.emit();
  }
}
