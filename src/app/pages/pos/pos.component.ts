import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { POSDialogComponent } from './pos.dialog.component';
import { ProductsService } from '../../services/products.services';
import { TransactionService } from '../../services/transactions.services'
import { NavService } from '../../services/nav.services'
import { Product } from '../../shared/product';
import { Transaction } from '../../shared/transaction';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Socket } from 'ngx-socket-io';
import Swal from 'sweetalert2'
import 'rxjs/add/operator/map';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-pos',
  templateUrl: './pos.component.html',
  styleUrls: ['./pos.component.scss']
})
export class PosComponent implements OnInit, OnDestroy {

    pageTitle: string = 'POS';
    transactions: Transaction[];
    durationInSeconds = 5;

    constructor(
        public navService: NavService,
        private router: Router,
        private route: ActivatedRoute,
        private transactionService: TransactionService,
        private builder: FormBuilder,
        private _snackBar: MatSnackBar, 
        private socket: Socket, 
        private productsService: ProductsService, 
        public dialog: MatDialog
    ) {   
        let params = this.router.url;
        this.pageTitle = params.replace(/\//g, " "); 
        this.pageTitle = this.pageTitle.replace(/-/g, " ");       
    }

    searchbar = true;
    toggleClass(searchbar: boolean) {
        searchbar = !false;
    }

    ngOnDestroy(): void {     
        console.log('exit');   
    }

    ngOnInit() {
        this.getAllQueuedParking();
        this.getMessage();
    }

    getMessage() {
        return this.socket
        .fromEvent("message").subscribe(data => {
            console.log(data);
            this.getAllQueuedParking();
            this.openNotif();
        });
    }
 
    openNotif() {
        this._snackBar.openFromComponent(NotifComponent, {
            duration: this.durationInSeconds * 1000,
            verticalPosition: 'bottom',
            horizontalPosition: 'left'
        });
    }  

    getAllQueuedParking() {
        this.transactionService.getAllQueuedParking('all-queued-parking')
        .subscribe((transactions: any) => {
            console.log(transactions);
            console.log(this.transactions = transactions.data);
        }, error => { 
            console.log(error);
            // this.redirect();
        });
    }

}

@Component({
  selector: 'pos.notif.component',
  templateUrl: 'pos.notif.component.html',
  styles: [`
    .notif-layer {
      color: hotpink;
    }
  `],
})
export class NotifComponent {}

  
