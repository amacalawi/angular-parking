import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomepageComponent } from './homepage/homepage.component';

import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule, MatIconModule, MatSidenavModule, MatListModule, MatButtonModule, MatGridListModule, MatMenuModule, MatCardModule, MatDialogModule, MatInputModule, MatSelectModule, MatSnackBarModule, MatTabsModule, MatSlideToggleModule, MatDatepickerModule, MatNativeDateModule } from  '@angular/material';
import { PosComponent, NotifComponent } from './pos/pos.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { POSDialogComponent } from './pos/pos.dialog.component';

import { ProductsService } from './services/products.services';
import { ProductFilterPipe } from './shared/product-filter.pipe';

import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { CustomersComponent } from './applications/customers/customers.component';

const config: SocketIoConfig = { url: 'http://localhost:8988', options: {} };

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    PosComponent,
    POSDialogComponent,
    ProductFilterPipe,
    NotificationsComponent,
    NotifComponent,
    CustomersComponent
  ],
  imports: [
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
    MatNativeDateModule
  ],
  providers: [
    ProductsService,
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [POSDialogComponent, NotifComponent]
})
export class AppModule { }
