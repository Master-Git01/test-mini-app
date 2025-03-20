import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AsyncPipe, CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
// Extend the Window interface to include Telegram
declare global {
  interface Window {
    Telegram: {
      WebApp: {
        initDataUnsafe: {
          user?: {
            username?: string;
            first_name?: string;
          };
        };
        sendData: (data: string) => void;
      };
    };
  }
}

@Component({
  selector: 'app-root',
  imports: [FormsModule, CommonModule, AsyncPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  userName$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  randomNumber: number | null = null;

  ngOnInit(): void {
    // Если Telegram Web Apps API доступен, получаем начальные данные пользователя
    if (window.Telegram && window.Telegram.WebApp) {
      const initDataUnsafe = window.Telegram.WebApp.initDataUnsafe;
      if (initDataUnsafe && initDataUnsafe.user) {
        const initialName =
          initDataUnsafe.user.username ||
          initDataUnsafe.user.first_name ||
          'sdaf';
        this.userName$.next(initialName);
      }
    }
  }

  // Функция для генерации случайного числа от 1 до 100
  onGetNumber(): void {
    this.randomNumber = Math.floor(Math.random() * 100) + 1;
  }

  // Функция для отправки данных боту через Telegram API
  onSendToBot(): void {
    if (window.Telegram?.WebApp) {
      const dataToSend = {
        userName: this.userName$.value,
        result: this.randomNumber,
      };

      // Отправка данных через Telegram API (если требуется)
      window.Telegram.WebApp.sendData(JSON.stringify(dataToSend));

      // Альтернативный способ: отправка данных на backend через HTTP-запрос
      fetch('https://grammy-ts-first-bot.onrender.com/receive', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      })
        .then((response) => response.json())
        .then((data) => console.log('Ответ от сервера:', data))
        .catch((error) => console.error('Ошибка при отправке данных:', error));
    }
  }
}
