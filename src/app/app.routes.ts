import { Routes } from '@angular/router';
import { NothingSelectedComponent } from './nothing-selected/nothing-selected.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { AuthorListComponent } from './author-list/author-list.component';
import { EditorialListComponent } from './editorial-list/editorial-list.component';
import { GenreListComponent } from './genre-list/genre-list.component';
import { BookListComponent } from './book-list/book-list.component';
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
            },
            {
                path: 'editorial',
                component: EditorialListComponent,
                title: 'Libsys - Editoriales',
            },
            {
                path: 'genero',
                component: GenreListComponent,
                title: 'Libsys - Géneros',
            },
            {
                path: 'libro',
                component: BookListComponent,
                title: 'Libsys - Libros',
            },
        ],
    },
    {
        path: '**',
        component: NotFoundComponent,
        title: 'LibSys - Página no encontrada'
    }
];
