#!/usr/bin/env bash
set -e

# 1) Create Register component
mkdir -p src/app/components/register

cat > src/app/components/register/register.component.ts << 'EOL'
import { Component } from '@angular/core';
import { Router }    from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  username = '';
  password = '';
  confirmPassword = '';
  error = '';
  success = '';

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit() {
    if (this.password !== this.confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }
    this.auth.register(this.username, this.password).subscribe({
      next: () => { this.success = 'Registered! Redirecting to login.'; this.router.navigate(['/login']); },
      error: () => this.error = 'Registration failed'
    });
  }
}
EOL

cat > src/app/components/register/register.component.html << 'EOL'
<form (ngSubmit)="onSubmit()">
  <div>
    <label for="username">Username</label>
    <input id="username" [(ngModel)]="username" name="username" required />
  </div>
  <div>
    <label for="password">Password</label>
    <input id="password" type="password" [(ngModel)]="password" name="password" required />
  </div>
  <div>
    <label for="confirm">Confirm Password</label>
    <input id="confirm" type="password" [(ngModel)]="confirmPassword" name="confirmPassword" required />
  </div>
  <button type="submit">Register</button>
</form>
<div *ngIf="error" class="error">{{ error }}</div>
EOL

cat > src/app/components/register/register.component.scss << 'EOL'
.error { color: red; }
EOL

# 2) Update routing
cat > src/app/app.routes.ts << 'EOL'
import { Routes } from '@angular/router';
import { LoginComponent }    from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { StickerChartComponent } from './components/sticker-chart/sticker-chart.component';
import { AuthGuard }         from './guards/auth.guard';

export const appRoutes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login',    component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'chart',    component: StickerChartComponent, canActivate: [AuthGuard] },
];
EOL

# 3) Update AppComponent
cat > src/app/app.component.ts << 'EOL'
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: \`
    <nav>
      <a routerLink="/login">Login</a> |
      <a routerLink="/register">Register</a> |
      <a routerLink="/chart">Chart</a>
    </nav>
    <router-outlet></router-outlet>
  \`,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {}
EOL

cat > src/app/app.component.scss << 'EOL'
nav { background: #f5f5f5; padding: 1rem; }
nav a { margin-right: 1rem; text-decoration: none; }
EOL

# 4) Create component styles
cat > src/app/components/login/login.component.scss << 'EOL'
form { max-width: 400px; margin: auto; padding: 1rem; border: 1px solid #ccc; }
label { display: block; margin-bottom: 0.5rem; }
input { width: 100%; padding: 0.5rem; margin-top: 0.25rem; }
button { margin-top: 1rem; padding: 0.5rem 1rem; }
.error { color: red; margin-top: 1rem; }
EOL

cat > src/app/components/sticker-chart/sticker-chart.component.scss << 'EOL'
table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
th, td { border: 1px solid #ccc; padding: 0.5rem; text-align: center; }
button { background: none; border: none; font-size: 1.5rem; cursor: pointer; }
button:hover { color: gold; }
EOL

echo "Register page and styles added!"
