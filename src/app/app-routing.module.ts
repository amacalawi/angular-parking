import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { PosComponent } from './pos/pos.component';
import { NotificationsComponent } from './notifications/notifications.component';

const routes: Routes = [
  { path: 'dashboard', component: HomepageComponent },
  { path: 'pos', component: PosComponent },
  { path: 'notifications', component: NotificationsComponent },
  { path: '',   redirectTo: '/dashboard', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(
    routes,
    { enableTracing: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
