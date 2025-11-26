import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ChatRequest {
  session_id: string;
  prompt: string;
}

export interface ChatResponse {
  session_id: string;
  prompt: string;
  response: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private url = 'https://ia.apexcode.com.ar/chat'; // TU GPT-OSS

  constructor(private http: HttpClient) {}

  sendMessage(prompt: string, session_id: string): Observable<ChatResponse> {
    return this.http.post<ChatResponse>(this.url, {
      prompt,
      session_id
    });
  }
}
