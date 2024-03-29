import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AmazingTimePickerModule } from 'amazing-time-picker';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTooltipModule, MatRadioModule, MatProgressSpinnerModule, MatToolbarModule, MatIconModule, MatSidenavModule, MatListModule, MatButtonModule, MatGridListModule, MatMenuModule, MatCardModule, MatDialogModule, MatInputModule, MatSelectModule, MatSnackBarModule, MatTabsModule, MatSlideToggleModule, MatDatepickerModule, MatNativeDateModule, MatCheckboxModule, MatPaginatorModule, MatSortModule, MatTableModule } from  '@angular/material';
import { PosComponent, NotifComponent } from './pages/pos/pos.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { POSDialogComponent } from './pages/pos/pos.dialog.component';

import { ProductsService } from './services/products.services';
import { ProductFilterPipe } from './shared/product-filter.pipe';

import { TransactionService } from './services/transactions.services';
import { FixedRateService } from './services/fixedrates.services';
import { SubscriptionRateService } from './services/subscriptionrates.services';
import { VehicleService } from './services/vehicles.services';
import { UserService } from './services/users.services';
import { RoleService } from './services/roles.services';
import { CustomerTypeService } from './services/customer-types.services';
import { SubscriptionService } from './services/subscriptions.services';
import { CreditService } from './services/credits.services';
import { DashboardService } from './services/dashboard.services';

import { ChartsModule } from 'ng2-charts';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

import { NgxPaginationModule } from 'ngx-pagination';
import { LoginComponent } from './login/login.component';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './core/authentication/token.interceptor';
import { CoreModule } from './core';
import { MenuItems } from './shared/menu';
import { NavService } from './services/nav.services';

import { SidebarLeftComponent } from './templates/sidebar-left/sidebar-left.component';
import { SidebarRightComponent } from './templates/sidebar-right/sidebar-right.component';
import { FixedRateComponent } from './pages/applications/fixed-rate/fixed-rate.component';
import { CustomersComponent } from './pages/applications/customers/customers.component';
import { VehiclesComponent } from './pages/applications/vehicles/vehicles.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { CustomerSubscriptionDialogComponent } from './pages/applications/customers/customer.subscription.component';
import { UsersComponent } from './pages/applications/users/users.component';
import { ReportsComponent } from './pages/reports/reports.component';
import { AccountComponent } from './pages/account/account.component';
import { SubcriptionRateComponent } from './pages/applications/subcription-rate/subcription-rate.component';
import { LoadCreditComponent } from './pages/load-credit/load-credit.component';
import { CreditDialogComponent } from './pages/load-credit/credit-dialog.component';

const config: SocketIoConfig = { url: 'http://localhost:8988', options: {} };

@NgModule({
  declarations: [
    AppComponent,
    PosComponent,
    POSDialogComponent,
    ProductFilterPipe,
    NotificationsComponent,
    NotifComponent,
    CustomersComponent,
    LoginComponent,
    SidebarLeftComponent,
    SidebarRightComponent,
    FixedRateComponent,
    VehiclesComponent,
    DashboardComponent,
    CustomerSubscriptionDialogComponent,
    UsersComponent,
    ReportsComponent,
    AccountComponent,
    SubcriptionRateComponent,
    LoadCreditComponent,
    CreditDialogComponent
  ],
  imports: [
    ChartsModule,
    AmazingTimePickerModule,
    SocketIoModule.forRoot(config),
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    MatGridListModule,
    MatIconModule,
    MatMenuModule,
    MatCardModule,
    MatDialogModule,
    FormsModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    MatTabsModule,
    MatSlideToggleModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    CoreModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatTooltipModule
  ],
  providers: [
    DashboardService,
    ProductsService,
    CreditService,
    VehicleService,
    UserService,
    RoleService,
    FixedRateService,
    SubscriptionRateService,
    TransactionService,
    CustomerTypeService,
    SubscriptionService,
    NavService,
    MenuItems,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [POSDialogComponent, NotifComponent, CustomerSubscriptionDialogComponent, CreditDialogComponent]
})
export class AppModule { }
