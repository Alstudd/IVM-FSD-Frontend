import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HeroComponent } from './pages/hero/hero.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AuthGuard } from './guards/auth.guard';
import { ItemListComponent } from './pages/item-list/item-list.component';
import { ItemAddComponent } from './pages/item-add/item-add.component';
import { ItemUpdateComponent } from './pages/item-update/item-update.component';
import { ItemDetailComponent } from './shared/components/item-detail/item-detail.component';
import { ItemRequestListComponent } from './pages/item-request-list/item-request-list.component';
import { ItemRequestAddComponent } from './pages/item-request-add/item-request-add.component';
import { ItemRequestUpdateComponent } from './pages/item-request-update/item-request-update.component';
import { UserListComponent } from './pages/user-list/user-list.component';
import { UserAddComponent } from './pages/user-add/user-add.component';
import { UserUpdateComponent } from './pages/user-update/user-update.component';

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
    path: 'dashboard', 
    component: DashboardComponent, 
    canActivate: [AuthGuard],
    data: { role: ['MANAGER', 'ADMIN'] }
  },
  {
    path: 'items',
    component: ItemListComponent,
    canActivate: [AuthGuard],
    data: { role: ['MANAGER', 'ADMIN'] }
  },
  {
    path: 'item-requests',
    component: ItemRequestListComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'item-detail/:id', 
    component: ItemDetailComponent, 
    canActivate: [AuthGuard],
    data: { role: ['MANAGER', 'ADMIN'] }
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
  {
    path: 'add-item-request',
    component: ItemRequestAddComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'update-item-request/:id',
    component: ItemRequestUpdateComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'users',
    component: UserListComponent,
    canActivate: [AuthGuard],
    data: { role: ['MANAGER', 'ADMIN'] }
  },
  {
    path: 'add-user',
    component: UserAddComponent,
    canActivate: [AuthGuard],
    data: { role: ['MANAGER', 'ADMIN'] }
  },
  {
    path: 'update-user/:id',
    component: UserUpdateComponent,
    canActivate: [AuthGuard],
    data: { role: ['MANAGER', 'ADMIN'] }
  },
];