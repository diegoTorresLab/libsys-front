import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Author } from '../author.model';
import { RouterModule } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-author-card',
  imports: [
    ButtonModule, 
    DialogModule, 
    RouterModule
  ],
  templateUrl: './author-card.component.html',
  styleUrl: './author-card.component.css',
})
export class AuthorCardComponent{
  @Input() visible = false;
  @Input() selectedAuthor: Author | null = null;
  @Output() onClosed = new EventEmitter<void>();

  closedDialog(){
    this.onClosed.emit();
  }
}
