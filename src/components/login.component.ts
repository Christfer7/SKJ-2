import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <h2>Prihlasenie</h2>

      <form (ngSubmit)="onLogin()">
        <div>
          <label for="firstName">Meno:</label>
          <input id="firstName" type="text" [(ngModel)]="firstName" name="firstName" required />
        </div>

        <div>
          <label for="lastName">Priezvisko:</label>
          <input id="lastName" type="text" [(ngModel)]="lastName" name="lastName" required />
        </div>

        <button type="submit">Prihlasit</button>
      </form>

      @if (errorMessage()) {
        <p class="error">{{ errorMessage() }}</p>
      }
    </div>
  `,
  styles: [`
    .login-container {
      max-width: 340px;
      margin: 50px auto;
      padding: 20px;
      border: 1px solid #ccc;
      border-radius: 6px;
      background: #fff;
    }

    label {
      display: block;
      margin-top: 10px;
    }

    input {
      width: 100%;
      padding: 8px;
      margin: 6px 0;
      border: 1px solid #ccc;
      border-radius: 4px;
      box-sizing: border-box;
    }

    button {
      width: 100%;
      margin-top: 12px;
      padding: 10px;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    .error {
      color: #c62828;
      margin-top: 12px;
    }
  `]
})
export class LoginComponent {
  firstName = '';
  lastName = '';
  errorMessage = signal('');

  constructor(private userService: UserService, private router: Router) {}

  async ngOnInit() {
    await this.userService.loadUsers();
  }

  onLogin() {
    if (this.userService.login(this.firstName, this.lastName)) {
      this.errorMessage.set('');
      this.router.navigate(['/dashboard']);
      return;
    }

    this.errorMessage.set('Neplatne prihlasovacie udaje');
  }
}
