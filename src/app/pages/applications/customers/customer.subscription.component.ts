import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { Subscription } from '../../../shared/subscription';

@Component({
    selector: 'customer-subscription-dialog',
    templateUrl: './customer-subscription-dialog.html'
})

export class CustomerSubscriptionDialogComponent implements OnInit {

    constructor(
        public dialogRef: MatDialogRef<CustomerSubscriptionDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: Subscription
    ) { 

    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    ngOnInit() {

    }

    addItem() {

    }


}