import { ChangeDetectionStrategy ,Component, ChangeDetectorRef, ApplicationRef, NgZone, signal, OnInit, inject } from '@angular/core';
import { ChatService } from '../../services/chat';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-chat',
  standalone: true,
  templateUrl: './chat.html',
  imports: [FormsModule, NgFor, NgIf, CommonModule],
  styleUrls: ['./chat.css'],
  changeDetection: ChangeDetectionStrategy.OnPush // ChangeDetectionStrategy.OnPush
})
export class ChatComponent implements OnInit {
  messages: { from: 'user' | 'ai', text: string }[] = [];
  prompt = '';
  session_id = crypto.randomUUID();
  loading = false;
  signalMessages = signal(this.messages);
  private ngZone = inject(NgZone);
  constructor(private chat: ChatService, private cdr: ChangeDetectorRef, private app: ApplicationRef) {}
  
  ngOnInit() {
  // this.ngZone.runOutsideAngular(() => setInterval(pollForUpdates), 500);
  }
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
    this.signalMessages.update(() => this.messages);
  });
},
error: err => {
  this.ngZone.run(() => {
    this.messages = [...this.messages, { from: 'ai', text: 'Error en el servidor.' }];
    this.loading = false;
    console.log('error messages:', this.messages);
    this.signalMessages.update(() => this.messages);

    this.cdr.detectChanges();
  });
  console.error(err);
}
    });

    this.prompt = '';
  }
}
