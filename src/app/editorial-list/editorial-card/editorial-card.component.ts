import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Editorial } from '../editorial.model';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { NormalizeUrlPipe } from './normalize-url.pipe';

@Component({
  selector: 'app-editorial-card',
  imports: [
    ButtonModule,
    DialogModule,
    RouterModule,
    NormalizeUrlPipe
  ],
  templateUrl: './editorial-card.component.html',
  styleUrl: './editorial-card.component.css'
})
export class EditorialCardComponent {
  @Input() visible = false;
  @Input() selectedEditorial: Editorial | null = null;
  @Output() onClosed = new EventEmitter<void>();
  
  closedDialog(){
    this.onClosed.emit();
  }
}
