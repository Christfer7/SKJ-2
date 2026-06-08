import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="header">
      <input
        type="text"
        placeholder="Filter podla priezviska"
        [(ngModel)]="searchTerm"
        (input)="onSearchChange()"
        class="search-input"
      />

      <div class="user-info">
        @if (userService.loginData(); as loginData) {
          <span><strong>{{ loginData.firstName }} {{ loginData.lastName }}</strong></span>
          <span>Datum a cas prihlasenia: {{ loginData.loginTime }}</span>
          <span>Kliky: {{ loginData.clickCount }}</span>
        }
        <button (click)="logout()">Logout</button>
      </div>
    </div>
  `,
  styles: [`
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      padding: 10px;
      border: 2px solid black;
      background-color: #f8f9fa;
    }

    .search-input {
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
      width: 240px;
      max-width: 100%;
    }

    .user-info {
      display: flex;
      gap: 15px;
      align-items: center;
      flex-wrap: wrap;
      justify-content: flex-end;
    }

    button {
      padding: 8px 15px;
      background: #dc3545;
      color: white;
      border: none;
      cursor: pointer;
      border-radius: 4px;
    }

    button:hover {
      background: #c82333;
    }
  `]
})
export class HeaderComponent {
  searchTerm = '';

  constructor(public userService: UserService, private router: Router) {}

  onSearchChange() {
    this.userService.searchTerm.set(this.searchTerm);
  }

  logout() {
    this.userService.logout();
    this.router.navigate(['/login']);
  }
}
