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
