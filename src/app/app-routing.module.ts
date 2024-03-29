import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PosComponent } from './pages/pos/pos.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { LoginComponent } from './login/login.component';
import { FixedRateComponent } from './pages/applications/fixed-rate/fixed-rate.component';
import { CustomersComponent } from './pages/applications/customers/customers.component';
import { VehiclesComponent } from './pages/applications/vehicles/vehicles.component';
import { UsersComponent } from './pages/applications/users/users.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ReportsComponent } from './pages/reports/reports.component';
import { AccountComponent } from './pages/account/account.component';
import { LoadCreditComponent } from './pages/load-credit/load-credit.component';
import { SubcriptionRateComponent } from './pages/applications/subcription-rate/subcription-rate.component';
import { AuthenticationGuard } from './core';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthenticationGuard] },
  { path: 'applications/customers', component: CustomersComponent, canActivate: [AuthenticationGuard] },
  { path: 'applications/fixed-rate', component: FixedRateComponent, canActivate: [AuthenticationGuard] },
  { path: 'applications/subscription-rate', component: SubcriptionRateComponent, canActivate: [AuthenticationGuard] },
  { path: 'applications/vehicles', component: VehiclesComponent, canActivate: [AuthenticationGuard] },
  { path: 'applications/users', component: UsersComponent, canActivate: [AuthenticationGuard] },
  { path: 'pos', component: PosComponent, canActivate: [AuthenticationGuard] },
  { path: 'reports', component: ReportsComponent, canActivate: [AuthenticationGuard] },
  { path: 'load-credit', component: LoadCreditComponent, canActivate: [AuthenticationGuard] },
  { path: 'account', component: AccountComponent, canActivate: [AuthenticationGuard] },
  { path: 'notifications', component: NotificationsComponent },
  { path: 'login', component: LoginComponent },
  { path: '',   redirectTo: '/dashboard', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(
    routes,
    { useHash: true, enableTracing: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
