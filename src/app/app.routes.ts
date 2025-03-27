import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HeroComponent } from './pages/hero/hero.component';
import { RequestFormComponent } from './pages/request-form/request-form.component';
import { UpdateFormComponent } from './pages/update-form/update-form.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { RequestSummaryComponent } from './pages/request-summary/request-summary.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { 
    path: '', 
    component: HeroComponent 
  },
  { 
    path: 'login', 
    component: LoginComponent 
  },
  { 
    path: 'request', 
    component: RequestFormComponent, 
    canActivate: [AuthGuard]
  },
  { 
    path: 'update', 
    component: UpdateFormComponent, 
    canActivate: [AuthGuard],
    data: { role: ['MANAGER', 'ADMIN'] }
  },
  { 
    path: 'dashboard', 
    component: DashboardComponent, 
    canActivate: [AuthGuard],
    data: { role: ['MANAGER', 'ADMIN'] }
  },
  { 
    path: 'request-summary', 
    component: RequestSummaryComponent, 
    canActivate: [AuthGuard]
  }
];