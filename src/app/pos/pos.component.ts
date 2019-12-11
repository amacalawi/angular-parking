import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { POSDialogComponent } from './pos.dialog.component';
import { ProductsService } from '../services/products.services';
import { Product } from '../shared/product';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormControl, Validators } from '@angular/forms';
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

  // amountPaid = new FormControl('', [Validators.required, Validators.amountPaid]);

 

  ngOnDestroy(): void {
    // throw new Error("Method not implemented.");
  }

  pageTitle: string = 'POS';
  showPayment: Boolean = true;
  items: any = [];
  name: string;
  price: number;
  quantity: number;
  total: number;
  numberOfProducts: number;
  limit: number;
  page: number = 1;
  products: Product[];
  totalItems: number;
  subTotal: number;
  vatTotal: number;
  totalDiscount: number;
  totalPayment: number; 
  totalPaid: number = 0; 
  totalChange: number = 0; 
  durationInSeconds = 5;

  getErrorMessage() {
    return (this.totalPaid <= 0) ? 'You must enter a value on amount paid' : '';
  }

  constructor(private _snackBar: MatSnackBar, private socket: Socket, private productsService: ProductsService, private router: Router, public dialog: MatDialog) { }

  ngOnInit() {
    this.getSelectedItems();
    this.getAllProducts();
    this.computeTotalPayments();
    this.getMessage();
  }

  getMessage() {
    return this.socket
      .fromEvent("message").subscribe(data => {
        console.log(data);
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

  opened = false;
  opened2 = false;

  log(state: any) {
    console.log(state)
  }

  log2(state: any) {
    console.log(state)
  }


  onContextMenuAction($items: string) {
    this.getAllProducts($items);
  }

  goTo(link: string) {
    setTimeout(() => {
      this.router.navigate(['/' + link]);
    }, 300);
  }

  searchbar = true;
  toggleClass(searchbar: boolean) {
    searchbar = !false;
  }

  toggleCheckout() {
    this.showPayment = this.showPayment ? false : true;
  }

  openDialog($name: any, $price: any, $qty: any, $total: any): void {
    const dialogRef = this.dialog.open(POSDialogComponent, {
      width: '270px',
      data: {
        name: $name,
        price: $price,
        quantity: $qty,
        total: $total
      }
    });

    dialogRef.afterClosed().subscribe(res => {
      this.name = '';
      this.price = 0;
      this.quantity = 0;
      this.total = 0;
      this.getSelectedItems();
      this.computeTotalPayments();
      console.log('dialog closed!');
    });
  }

  getSelectedItems() {
    this.items = [];
    let arr = [];
    let keys = [];

    Object.keys(localStorage).forEach(function(key){
      keys.push(key);
    });

    keys.sort(function(a, b) {
        return a.toLowerCase().localeCompare(b.toLowerCase());
    });

    for (let i = 0; i < keys.length; i++) {
      let key: any = keys[i];
      arr.push(JSON.parse(localStorage.getItem(key)));
    }
    
    this.items = arr;
    this.totalItems = arr.length;
    console.log(this.items);
  }

  getAllProducts($filter = '') {
    if ($filter != '' && $filter != 'All') {
      console.log('true');
      this.productsService.getProducts().pipe(
        map(data => data)
      ).subscribe((products: Product[]) => {
        this.products = products.filter(product => product.category === $filter);
        this.numberOfProducts = this.products.length;
        this.limit = this.products.length;
      }, error => { console.log(error) });
    } else {
      console.log('false');
      this.productsService.getProducts().pipe(
        map(data => data)
      ).subscribe((products: Product[]) => {
        this.products = products;
        this.numberOfProducts = this.products.length;
        this.limit = this.products.length;
      }, error => { console.log(error) });
    }
  }

  computeTotalPayments() {
    let vat: number = 0;
    let sub: number = 0;
    let vatMultiplier: any = '0.12';
    this.items.forEach(function(data: any){
      vat += (parseFloat(data.total) * parseFloat(vatMultiplier.toString()));
      sub += parseFloat(data.total);
    });
    this.vatTotal = vat;
    this.subTotal = sub;
    this.totalDiscount = 0;
    this.totalPayment = (vat + sub);
    console.log(this.vatTotal);
    console.log(this.subTotal);
  }

  resetItems() {
    localStorage.clear();
    this.getSelectedItems();
    this.vatTotal = 0;
    this.subTotal = 0;
    this.totalDiscount = 0;
    this.totalPayment = 0; 
    this.totalPaid = 0; 
    this.totalChange = 0; 
    this.showPayment = true;
  }

  compute(v: number) {
    let vals = new Number(this.totalPaid);
    let str = new String(this.totalPaid);

    if (vals == 0 && str.length <= 2) {
      this.totalPaid = v;
    } else {
      this.totalPaid += v;
    }

    this.totalChange = (this.totalPaid - this.totalPayment);
  }

  clear() {
    let vals = new String(this.totalPaid);

    if (vals.length > 1) {
      this.totalPaid = parseFloat(vals.substring(0, vals.length - 1));
    } else {
      this.totalPaid = 0;
    }

    this.totalChange = (this.totalPaid - this.totalPayment);
  }
  
  deleteStoredItems() {
    if (localStorage.length > 0) {
      Swal.fire({
          title: 'Are you sure?',
          text: 'All items will be reset!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, reset it!',
          cancelButtonText: 'No, keep it'
          }).then((result) => {
          if (result.value) {
              this.resetItems();
              Swal.fire(
                  'Success!',
                  'All stored items has been reset successfully.',
                  'success'
              )
          } else if (result.dismiss === Swal.DismissReason.cancel) {
              // Swal.fire(
              // 'Cancelled',
              // 'Your imaginary file is safe :)',
              // 'error'
              // )
          }
      })
    }
  }

  checkout() {
    Swal.fire({
        title: 'Are you sure?',
        text: 'All selected items will be sold!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, confirm it!',
        cancelButtonText: 'No, not now'
        }).then((result) => {
        if (result.value) {
            this.resetItems();
            Swal.fire(
                'Success!',
                'All selected items has been successfully sold.',
                'success'
            )
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            // Swal.fire(
            // 'Cancelled',
            // 'Your imaginary file is safe :)',
            // 'error'
            // )
        }
    })
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

  
