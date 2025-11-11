import { Routes } from "@angular/router";
import { AuthorFormComponent } from "./author-form/author-form.component";

export const authorsRoutes: Routes = [
    {
        path: 'autor-form',
        component: AuthorFormComponent,
        title: 'Crear Autor'
    },
    {
        path: 'autor-form/:id',
        component: AuthorFormComponent,
        title: 'Editar Autor'
    },
];