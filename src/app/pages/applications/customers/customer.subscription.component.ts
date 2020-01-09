import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { Subscription } from '../../../shared/subscription';
import { SubscriptionService } from '../../../services/subscriptions.services';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';
import Swal from 'sweetalert2';

@Component({
    selector: 'customer-subscription-dialog',
    templateUrl: './customer-subscription-dialog.html',
})

export class CustomerSubscriptionDialogComponent implements OnInit {

    formErrors: any;
    subscriptions: any;
    public SubscriptionForm: FormGroup;
    registrationDate: any;
    expirationDate: any;
    diffInDays: any;

    constructor(
        public dialogRef: MatDialogRef<CustomerSubscriptionDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: Subscription,
        private builder: FormBuilder,
        private subscriptionService: SubscriptionService
    ) { 
        
        this.SubscriptionForm = this.builder.group({
            registration_date: ['', Validators.required],
            expiration_date: ['', Validators.required],
            allowance_minute: ['', Validators.required],
            total_amount: [{disabled: true, value: ''}],
            excess_rate_option: ['', Validators.required]
        });

        this.formErrors = {
            registration_date: {},
            expiration_date: {},
            allowance_minute: {},
            total_amount: {},
            excess_rate_option: {}
        }; 
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    ngOnInit() {
        if (!this.data.editForm == true) { 
            this.data.editForm = false; 
            this.registrationDate = '';
            this.expirationDate = '';
        } else {
            this.SubscriptionForm.patchValue({
                registration_date: this.data.registration_date,
                expiration_date: this.data.expiration_date,
                allowance_minute: this.data.allowance_minute,
                excess_rate_option: this.data.excess_rate_option,
                total_amount: this.data.total_amount
            });
            this.registrationDate = moment(this.data.registration_date);
            this.expirationDate = moment(this.data.expiration_date);
        }        
    }

    onRegDate(event): void {
        this.registrationDate = moment(event);
        console.log(this.registrationDate);
        this.validate_total_amount();
    }

    onExpDate(event): void {
        this.expirationDate = moment(event);
        console.log(this.expirationDate);
        this.validate_total_amount();
    }

    validate_total_amount() {
        if (this.registrationDate != '' && this.expirationDate != '') {
            this.diffInDays = Math.abs(this.registrationDate.diff(this.expirationDate, 'days'));                    
            this.SubscriptionForm.patchValue({
                total_amount: this.data.fixedrate * this.diffInDays
            });
            console.log(this.diffInDays);     
        }
    }

    saveSubscription() {
        Swal.fire({
            title: 'Are you sure?',
            text: 'The information will be saved.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, save it!',
            cancelButtonText: 'No, not now.'
            }).then((result) => {
            if (result.value) {
                if (this.data.editForm == false) {
                    this.subscriptionService.create(this.SubscriptionForm.value, this.data.customer_id, this.SubscriptionForm.get('total_amount').value)
                    .subscribe((subscriptions: any) => {
                        console.log(subscriptions);
                        if (subscriptions.status == 'ok') {
                            this.data.editForm = true;
                            this.data.editFormId = subscriptions.data.id;
                        }
                        Swal.fire(
                            subscriptions.message.info,
                            subscriptions.message.text,
                            subscriptions.message.type
                        )
                        this.dialogRef.close();
                    }, error => { 
                        console.log(error);
                        // this.redirect();
                    });
                } else {
                    this.subscriptionService.update(this.SubscriptionForm.value, this.data.editFormId, this.SubscriptionForm.get('total_amount').value)
                    .subscribe((subscriptions: any) => {
                        console.log(subscriptions);
                        Swal.fire(
                            subscriptions.message.info,
                            subscriptions.message.text,
                            subscriptions.message.type
                        )
                        this.dialogRef.close();
                    }, error => { 
                        console.log(error);
                        // this.redirect();
                    });
                }
                
            }
        });
    }
}