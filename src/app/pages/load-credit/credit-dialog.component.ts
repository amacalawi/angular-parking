import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { Loadcredit } from '../../shared/loadcredit';
import { CreditService } from '../../services/credits.services';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';
import Swal from 'sweetalert2';

@Component({
    selector: 'credit-dialog',
    templateUrl: './credit-dialog.html',
})

export class CreditDialogComponent implements OnInit {

    formErrors: any;
    subscriptions: any;
    public CreditForm: FormGroup;
    registrationDate: any;
    expirationDate: any;
    diffInDays: any;
    staticDisableValue: any;

    constructor(
        public dialogRef: MatDialogRef<CreditDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: Loadcredit,
        private builder: FormBuilder,
        private creditService: CreditService
    ) {
        this.CreditForm = this.builder.group({
            rfid_no: [{disabled: true, value: ''}],
            fullname: [{disabled: true, value: ''}],
            credits: [{disabled: true, value: ''}],
            amount_loaded: [{disabled: true, value: ''}]
        });

        this.formErrors = {
            amount_loaded: {}
        }; 
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    ngOnInit() {
        this.CreditForm.patchValue({
            rfid_no: this.data.rfid_no,
            fullname: this.data.fullname,
            credits: this.data.credits,
            amount_loaded: 0
        });     

        this.staticDisableValue = 0;
    }

    compute(v: any) {
        let vals = new Number(this.CreditForm.get('amount_loaded').value);
        let str = new String(this.CreditForm.get('amount_loaded').value);
        let newVal = new String(this.CreditForm.get('amount_loaded').value);
        
        if (v == '.') {
            if (vals == 0 && str.length <= 2) {
                newVal += v;
            } else {
                if (this.CreditForm.get('amount_loaded').value.includes(".") == 0) {
                    if (vals == 0 && str.length <= 2) {
                        newVal = v;
                    } else {
                        newVal += v;
                    }
                }
            }
        } else {
            if (vals == 0 && str.length <= 1) {
                newVal = v;
            } else {
                newVal += v;
            }
        }
        this.staticDisableValue = 1;
        this.CreditForm.patchValue({
            amount_loaded: newVal
        });
        return false;
    }

    clear() {
        let vals = new String(this.CreditForm.get('amount_loaded').value);
        let newVal: any = (this.CreditForm.get('amount_loaded').value);
    
        if (vals.length > 1) {
            newVal = parseFloat(vals.substring(0, vals.length - 1));
            this.staticDisableValue = 1;
        } else {
            newVal = 0;
            this.staticDisableValue = 0;
        }

        this.CreditForm.patchValue({
            amount_loaded: newVal
        });
        return false;
    }

    saveCredit() {
        Swal.fire({
            title: 'Are you sure?',
            text: 'The information will be saved.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, save it!',
            cancelButtonText: 'No, not now.'
            }).then((result) => {
            if (result.value) {
                this.creditService.create(this.CreditForm.value, this.data.customer_id, this.CreditForm.get('amount_loaded').value)
                .subscribe((credits: any) => {
                    console.log(credits);
                    Swal.fire(
                        credits.message.info,
                        credits.message.text,
                        credits.message.type
                    )
                    this.dialogRef.close();
                }, error => { 
                    console.log(error);
                    // this.redirect();
                });
            }
        });
    }
}