import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, Routes, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from './services/user.service';
import { LoginComponent } from './components/login.component';
import { HeaderComponent } from './components/header.component';
import { LeftPanelComponent } from './components/left-panel.component';
import { CenterPanelComponent } from './components/center-panel.component';
import { RightPanelComponent } from './components/right-panel.component';
import { authGuard, loginGuard } from './guards/auth.guard';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    LeftPanelComponent,
    CenterPanelComponent,
    RightPanelComponent
  ],
  template: `
    <div class="app-container" (click)="userService.incrementClickCount()">
      <app-header></app-header>
      <div class="panels-container">
        <app-left-panel></app-left-panel>
        <app-center-panel></app-center-panel>
        <app-right-panel></app-right-panel>
      </div>
    </div>
  `,
  styles: [`
    .panels-container {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 10px;
    }
  `]
})
export class DashboardComponent {
  constructor(public userService: UserService) {}
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  template: `<router-outlet></router-outlet>`
})
export class App {}

const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [loginGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];

bootstrapApplication(App, {
  providers: [provideRouter(routes)]
});
