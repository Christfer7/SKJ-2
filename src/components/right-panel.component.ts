import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-right-panel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="panel">
      <h3>Pravy panel</h3>

      <div class="history">
        @for (detail of userService.userDetails(); track $index) {
          <div class="history-item">
            <strong>{{ detail.name }}</strong>
            <br />
            <small>{{ detail.startTime }} - {{ detail.endTime }}</small>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .panel {
      border: 2px solid black;
      padding: 10px;
      height: 500px;
      overflow-y: auto;
    }

    .history-item {
      padding: 10px;
      border-bottom: 1px solid #eee;
    }
  `]
})
export class RightPanelComponent {
  constructor(public userService: UserService) {}
}
