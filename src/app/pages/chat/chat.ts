import { Component, ChangeDetectorRef, ApplicationRef, NgZone } from '@angular/core';
import { ChatService } from '../../services/chat';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-chat',
  standalone: true,
  templateUrl: './chat.html',
  imports: [FormsModule, NgFor, NgIf, CommonModule],
  styleUrls: ['./chat.css'],
})
export class ChatComponent {
  messages: { from: 'user' | 'ai', text: string }[] = [];
  prompt = '';
  session_id = crypto.randomUUID();
  loading = false;

  constructor(private chat: ChatService, private cdr: ChangeDetectorRef, private app: ApplicationRef, private ngZone: NgZone) {}

  send() {
    if (!this.prompt.trim()) return;

    const userMsg = this.prompt;

    // reasigna el array para que Angular note el cambio
    this.messages = [...this.messages, { from: 'user', text: userMsg }];

    this.loading = true;

    this.chat.sendMessage(userMsg, this.session_id).subscribe({
      next: r => {
  this.ngZone.run(() => {
    this.messages = [...this.messages, { from: 'ai', text: r.response }];
    this.loading = false;
    console.log('messages:', this.messages); // debug
    this.cdr.detectChanges(); // fuerza actualización
  });
},
error: err => {
  this.ngZone.run(() => {
    this.messages = [...this.messages, { from: 'ai', text: 'Error en el servidor.' }];
    this.loading = false;
    console.log('error messages:', this.messages);
    this.cdr.detectChanges();
  });
  console.error(err);
}
    });

    this.prompt = '';
  }
}
