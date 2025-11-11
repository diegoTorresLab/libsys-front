import { Routes } from '@angular/router';
import { NothingSelectedComponent } from './nothing-selected/nothing-selected.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { AuthorListComponent } from './author-list/author-list.component';
import { authorsRoutes } from './author-list/authors.routes';
import { EditorialListComponent } from './editorial-list/editorial-list.component';
import { GenreListComponent } from './genre-list/genre-list.component';
import { genresRoutes } from './genre-list/genres.routes';
import { BookListComponent } from './book-list/book-list.component';
import { booksRoutes } from './book-list/books.routes';
import { editorialRoutes } from './editorial-list/editorial.routes';
import { MainLayoutComponent } from './main-layout/main-layout.component';

export const routes: Routes = [
        {
        path: '',
        component: MainLayoutComponent,
        children:[
            {
                path: '',
                component: NothingSelectedComponent,
                title: 'LibSys - Inicio',
                pathMatch: 'full'
            },
            {
                path: 'autor',
                component: AuthorListComponent,
                title: 'Libsys - Autores',
                children: authorsRoutes
            },
            {
                path: 'editorial',
                component: EditorialListComponent,
                title: 'Libsys - Editoriales',
                children: editorialRoutes
            },
            {
                path: 'genero',
                component: GenreListComponent,
                title: 'Libsys - Géneros',
                children: genresRoutes
            },
            {
                path: 'libro',
                component: BookListComponent,
                title: 'Libsys - Libros',
                children: booksRoutes
            },
        ],
    },
    {
        path: '**',
        component: NotFoundComponent,
        title: 'LibSys - Página no encontrada'
    }
];
