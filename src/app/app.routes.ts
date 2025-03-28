import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HeroComponent } from './pages/hero/hero.component';
import { RequestFormComponent } from './pages/request-form/request-form.component';
import { UpdateFormComponent } from './pages/update-form/update-form.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { RequestSummaryComponent } from './pages/request-summary/request-summary.component';
import { AuthGuard } from './guards/auth.guard';
import { ItemListComponent } from './pages/item-list/item-list.component';
import { ItemAddComponent } from './pages/item-add/item-add.component';
import { ItemUpdateComponent } from './pages/item-update/item-update.component';
import { ItemDetailComponent } from './shared/components/item-detail/item-detail.component';

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
  },
  {
    path: 'items',
    component: ItemListComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'item-detail/:id', 
    component: ItemDetailComponent, 
    canActivate: [AuthGuard] 
  },
  {
    path: 'add-item',
    component: ItemAddComponent,
    canActivate: [AuthGuard],
    data: { role: ['MANAGER', 'ADMIN'] }
  },
  {
    path: 'update-item/:id',
    component: ItemUpdateComponent,
    canActivate: [AuthGuard],
    data: { role: ['MANAGER', 'ADMIN'] }
  },
  // { 
  //   path: 'item-detail/:id', 
  //   component: ItemDetailComponent, 
  //   canActivate: [AuthGuard] 
  // },
];