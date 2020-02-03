import { Component, HostBinding, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { VehicleService } from '../../services/vehicles.services';
import { Vehicle } from '../../shared/vehicle';
import { CustomerTypeService } from '../../services/customer-types.services';
import { CustomerType } from '../../shared/customer-type';
import { Customer } from '../../shared/customer';
import { Credit } from '../../shared/credit';
import { CustomerService } from '../../services/customers.services';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { NavItem } from '../../shared/nav-item';
import { SubscriptionService } from '../../services/subscriptions.services';
import { Subscription } from '../../shared/subscription';
import { MatDialog } from '@angular/material';
import { NavService } from '../../services/nav.services';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CreditDialogComponent } from './credit-dialog.component';
import { TooltipPosition } from '@angular/material/tooltip';
import { CreditService } from '../../services/credits.services';

@Component({
    selector: 'app-load-credit',
    templateUrl: './load-credit.component.html',
    styleUrls: ['./load-credit.component.scss'],
    animations: [
        trigger('indicatorRotate', [
            state('collapsed', style({transform: 'rotate(0deg)'})),
            state('expanded', style({transform: 'rotate(180deg)'})),
            transition('expanded <=> collapsed',
            animate('225ms cubic-bezier(0.4,0.0,0.2,1)')
            ),
        ])
    ]
})
export class LoadCreditComponent implements OnInit {
    pageTitle: string;
    pageURL: string;
    expanded: boolean;
    @HostBinding('attr.aria-expanded') ariaExpanded = this.expanded;
    items: NavItem;
    customers: Customer[];
    customer: string;
    vehicles: Vehicle[];
    customertypes: CustomerType[];
    credits: Credit[];
    typeFilter: any;
    vehicleFilter: any;
    searchFilter: any;

    positionOptions: TooltipPosition[] = ['after', 'before', 'above', 'below', 'left', 'right'];
    position1 = new FormControl (this.positionOptions[1]);
    position2 = new FormControl (this.positionOptions[0]);

    displayedColumns: string[] = ['rfid', 'fullname', 'gender', 'type', 'vehicle', 'credits', 'modified_at', 'commands'];
    dataSource = new MatTableDataSource(this.customers);    

    displayedColumns2: string[] = ['transaction_no', 'credit_amount', 'modified_at'];
    dataSource2 = new MatTableDataSource(this.credits);    

    @ViewChild('sorter1', {static: false}) sorter1: MatSort;
    @ViewChild('paginator1', {static: false}) paginator1: MatPaginator;

    @ViewChild('sorter2', {static: false}) sorter2: MatSort;
    @ViewChild('paginator2', {static: false}) paginator2: MatPaginator;

    constructor(
        public navService: NavService,
        private router: Router,
        private route: ActivatedRoute,
        private customerService: CustomerService,
        private creditServie: CreditService,
        private customertypeService: CustomerTypeService,
        private vehicleService: VehicleService,
        public dialog: MatDialog
    ) { 
        this.pageURL = this.router.url;
        let params = this.router.url;
        this.pageTitle = params.replace(/\//g, " "); 
        this.pageTitle = this.pageTitle.replace(/-/g, " ");   
    }

    ngOnInit() {
        if (sessionStorage.credentials !== undefined) {
            this.getAllCustomers();
            this.getAllCustomerTypes();
            this.getAllVehicles();
        } else {
            this.router.navigate([this.route.snapshot.queryParams.redirect || '/'], { replaceUrl: true });
        }
    }

    filteredDataSource() {
        let temp = this.customers;
        if (this.typeFilter && this.vehicleFilter && this.searchFilter) {    
            temp = temp.filter(data => {
                return ((data.rfid_no.toLowerCase().includes(this.searchFilter) || data.customer_type.toLowerCase().includes(this.searchFilter)  || data.vehicle_name.toLowerCase().includes(this.searchFilter) || data.gender.includes(this.searchFilter) || data.firstname.toLowerCase().includes(this.searchFilter) || data.middlename.toLowerCase().includes(this.searchFilter) || data.lastname.toLowerCase().includes(this.searchFilter)) && data.customer_type_id == this.typeFilter && data.vehicle_id == this.vehicleFilter);
            })            
        } else {
            if(this.typeFilter) {            
                temp = temp.filter(data => data.customer_type_id == this.typeFilter);   
            }
            if(this.vehicleFilter) {            
                temp = temp.filter(data => data.vehicle_id == this.vehicleFilter);   
            }
            if(this.searchFilter) { 
                temp = temp.filter(data => {
                    return (data.rfid_no.toLowerCase().includes(this.searchFilter) || data.customer_type.toLowerCase().includes(this.searchFilter)  || data.vehicle_name.toLowerCase().includes(this.searchFilter) || data.gender.includes(this.searchFilter) || data.firstname.toLowerCase().includes(this.searchFilter) || data.middlename.toLowerCase().includes(this.searchFilter) || data.lastname.toLowerCase().includes(this.searchFilter));
                })
            }
        }

        this.dataSource = new MatTableDataSource(temp);
        this.dataSource.sort = this.sorter1;
        this.dataSource.paginator = this.paginator1;
        return this.dataSource;
    }

    getAllCustomerTypes() {
        this.customertypeService.getAllCustomerTypes('all')
        .pipe(
            map(data => data)
        ).subscribe((customertypes: any) => {
            console.log(this.customertypes = customertypes.data);
        }, error => { 
            console.log(error);
            // this.redirect();
        });
    }

    getAllVehicles() {
        this.vehicleService.getAllVehicles('active')
        .pipe(
            map(data => data)
        ).subscribe((vehicles: any) => {
            console.log(this.vehicles = vehicles.data);
        }, error => { 
            console.log(error);
            // this.redirect();
        });
    }

    getAllCustomers() {
        this.customerService.getAllCustomers('active')
        .pipe(
            map(data => data)
        ).subscribe((customers: any) => {
            console.log(this.customers = customers.data);
            this.dataSource = new MatTableDataSource(this.customers);    
            this.dataSource.sort = this.sorter1;
            this.dataSource.paginator = this.paginator1;
        }, error => { 
            console.log(error);
            // this.redirect();
        });
    }

    loadRow(id: number, rfid_no: string, firstname: string, middlename: string, lastname: string, credits: number) {
        const dialogRef = this.dialog.open(CreditDialogComponent, {
            width: '400px',
            disableClose: true,
            data: {
                customer_id: id,
                rfid_no: rfid_no,
                fullname: firstname + ' ' + middlename + ' ' + lastname,
                credits: credits
            }
        });
    
        dialogRef.afterClosed().subscribe(res => {
            this.getAllCustomers();
        });
    }

    viewRow(id: number, rfid_no: string, firstname: string, middlename: string, lastname: string) {
        var overlaySpinner = <HTMLElement> document.querySelector('.overlay-spinner');
        overlaySpinner.classList.add('d-block');
        this.creditServie.getAllLoadCredits(id)
        .pipe(
            map(data => data)
        ).subscribe((credits: any) => {
            console.log(this.credits = credits.data);
            this.customer = rfid_no + ' - ' + firstname + ' ' + middlename + ' ' + lastname;
            this.dataSource2 = new MatTableDataSource(this.credits);
            this.dataSource2.sort = this.sorter2;
            this.dataSource2.paginator = this.paginator2;
            setTimeout(() => {
                overlaySpinner.classList.remove('d-block');
                this.displayForm();
            }, 500 + 300 * (Math.random() * 5));
        }, error => { 
            console.log(error);
            // this.redirect();
        });
    }

    activeForm = false;
    documentHeight: any;
    toggleForm(activeForm: boolean) {
        if(activeForm == false) {
            this.documentHeight = <HTMLElement> document.querySelector('.content-table');
            this.documentHeight = this.documentHeight.offsetHeight + 44.8;
            this.resetForm();
        } else {
            this.documentHeight = <HTMLElement> document.querySelector('.content-form');
            this.documentHeight = this.documentHeight.offsetHeight + 44.8;
        }
        activeForm = !false;
    }
    
    displayForm() {
        this.activeForm = true;
        this.documentHeight = <HTMLElement> document.querySelector('.content-form');
        this.documentHeight = this.documentHeight.offsetHeight + 44.8;
    }

    resetForm() {
        this.getAllCustomers();
    }
}
