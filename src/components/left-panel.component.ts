import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-left-panel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="panel">
      <h3>Lavy panel</h3>

      <div class="user-list">
        @for (user of userService.filteredUsers(); track user.id) {
          <div class="user-item" (click)="selectUser(user)">
            <div><strong>{{ user.firstName }} {{ user.lastName }}</strong></div>
            <div>{{ user.email }}</div>
          </div>
        }
      </div>

      @if (userService.showDetailButton() && userService.selectedUser(); as selected) {
        <div class="selected-user">
          <h4>{{ selected.firstName }} {{ selected.lastName }}</h4>
          <button (click)="userService.showUserDetail()">Zobraz detail</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .panel {
      border: 2px solid black;
      padding: 10px;
      height: 500px;
      overflow-y: auto;
    }

    .user-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .user-item {
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      cursor: pointer;
      background: #fff;
    }

    .user-item:hover {
      background: #f5f5f5;
    }

    .selected-user {
      margin-top: 14px;
      padding: 10px;
      border-top: 1px solid #ddd;
    }

    button {
      padding: 6px 12px;
      background: #28a745;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
  `]
})
export class LeftPanelComponent {
  constructor(public userService: UserService) {}

  selectUser(user: User) {
    this.userService.selectUser(user);
  }
}
