import { Component } from '@angular/core';
import { ChatService } from '../../services/chat';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-chat',
  standalone: true,
  templateUrl: './chat.html',
  imports: [FormsModule, NgFor, NgIf],
  styleUrls: ['./chat.css'],
})
export class ChatComponent {

  messages: { from: 'user' | 'ai', text: string }[] = [];
  prompt = '';
  session_id = crypto.randomUUID();
  loading = false;

  constructor(private chat: ChatService) {}

  send() {
    if (!this.prompt.trim()) return;

    const userMsg = this.prompt;

    this.messages.push({ from: 'user', text: userMsg });

    this.loading = true;

    this.chat.sendMessage(userMsg, this.session_id).subscribe({
      next: r => {
        this.messages.push({ from: 'ai', text: r.response });
        this.loading = false;
      },
      error: err => {
        this.messages.push({ from: 'ai', text: 'Error en el servidor.' });
        this.loading = false;
        console.error(err);
      }
    });

    this.prompt = '';
  }
}
