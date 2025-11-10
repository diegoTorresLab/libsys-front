import { Routes } from '@angular/router';
import { NothingSelectedComponent } from './nothing-selected/nothing-selected.component';
import { NotFoundComponent } from './not-found/not-found.component';

export const routes: Routes = [
    {
        path: '',
        component: NothingSelectedComponent,
        title: 'LibSys - Inicio'
    },
    {
        path: '**',
        component: NotFoundComponent
    }
];
