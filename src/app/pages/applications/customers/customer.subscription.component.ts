import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { Subscription } from '../../../shared/subscription';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';

@Component({
    selector: 'customer-subscription-dialog',
    templateUrl: './customer-subscription-dialog.html',
})

export class CustomerSubscriptionDialogComponent implements OnInit {

    formErrors: any;
    editForm = false;
    editFormId: number;

    public SubscriptionForm: FormGroup;
    registrationDate: any;
    expirationDate: any;
    diffInDays: any;

    constructor(
        public dialogRef: MatDialogRef<CustomerSubscriptionDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: Subscription,
        private builder: FormBuilder,
    ) { 
        this.SubscriptionForm = this.builder.group({
            expiration_date: ['', Validators.required],
            allowance_minute: ['', Validators.required],
            total_amount: ['', Validators.required],
            excess_rate_option: ['', Validators.required]
        });

        this.formErrors = {
            expiration_date:{},
            allowance_minute: {},
            total_amount: {},
            excess_rate_option: {}
        }; 
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    ngOnInit() {

    }

    onRegDate(event): void {
        this.registrationDate = moment(event);
        console.log(this.registrationDate);
        this.validate_total_amount();
    }

    onExpDate(event): void {
        this.expirationDate = moment(event);
    }

    validate_total_amount() {
        if (this.registrationDate != '' && this.expirationDate != '') {
            this.diffInDays = Math.abs(this.registrationDate.diff(this.expirationDate, 'days')); 
            console.log(this.diffInDays);
        }
    }
}