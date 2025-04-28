import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // <-- add
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true, // ensure standalone
  imports: [FormsModule], // <-- include FormsModule
  templateUrl: './login.component.html',
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit() {
    this.auth.login(this.username, this.password).subscribe({
      next: () => this.router.navigate(['/chart']),
      error: () => (this.error = 'Login failed'),
    });
  }
}
