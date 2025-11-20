import { Component, DestroyRef, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { BookService } from '../book.service';
import { AuthorService } from '../../author-list/author.service';
import { GenreService } from '../../genre-list/genre.service';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { Book } from '../book.model';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { Select } from 'primeng/select';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Author } from '../../author-list/author.model';
import { Genre } from '../../genre-list/genre.model';
import { EditorialService } from '../../editorial-list/editorial.service';
import { Editorial } from '../../editorial-list/editorial.model';

function verifyReleaseYear(control: AbstractControl){
  const currentYear = new Date().getFullYear();
  if(!control.value){
    return null;
  }

  if(control.value > currentYear){
    return { invalidYear: true }
  }

  return null;
}
@Component({
  selector: 'app-book-form',
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    ToastModule,
    RouterModule,
    DialogModule,
    InputTextModule,
    MultiSelectModule,
    Select
  ],
  templateUrl: './book-form.component.html',
  styleUrl: './book-form.component.css'
})
export class BookFormComponent implements OnChanges, OnInit{
  @Input() visible = false;
  @Input() selectedBook: Book | null = null;
  @Output() onClosed = new EventEmitter<void>();

  private bookService = inject(BookService);
  private authorService = inject(AuthorService);
  private genreService = inject(GenreService);
  private editorialService = inject(EditorialService);
  private messageService = inject(MessageService);
  private destroyRef = inject(DestroyRef);

  authors: Author[] = [];
  genres: Genre[] = [];
  editorials: Editorial[] = [];

  form = new FormGroup({
    idLibro: new FormControl<string | null> ({value: null, disabled: true}),
    titulo: new FormControl('', {
      validators: [Validators.required],
    }),
    isbn: new FormControl('', {
      validators: [Validators.required, Validators.minLength(13)],
    }),
    editorial: new FormControl<string | null>(null, Validators.required),
    anioPublicacion: new FormControl<number | null>(null, {
      validators: [Validators.required, verifyReleaseYear]
    }),
    idioma: new FormControl('', {
      validators: [Validators.required],
    }),
    descripcion: new FormControl('', {
      validators: [Validators.required],
    }),
    tipoMaterial: new FormControl('', {
      validators: [Validators.required],
    }),
    fechaRegistro: new FormControl<string | null> ({value: null, disabled: true}),
    numPaginas: new FormControl<number | null>(null, {
      validators: [Validators.required],
    }),
    autores: new FormControl<string[]>([], {
      validators: [Validators.required],
    }),
    generos: new FormControl<string[]>([], {
      validators: [Validators.required],
    }),
  });

  ngOnInit(): void {
    this.getAuthors();
    this.getGenres();
    this.getEditorials();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['selectedBook']){
      const book = changes['selectedBook'].currentValue; 
      if(book){
        this.form.patchValue({
          ...book,
          editorial: book.editorial?.idEditorial ?? null,
          autores: book.autores?.map((a: any) => a.idAutor) ?? [],
          generos: book.generos?.map((g: any) => g.idGenero) ?? [],
        });
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
    

    const editorialSeleccionada =
      this.editorials.find((e) => e.idEditorial === formValue.editorial) ?? null;
    const autoresSeleccionados: Author[] = 
      this.authors.filter((a) => formValue.autores?.includes((a as any).idAutor))
    const generosSeleccionados: Genre[] = 
      this.genres.filter(g => formValue.generos?.includes((g as any).idGenero));

      
    const book: Book = {
      idLibro: formValue.idLibro ?? null,
      titulo: formValue.titulo ?? '',
      isbn: formValue.isbn ?? '',
      editorial: editorialSeleccionada,
      anioPublicacion: formValue.anioPublicacion ?? null,
      idioma: formValue.idioma ?? '',
      descripcion: formValue.descripcion ?? '',
      tipoMaterial: formValue.tipoMaterial ?? '',
      fechaRegistro: formValue.fechaRegistro ?? null,
      numPaginas: formValue.numPaginas ?? null, 
      autores: autoresSeleccionados,
      generos: generosSeleccionados,
    }

    if(book.idLibro){
      this.updateBook(book);
    } else {
      this.createBook(book);
    } 
  }

  updateBook(book: Book){
    const subscription = this.bookService.updateBooks(book).subscribe({
        next: () => {
            this.messageService.add({
            severity: 'success',
            summary: 'Actualizado',
            detail: 'Libro se ha actualizado correctamente',
          });
          this.closedDialog();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Ha ocurrido un error al actualizar el Libro, por favor intentelo de nuevo',
          });
        }
      })
      this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  createBook(book: Book){
    const subscription = this.bookService.createBooks(book).subscribe({
        next: () => {
            this.messageService.add({
            severity: 'success',
            summary: 'Guardado',
            detail: 'El libro se ha guardado correctamente',
          });
          this.closedDialog();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Ha ocurrido un error al guardar el libro, por favor intentelo de nuevo',
          });
        }
      });
      this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  getAuthors(){
    const subscription = this.authorService.getAuthors().subscribe({
      next: (autData) => {
        this.authors = autData;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los autores',
        });
      }
    });
    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  getGenres(){
    const subscription = this.genreService.getGenres().subscribe({
      next: (genData) => {
        this.genres = genData;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los generos',
        });
      }
    });
    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  getEditorials(){
    const subscription = this.editorialService.getEditorials().subscribe({
      next: (ediData) => {
        this.editorials = ediData;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar las editoriales',
        });
      }
    });
    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  formIsInvalid(){
    return this.form.invalid&&this.form.dirty&&this.form.touched;
  }

  closedDialog(){
    this.form.reset();
    this.onClosed.emit();
  }
}
