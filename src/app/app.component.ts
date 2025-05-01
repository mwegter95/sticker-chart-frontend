// src/app/app.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav>
      <ng-container *ngIf="!auth.token">
        <a routerLink="/login">Login</a> |
        <a routerLink="/register">Register</a>
      </ng-container>
      <ng-container *ngIf="auth.token">
        <a (click)="logout()" style="cursor:pointer">Logout</a> |
        <a routerLink="/chart">Chart</a>
      </ng-container>
    </nav>
    <router-outlet></router-outlet>
  `,
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(public auth: AuthService, private router: Router) {}

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
