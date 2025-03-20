import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
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
  imports: [FormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  userName: string = '';
  randomNumber: number | null = null;

  ngOnInit(): void {
    // Если Telegram Web Apps API доступен, получаем данные пользователя
    if (window.Telegram && window.Telegram.WebApp) {
      const initDataUnsafe = window.Telegram.WebApp.initDataUnsafe;
      if (initDataUnsafe && initDataUnsafe.user) {
        // Предпочтение отдаем username, если его нет, используем first_name
        this.userName =
          initDataUnsafe.user.username || initDataUnsafe.user.first_name || '';
      }
    }
  }

  // Функция для генерации случайного числа от 1 до 100
  onGetNumber(): void {
    this.randomNumber = Math.floor(Math.random() * 100) + 1;
  }

  // Функция для отправки данных боту через Telegram API
  onSendToBot(): void {
    if (window.Telegram && window.Telegram.WebApp) {
      const dataToSend = {
        userName: this.userName,
        result: this.randomNumber,
      };
      // Отправляем данные в виде строки JSON
      window.Telegram.WebApp.sendData(JSON.stringify(dataToSend));
    }
  }
}
