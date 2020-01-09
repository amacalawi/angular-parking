import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { POSDialogComponent } from './pos.dialog.component';
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
import { CustomerTypeService } from '../../services/customer-types.services';
import { CustomerType } from '../../shared/customer-type';
import { VehicleService } from '../../services/vehicles.services';
import { Vehicle } from '../../shared/vehicle';
import * as moment from 'moment';

@Component({
  selector: 'app-pos',
  templateUrl: './pos.component.html',
  styleUrls: ['./pos.component.scss']
})
export class PosComponent implements OnInit, OnDestroy {

    pageTitle: string = 'POS';
    pageURL: string;
    transactions: Transaction[];
    customertypes: CustomerType[];
    vehicles: Vehicle[];
    durationInSeconds = 5;
    searchText: any;
    transactionsLength: number;
    showPayment: boolean = false;
    information: any[] =  [{
        'id': '',
        'rfid_no': '',
        'vehicle_name': '',
        'vehicle_rate': 0,
        'plate_no': '',
        'model': '',
        'customer_type': '',
        'validity': '',
        'timed_allowance': '',
        'timed_in': '',
        'total_time': '',
        'total_amount': 0,
        'total_credits': 0,
        'payment_method': 1,
        'amount_paid': 0,
        'amount_change': 0
    }];

    totalPayment: number = 0;
    
    public CheckInForm: FormGroup;
    public CheckOutForm: FormGroup;

    constructor(
        public navService: NavService,
        private router: Router,
        private route: ActivatedRoute,
        private transactionService: TransactionService,
        private builder: FormBuilder,
        private _snackBar: MatSnackBar, 
        private socket: Socket, 
        public dialog: MatDialog,
        private customertypeService: CustomerTypeService,
        private vehicleService: VehicleService,
    ) {   
        this.pageURL = this.router.url;
        let params = this.router.url;
        this.pageTitle = params.replace(/\//g, " "); 
        this.pageTitle = this.pageTitle.replace(/-/g, " ");    

        this.CheckInForm = this.builder.group({
            rfid_no: [{disabled: true, value: ''}],
            model: [''],
            timed_in: [{disabled: true, value: ''}],
            vehicle_id: ['', Validators.required],
            plate_no: ['', Validators.required]
        });

        this.CheckOutForm = this.builder.group({
            id: [''],
            rfid_no: [''],
            vehicle_name: [''],
            vehicle_rate: [''],
            plate_no: [''],
            model: [''],
            customer_type: [''],
            validity: [''],
            timed_allowance: [''],
            timed_in: [''],
            total_time: [''],
            total_amount: [''],
            total_credits: [''],
            payment_method: [''],
            amount_paid: [''],
            amount_change: ['']
        });
    }

    searchbar = true;
    toggleClass(searchbar: boolean) {
        const searchText = <HTMLElement> document.querySelector('.theme-search-input');
        if (searchbar == true) {
            this.searchText = '';
            this.getAllQueuedParking('');
        }
        searchbar = !false;
        setTimeout(()=>{
            searchText.focus();
        },0);  
    }

    ngOnDestroy(): void {     
        console.log('exit');   
    }

    ngOnInit() {
        this.getAllQueuedParking();
        this.getMessage();
        this.getAllCustomerTypes();
        this.getAllVehicles();
    }

    getMessage() {
        return this.socket
        .fromEvent("message").subscribe((results: any) => {
            console.log(results);
            if (results.message.notify == true) {
                this.getAllQueuedParking();
                this.openNotif();
            } else if (results.message.notify == false) {
                var layer0 = <HTMLElement> document.querySelector('.container-0');
                var overlaySpinner = <HTMLElement> document.querySelector('.overlay-spinner');
                overlaySpinner.classList.add('d-block');
                setTimeout(() => {
                    overlaySpinner.classList.remove('d-block');
                    layer0.classList.add('d-block');
                    this.CheckInForm.patchValue({
                        rfid_no: results.message.data[0].rfid_no,
                        timed_in: results.message.data[0].timed_in
                    });
                }, 500 + 300 * (Math.random() * 5));
            }
        });
    }
 
    openNotif() {
        this._snackBar.openFromComponent(NotifComponent, {
            duration: this.durationInSeconds * 1000,
            verticalPosition: 'bottom',
            horizontalPosition: 'left'
        });
    }  

    onContextMenuAction($filter: string) {
        this.getAllQueuedParking($filter);
    }

    getAllCustomerTypes() {
        this.customertypeService.getAllCustomerTypes()
        .pipe(
            map(data => data)
        ).subscribe((customertypes: any) => {
            console.log(this.customertypes = customertypes.data);
        }, error => { console.log(error)
            this.redirect();
        });
    }

    searchTrans() {
        if (this.searchText != '') {    
            this.transactionService.autocheckin(this.searchText)
            .subscribe((results: any) => {
                console.log(results);
                this.searchbar = true;
                this.searchText = '';
                if (results.notify == true) {
                    this.getAllQueuedParking();
                    this.openNotif();
                } else if (results.notify == false) {
                    var layer0 = <HTMLElement> document.querySelector('.container-0');
                    var overlaySpinner = <HTMLElement> document.querySelector('.overlay-spinner');
                    overlaySpinner.classList.add('d-block');
                    setTimeout(() => {
                        overlaySpinner.classList.remove('d-block');
                        layer0.classList.add('d-block');
                        this.CheckInForm.patchValue({
                            rfid_no: results.data[0].rfid_no,
                            timed_in: results.data[0].timed_in
                        });
                    }, 500 + 300 * (Math.random() * 5));
                }
            }, error => { 
                console.log(error);
                // this.redirect();
            });
        } else {
            this.getAllQueuedParking('');
        }
    }

    getAllQueuedParking($filter = '') {
        if ($filter != '' && $filter != 'All') {
            this.transactionService.getAllQueuedParking('all-queued-parking')
            .subscribe((transactions: any) => {
                console.log(this.transactions = transactions.data.filter(transaction => transaction.type === $filter));
                this.transactionsLength = this.transactions.length;
            }, error => { 
                console.log(error);
                // this.redirect();
            });
        } else {
            this.transactionService.getAllQueuedParking('all-queued-parking')
            .subscribe((transactions: any) => {
                console.log(this.transactions = transactions.data);
                this.transactionsLength = this.transactions.length;
            }, error => { 
                console.log(error);
                // this.redirect();
            });
        }
    }

    redirect() {
        sessionStorage.clear();
        localStorage.clear();
        this.router.navigate(['/login'], { queryParams: { redirect: this.pageURL }, replaceUrl: true });
    }

    getAllVehicles() {
        this.vehicleService.getAllVehicles('all')
        .subscribe((vehicles: any) => {
            console.log(this.vehicles = vehicles.data);
        }, error => { 
            // this.redirect();
        });
    }

    saveCheckIn() {
        Swal.fire({
            title: 'Are you sure?',
            text: 'The information will be checked in.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, check in now!',
            cancelButtonText: 'No, not now.'
            }).then((result) => {
            if (result.value) {
                this.transactionService.checkin(this.CheckInForm.value, this.CheckInForm.get('rfid_no').value)
                .subscribe((transactions: any) => {
                    console.log(transactions);
                    Swal.fire(
                        transactions.message.info,
                        transactions.message.text,
                        transactions.message.type
                    )
                    this.getAllQueuedParking();
                    var layer0 = <HTMLElement> document.querySelector('.container-0');
                    layer0.classList.remove('d-block');
                }, error => { 
                    console.log(error);
                    // this.redirect();
                });
            }
        });   
    }
    
    convertToMinute($time: any) {
        var startTime  = moment($time, 'hh:mm');
        var endTime = moment("00:00", 'hh:mm');
        var totalminutes = Math.abs(endTime.diff(startTime, 'minute'));
        return totalminutes;
    }

    reload() {
        var layer0 = <HTMLElement> document.querySelector('.container-0');
        var layer1 = <HTMLElement> document.querySelector('.container-1');
        var layer2 = <HTMLElement> document.querySelector('.container-2');
        layer0.classList.remove('d-block');
        layer1.classList.remove('d-block');
        layer2.classList.remove('d-block');
        this.getAllQueuedParking('');
        this.showPayment = false;
        this.information[0].id = '';
        this.information[0].rfid_no = '';
        this.information[0].vehicle_name = '';
        this.information[0].vehicle_rate = 0;
        this.information[0].plate_no = '';
        this.information[0].model = '';
        this.information[0].customer_type = '';
        this.information[0].validity = '';
        this.information[0].timed_allowance = '';
        this.information[0].timed_in = '';
        this.information[0].total_time = '';
        this.information[0].total_amount = 0;
        this.information[0].total_credits = 0;
        this.information[0].payment_method = 1;
        this.information[0].amount_paid = 0;
        this.information[0].amount_change = 0;
        this.CheckOutForm.patchValue({
            id: '',
            rfid_no: '',
            vehicle_name: '',
            vehicle_rate: '',
            plate_no: '',
            model: '',
            customer_type: '',
            validity: '',
            timed_allowance: '',
            timed_in: '',
            total_time: '',
            total_amount: '',
            total_credits: '',
            payment_method: '',
            amount_paid: '',
            amount_change: ''
        });
    }

    openTrans($id: number, $rfid: any, $credits: any, $payment_method: number, $vehicle: string, $plate_no: string, $model: string, $rate: any, $type: string, $validity: string, $allowance: any, $timed_in: any, $excess_option: string, $excess_multiplier: any) {
        var layer1 = <HTMLElement> document.querySelector('.container-1');
        var layer2 = <HTMLElement> document.querySelector('.container-2');
        var overlaySpinner = <HTMLElement> document.querySelector('.overlay-spinner');
        this.showPayment = false;
        layer2.classList.remove('d-block');
        overlaySpinner.classList.add('d-block');
        setTimeout(() => {
            overlaySpinner.classList.remove('d-block');
            layer1.classList.add('d-block');

            let todate = moment();
            let timedin = moment($timed_in);
            let totalminute: any = Math.abs(timedin.diff(todate.format(), 'minute'));
            let validity: any  = this.convertToMinute($validity);
            let allowance: any = this.convertToMinute($allowance);
            console.log(this.information[0].id = $id);
            console.log(this.information[0].rfid_no = $rfid);
            console.log(this.information[0].vehicle_name = $vehicle);
            console.log(this.information[0].plate_no = $plate_no);
            console.log(this.information[0].model = $model);
            console.log(this.information[0].vehicle_rate = $rate);
            console.log(this.information[0].customer_type = $type);
            console.log(this.information[0].validity = $validity);
            console.log(this.information[0].timed_allowance = $allowance);
            console.log(this.information[0].timed_in = $timed_in);
            console.log(this.information[0].total_credits = parseFloat($credits).toFixed(2));
            console.log(this.information[0].payment_method = $payment_method);

            let hours: any = Math.floor(totalminute / 60);          
            let minutes: any = totalminute % 60;
            hours = (hours < 10) ? '0' + hours : hours;
            minutes = (minutes < 10) ? '0' + minutes : minutes;
            console.log(this.information[0].total_time = hours + ':' + minutes);    

            if (parseFloat(allowance) >= parseFloat(totalminute)) {
                this.information[0].total_amount = 0;
            } else {
                let timeAllowed: any = parseFloat(totalminute) - parseFloat(allowance);
                if (parseFloat(timeAllowed) <= parseFloat(validity)) {
                    this.information[0].total_amount = $rate;
                } else {
                    if ($excess_option == 'EX_PER_MIN') {
                        let excess_minute: any = parseFloat(timeAllowed) - parseFloat(validity);
                        let totalexcessAmount: any = parseFloat(excess_minute) * parseFloat($excess_multiplier);
                        this.information[0].total_amount = parseFloat($rate) + parseFloat(totalexcessAmount);
                    } else {
                        let excess_hours: any = parseFloat(timeAllowed) - parseFloat(validity);
                        let excessHr: any = Math.floor(excess_hours / 60); 
                        let excessMin: any = excess_hours % 60;   
                        console.log('excessHr: ' + excess_hours);
                        console.log('excessHr: ' + excessHr);
                        console.log('excessMin: ' + excessMin);

                        let totalexcessAmount: any = parseFloat(excessHr) * parseFloat($excess_multiplier);
                        console.log('multiplier: ' + $excess_multiplier);
                        console.log('excess amount: ' + totalexcessAmount);
                        if (parseFloat(excessMin) > 0) {
                            totalexcessAmount += parseFloat($excess_multiplier);
                        }
                        this.information[0].total_amount = parseFloat($rate) + parseFloat(totalexcessAmount); 
                    }
                    
                    this.totalPayment = this.information[0].total_amount;
                    this.information[0].total_amount = parseFloat(this.information[0].total_amount).toFixed(2);
                }
            }

            if ($payment_method == 2) {
                if (parseFloat($credits) >= parseFloat(this.information[0].total_amount)) {
                    this.information[0].amount_paid = this.information[0].total_amount;
                } else {
                    this.information[0].amount_paid = $credits;
                }
            } else {
                this.information[0].amount_paid = 0;
            }

        }, 500 + 300 * (Math.random() * 5));
    }

    toggleCheckout() {
        var layer1 = <HTMLElement> document.querySelector('.container-1');
        var layer2 = <HTMLElement> document.querySelector('.container-2');
        if (this.showPayment == true) {
            layer2.classList.remove('d-block');
            layer1.classList.add('d-block');
        } else {
            layer1.classList.remove('d-block');
            layer2.classList.add('d-block');
        }
        this.showPayment = this.showPayment ? false : true;
    }

    togglePaymentMethod($method: number) {
        if ($method == 2) {
            if (parseFloat(this.information[0].total_credits) >= parseFloat(this.information[0].total_amount)) {
                this.information[0].amount_paid = this.information[0].total_amount;
            } else {
                this.information[0].amount_paid = this.information[0].total_credits;
            }
        } else {
            this.information[0].amount_paid = 0;
        }
        this.information[0].amount_change = 0;
    }

    compute(v: any) {
        let vals = new Number(this.information[0].amount_paid);
        let str = new String(this.information[0].amount_paid);
        
        if (v == '.') {
            if (this.information[0].amount_paid.includes(".") == 0) {
                if (vals == 0 && str.length <= 2) {
                    this.information[0].amount_paid = v;
                } else {
                    this.information[0].amount_paid += v;
                }
            
                this.information[0].amount_change = (this.information[0].amount_paid - this.information[0].total_amount);
                this.information[0].amount_change = parseFloat(this.information[0].amount_change).toFixed(2);
            }
        } else {
            if (vals == 0 && str.length <= 2) {
                this.information[0].amount_paid = v;
            } else {
                this.information[0].amount_paid += v;
            }
        
            this.information[0].amount_change = (this.information[0].amount_paid - this.information[0].total_amount);
            this.information[0].amount_change = parseFloat(this.information[0].amount_change).toFixed(2);
        }
    }
    
    clear() {
        let vals = new String(this.information[0].amount_paid);
    
        if (vals.length > 1) {
            this.information[0].amount_paid = parseFloat(vals.substring(0, vals.length - 1));
        } else {
            this.information[0].amount_paid = 0;
        }
    
        this.information[0].amount_change = this.information[0].amount_paid - this.information[0].total_amount;
        this.information[0].amount_change = parseFloat(this.information[0].amount_change).toFixed(2);
    }

    saveCheckout() {
        this.CheckOutForm.patchValue({
            id: this.information[0].id,
            rfid_no: this.information[0].rfid_no,
            vehicle_name: this.information[0].vehicle_name,
            vehicle_rate: this.information[0].vehicle_rate,
            plate_no: this.information[0].plate_no,
            model: this.information[0].model,
            customer_type: this.information[0].customer_type,
            validity: this.information[0].validity,
            timed_allowance: this.information[0].timed_allowance,
            timed_in: this.information[0].timed_in,
            total_time: this.information[0].total_time,
            total_amount: this.information[0].total_amount,
            total_credits: this.information[0].total_credits,
            payment_method: this.information[0].payment_method,
            amount_paid: this.information[0].amount_paid,
            amount_change: this.information[0].amount_change
        });
        Swal.fire({
            title: 'Are you sure?',
            text: 'The transaction will be saved as checked out.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, save it!',
            cancelButtonText: 'No, not now.'
            }).then((result) => {
            if (result.value) {
                this.transactionService.checkout(this.CheckOutForm.value, this.information[0].id)
                .subscribe((transactions: any) => {
                    console.log(transactions);
                    this.reload();
                }, error => { 
                    console.log(error);
                    // this.redirect();
                });
                Swal.fire(
                    'Success!',
                    'The transaction has been successfully checked out.',
                    'success'
                )
            }
        });        
    }

    rfidScan() {
        
        // .subscribe((data: any) => {
        //     console.log(data);
        // }, error => { 
        //     console.log(error);
        //     // this.redirect();
        // });
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

  
