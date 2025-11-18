import { Component, DestroyRef, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { EditorialService } from '../editorial.service';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { Editorial } from '../editorial.model';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-editorial-form',
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    ToastModule,
    RouterModule,
    DialogModule,
    InputTextModule,
],
  templateUrl: './editorial-form.component.html',
  styleUrl: './editorial-form.component.css'
})
export class EditorialFormComponent implements OnChanges{
  @Input() visible = false;
  @Input() selectedEditorial: Editorial | null = null;
  @Output() onClosed = new EventEmitter<void>();

  private editorialService = inject(EditorialService);
  private messageService = inject(MessageService);
  private destroyRef = inject(DestroyRef);

  form = new FormGroup({
    idEditorial: new FormControl<string | null>({value: null, disabled: true}),
    nombre: new FormControl('', {
      validators: [Validators.required, Validators.minLength(2)],
    }),
    paisOrigen: new FormControl('', {
      validators: [Validators.required],
    }),
    sitioWeb: new FormControl('', {
      validators: [Validators.required],
    }),
    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
    }),
    telefono: new FormControl('',{
      validators: [Validators.required, Validators.minLength(9), Validators.maxLength(20)]
    }),
    fechaRegistro: new FormControl<string | null>({value: null, disabled: true}),
  });

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['selectedEditorial']){
      const editorial = changes['selectedEditorial'].currentValue;
      if(editorial){
        this.form.patchValue(editorial);
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

    const editorial: Editorial = {
      idEditorial: formValue.idEditorial ?? null,
      nombre: formValue.nombre ?? '',
      paisOrigen: formValue.paisOrigen ?? '',
      sitioWeb: formValue.sitioWeb ?? '',
      email: formValue.email ?? '',
      telefono: formValue.telefono ?? '',
      fechaRegistro: formValue.fechaRegistro ?? null
    }

    if(editorial.idEditorial){
      this.updateEditorial(editorial)
    } else {
      this.createEditorial(editorial);
    }
  }

  updateEditorial(editorial: Editorial){
    const subscription = this.editorialService.updateEditorials(editorial).subscribe({
        next: () => {
            this.messageService.add({
            severity: 'success',
            summary: 'Actualizado',
            detail: 'La editorial se ha actualizado correctamente',
          });
          this.closedDialog();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Ha ocurrido un error al actualizar la editorial, por favor intentelo de nuevo',
          });
        }
      });
      this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  createEditorial(editorial: Editorial){
    const subscription = this.editorialService.createEditorials(editorial).subscribe({
        next: () => {
            this.messageService.add({
            severity: 'success',
            summary: 'Guardado',
            detail: 'La editorial se ha guardado correctamente',
          });
          this.closedDialog();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Ha ocurrido un error al guardar la editorial, por favor intentelo de nuevo',
          });
        }
      });
      this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  formIsInvalid(){
    return this.form.dirty && this.form.touched && this.form.invalid;
  }

  closedDialog(){
    this.form.reset();
    this.onClosed.emit();
  }
}
