import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { ModalData } from './model-data';
import { max } from 'rxjs/operators';

@Component({
  selector: 'pos-dialog',
  templateUrl: './pos.dialog.html'
})

export class POSDialogComponent implements OnInit {
  indexs: any;

  constructor(
    public dialogRef: MatDialogRef<POSDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ModalData) 
  { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
  }

  compute(v: number) {
    let vals = new Number(this.data.quantity);
    let str = new String(this.data.quantity);

    if (vals == 0 && str.length <= 2) {
      this.data.quantity = v;
    } else {
      this.data.quantity += v;
    }

    this.data.total = (this.data.quantity * this.data.price);
  }

  clear() {
    let vals = new String(this.data.quantity);

    if (vals.length > 1) {
      this.data.quantity = parseFloat(vals.substring(0, vals.length - 1));
    } else {
      this.data.quantity = 0;
    }

    this.data.total = (this.data.quantity * this.data.price);
  }

  addItem() {

    let keys: any = []; 

    for (var x in localStorage) {
        if(!isNaN(localStorage[x])) {
          keys.push(localStorage[x]);
        }
    }

    keys.sort(function(a, b) {
        return a.toLowerCase().localeCompare(b.toLowerCase());
    });

    this.indexs = (localStorage.length == 0) ? new Number(0) : parseFloat(keys[keys.length-1]) + 1;
    let discount = new Number(0);

    let json = {
      name: this.data.name,
      quantity: this.data.quantity,
      price: this.data.price,
      discount: discount,
      total : this.data.total
    }

    console.log(this.indexs);
    localStorage.setItem(this.indexs, JSON.stringify(json));
    console.log('item added');
  }


}