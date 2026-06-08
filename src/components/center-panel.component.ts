import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-center-panel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="panel">
      <h3>Stredny panel</h3>

      @if (userService.currentDetailStartTime() && userService.selectedUser(); as user) {
        <div class="user-details">
          <p><strong>Meno:</strong> {{ user.firstName }}</p>
          <p><strong>Priezvisko:</strong> {{ user.lastName }}</p>
          <p><strong>Username:</strong> {{ user.username }}</p>
          <p><strong>Datum narodenia:</strong> {{ user.birthDate }}</p>
          <p>
            <strong>Obrazok:</strong>
            <img [src]="user.image" alt="User" width="60" height="60" />
          </p>
          <p><strong>Farba oci:</strong> {{ user.eyeColor }}</p>
          <p><strong>Univerzita:</strong> {{ user.university }}</p>
          <p><strong>MAC adresa:</strong> {{ user.macAddress }}</p>
          <p><strong>IP:</strong> {{ user.ip }}</p>
          <p><strong>Mesto:</strong> {{ user.address.city }}</p>

          @if (userService.additionalUserData(); as data) {
            <p>
              <strong>Testovacie pohlavie:</strong>
              {{ data.gender }} ({{ (data.probability * 100) | number:'1.0-1' }}%)
            </p>
            <p><strong>Domovsky stat:</strong> {{ data.state }}, {{ data.country }}</p>
          }

          <button (click)="userService.endDetailViewing()">Zavriet detail</button>
        </div>
      } @else if (userService.selectedUser()) {
        <p>Kliknite na "Zobraz detail" pre nacitanie informacii.</p>
      } @else {
        <p>Vyberte pouzivatela z laveho panelu.</p>
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

    img {
      display: inline-block;
      vertical-align: middle;
      margin-left: 8px;
      border-radius: 4px;
      object-fit: cover;
    }

    button {
      margin-top: 8px;
      padding: 6px 12px;
      border: none;
      border-radius: 4px;
      background: #1f6feb;
      color: #fff;
      cursor: pointer;
    }
  `]
})
export class CenterPanelComponent {
  constructor(public userService: UserService) {}
}
