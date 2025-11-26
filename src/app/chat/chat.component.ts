import { Component } from '@angular/core';
import { ChatService } from '../service/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
messages: { from: 'user' | 'ai', text: string }[] = [];
  prompt = '';
  session_id = crypto.randomUUID();
  loading = false;
  // signalMessages = signal(this.messages);
  // private ngZone = inject(NgZone);
  constructor(private chat: ChatService) {}
  
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
      next: (r:any) => {
    this.messages = [...this.messages, { from: 'ai', text: r.response }];
    this.loading = false;
    console.log('messages:', this.messages); // debug
    // this.signalMessages.update(() => this.messages);
  
},
error: (err:any) => {
  
    this.messages = [...this.messages, { from: 'ai', text: 'Error en el servidor.' }];
    this.loading = false;
    console.log('error messages:', this.messages);
    // this.signalMessages.update(() => this.messages);

    // this.cdr.detectChanges();
  console.error(err);
}
    });

    this.prompt = '';
  }
}
