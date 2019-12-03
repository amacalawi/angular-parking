import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { CustomersComponent } from './applications/customers/customers.component';
import { PosComponent } from './pos/pos.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { LoginComponent } from './login/login.component';
import { AuthenticationGuard } from './core';

const routes: Routes = [
  { path: 'dashboard', component: HomepageComponent, canActivate: [AuthenticationGuard] },
  { path: 'applications/customers', component: CustomersComponent, canActivate: [AuthenticationGuard] },
  { path: 'pos', component: PosComponent, canActivate: [AuthenticationGuard] },
  { path: 'notifications', component: NotificationsComponent },
  { path: 'login', component: LoginComponent },
  { path: '',   redirectTo: '/dashboard', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(
    routes,
    { enableTracing: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
