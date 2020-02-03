import { Component, ViewChild, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NavService } from '../../services/nav.services'
import { TransactionService } from '../../services/transactions.services';
import { Transaction } from '../../shared/transaction';

@Component({
    selector: 'app-reports',
    templateUrl: './reports.component.html',
    styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

    pageTitle: string;
    transactions: Transaction[];
    transactionsLength: number = 0;
    formErrors: any;
    totalAmount: number = 0;

    public ReportForm: FormGroup;

    constructor(
        public navService: NavService,
        public transactionService: TransactionService,
        private router: Router,
        private route: ActivatedRoute,
        private builder: FormBuilder
    ) { 
        let params = this.router.url;
        this.pageTitle = params.replace(/\//g, " "); 
        this.pageTitle = this.pageTitle.replace(/-/g, " ");  
        this.ReportForm = this.builder.group({
            start_date: ['', Validators.required],
            end_date: ['', Validators.required],
            type: ['', Validators.required],
            orderby: ['', Validators.required]
        });

        this.formErrors = {
            start_date: {},
            end_date: {},
            type: {},
            orderby: {}
        };    
    }

    ngOnInit() {
        if (sessionStorage.credentials !== undefined) {
        } else {
            this.router.navigate([this.route.snapshot.queryParams.redirect || '/'], { replaceUrl: true });
        }
    }

    validateAllFormFields(formGroup: FormGroup) {      
        Object.keys(formGroup.controls).forEach(field => {  //{2}
            const control = formGroup.get(field);             //{3}
            if (control instanceof FormControl) {             //{4}
              control.markAsTouched({ onlySelf: true });
            } else if (control instanceof FormGroup) {        //{5}
              this.validateAllFormFields(control);            //{6}
            }
        });
    }

    generate() {
        if (this.ReportForm.valid) {
            var overlaySpinner = <HTMLElement> document.querySelector('.overlay-spinner-2');
            var reportLayer = <HTMLElement> document.querySelector('.report-layer');
            reportLayer.classList.remove('d-block');
            this.transactionService.generate(this.ReportForm.value)
            .subscribe((transactions: any) => {
                this.totalAmount = transactions.total_amount;
                overlaySpinner.classList.add('d-block');
                setTimeout(() => {
                    overlaySpinner.classList.remove('d-block');
                    reportLayer.classList.add('d-block');
                    console.log(this.transactions = transactions.data);
                    this.transactionsLength = this.transactions.length;
                    this.toggleButton();
                }, 500 + 300 * (Math.random() * 5));
            }, error => { 
                console.log(error);
                // this.redirect();
            });
        } else {
            console.log('validate form');
            this.validateAllFormFields(this.ReportForm);
        }
    }

    activeBtn: boolean = false
    toggleButton() {
        if (this.transactionsLength > 0) {
            this.activeBtn = true;
        } else {
            this.activeBtn = false;
        }
    }
    
    print(): void {
        let printContents, popupWin;
        var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : window.screenX;
        var dualScreenTop = window.screenTop != undefined ? window.screenTop : window.screenY;
        var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
        var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;
        var left = ((width / 2) - (500 / 2)) + dualScreenLeft;
        var top = ((height / 2) - (500 / 2)) + dualScreenTop;

        printContents = document.getElementById('report-layer').innerHTML;
        popupWin =  window.open('', '_blank', 'width=500,height=500,top='+top+',left='+left+'scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
        popupWin.document.open();
        popupWin.document.write(`
            <html>
            <head>
                <title>Print tab</title>
                <style>
                table {
                    width: 100% !important;
                }
                h4,
                table td,
                table th {
                    font-family: Arial, Helvetica, sans-serif;
                }
                table thead td {
                    font-weight: bold !important;
                }
                table td.text-right,
                table th.text-right {
                    text-align: right !important;
                }
                table td.text-center,
                table th.text-center {
                    text-align: center !important;
                }
                table tfoot th {
                    padding-top: 10px !important;
                }
                </style>
            </head>
            <body onload="window.print();window.close()">${printContents}</body>
            </html>`
        );
        popupWin.document.close();
    }

}
