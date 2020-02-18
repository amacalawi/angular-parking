import { Component, HostBinding, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { VehicleService } from '../../../services/vehicles.services';
import { Vehicle } from '../../../shared/vehicle';
import { CustomerTypeService } from '../../../services/customer-types.services';
import { CustomerType } from '../../../shared/customer-type';
import { Customer } from '../../../shared/customer';
import { CustomerService } from '../../../services/customers.services';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { NavItem } from '../../../shared/nav-item';
import { SubscriptionService } from '../../../services/subscriptions.services';
import { Subscription } from '../../../shared/subscription';
import { MatDialog } from '@angular/material';
import { CustomerSubscriptionDialogComponent } from './customer.subscription.component';
import { NavService } from '../../../services/nav.services';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss'],
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
export class CustomersComponent implements OnInit, OnDestroy {
    pageTitle: string;
    pageURL: string;
    expanded: boolean;
    @HostBinding('attr.aria-expanded') ariaExpanded = this.expanded;
    items: NavItem;

    vehicles: Vehicle[];
    customertypes: CustomerType[];
    customers: Customer[];
    subscriptions: Subscription[];
    typeFilter: any;
    vehicleFilter: any;
    statusFilter: any;
    searchFilter: any;
    formErrors: any;
    editForm = false;
    editFormId: number;
    editCusType: number;
    fixedRate: number;

    public CustomerForm: FormGroup;

    displayedColumns: string[] = ['rfid', 'fullname', 'gender', 'type', 'vehicle', 'modified_at', 'subscription', 'status', 'commands'];
    dataSource = new MatTableDataSource(this.customers);    
    @ViewChild('sorter1', {static: false}) sorter1: MatSort;
    @ViewChild('paginator1', {static: false}) paginator1: MatPaginator;

    displayedColumns2: string[] = ['transaction_no', 'registration_date', 'expiration_date', 'total_amount', 'subscriber_rate_option', 'excess_rate_option', 'modified_at', 'status', 'commands'];
    dataSource2 = new MatTableDataSource(this.subscriptions);    
    @ViewChild('sorter2', {static: false}) sorter2: MatSort;
    @ViewChild('paginator2', {static: false}) paginator2: MatPaginator;

    constructor(
        public navService: NavService,
        private router: Router,
        private route: ActivatedRoute,
        private vehicleService: VehicleService,
        private customertypeService: CustomerTypeService,
        private customerService: CustomerService,
        private subscriptionService: SubscriptionService,
        private builder: FormBuilder,
        public dialog: MatDialog
    ) { 
        this.pageURL = this.router.url;
        let params = this.router.url;
        this.pageTitle = params.replace(/\//g, " "); 
        this.pageTitle = this.pageTitle.replace(/-/g, " ");    
        this.CustomerForm = this.builder.group({
            firstname: ['', Validators.required],
            middlename: [''],
            lastname: ['', Validators.required],
            gender: ['', Validators.required],
            birthdate: [''],
            customer_type_id: ['', Validators.required],
            vehicle_id: ['', Validators.required],
            model: [''],
            plate_no: ['', Validators.required],
            rfid_no: ['', Validators.required],
            payment_type_id: ['', Validators.required]
        });

        this.formErrors = {
            firstname: {},
            middlename:{},
            lastname: {},
            gender: {},
            birthdate: {},
            customer_type_id: {},
            vehicle_id: {},
            model: {},
            plate_no: {},
            rfid_no: {},
            payment_type_id: {}
        };         
    }

    ngOnDestroy(): void {}

    ngOnInit() {
        if (sessionStorage.credentials !== undefined) {
            this.getAllVehicles();
            this.getAllCustomerTypes();
            this.getAllCustomers();
            this.getSubscriptions(0);
        } else {
            this.router.navigate([this.route.snapshot.queryParams.redirect || '/'], { replaceUrl: true });
        }
    }

    searchbar = true;
    toggleClass(searchbar: boolean) {
        searchbar = !false;
    }

    redirect() {
        sessionStorage.clear();
        localStorage.clear();
        this.router.navigate(['/login'], { queryParams: { redirect: this.pageURL }, replaceUrl: true });
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

    activeFormSubscribe = false;
    toggleFormSubscribe(activeFormSubscribe: boolean) {
        activeFormSubscribe = !false;
    }

    getSubscriptions(id: number) {
        this.subscriptionService.find(id)
        .pipe(
            map(data => data)
        ).subscribe((subscriptions: any) => {
            console.log(this.subscriptions = subscriptions.data);
            this.dataSource2 = new MatTableDataSource(this.subscriptions);    
            this.dataSource2.sort = this.sorter2;
            this.dataSource2.paginator = this.paginator2;
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

    filteredDataSource() {
        let temp = this.customers;
                
        if(this.typeFilter) {            
            temp = temp.filter(data => data.customer_type_id == this.typeFilter);   
        }
        if(this.vehicleFilter) {            
            temp = temp.filter(data => data.vehicle_id == this.vehicleFilter);   
        }
        if(this.statusFilter) {            
            temp = temp.filter(data => data.is_active == this.statusFilter);   
        }
        if(this.searchFilter) { 
            temp = temp.filter(data => {
                return data.firstname.toLowerCase().includes(this.searchFilter) || 
                data.middlename.toString().includes(this.searchFilter) || 
                data.lastname.toLowerCase().includes(this.searchFilter) || 
                data.gender.toLowerCase().includes(this.searchFilter) || 
                data.customer_type.toLowerCase().includes(this.searchFilter) ||
                data.vehicle_name.toLowerCase().includes(this.searchFilter);
            })
        }

        this.dataSource = new MatTableDataSource(temp);
        this.dataSource.sort = this.sorter1;
        this.dataSource.paginator = this.paginator1;
        return this.dataSource;
    }

    getAllCustomers() {
        this.customerService.getAllCustomers('all')
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

    displayForm() {
        this.activeFormSubscribe = true;
        this.activeForm = true;
        this.documentHeight = <HTMLElement> document.querySelector('.content-form');
        this.documentHeight = this.documentHeight.offsetHeight + 44.8;
    }

    displayTable() {
        this.activeForm = false;
        this.documentHeight = <HTMLElement> document.querySelector('.content-table');
        this.documentHeight = this.documentHeight.offsetHeight + 44.8;
        this.getAllCustomers();
    }

    resetForm() {
        this.getAllCustomers();
        this.activeFormSubscribe = false;
        this.editForm = false;
        this.editFormId = null;
        this.editCusType = null;
        this.CustomerForm.patchValue({
            firstname: '',
            middlename: '',
            lastname: '',
            gender: '',
            birthdate: '',
            customer_type_id: '',
            vehicle_id: '',
            model: '',
            plate_no: '',
            rfid_no: '',
            payment_type_id: ''
        });
    }

    saveCustomer() {
        Swal.fire({
            title: 'Are you sure?',
            text: 'The information will be saved.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, save it!',
            cancelButtonText: 'No, not now.'
            }).then((result) => {
            if (result.value) {
                if (this.editForm == false) {
                    this.customerService.create(this.CustomerForm.value)
                    .subscribe((customers: any) => {
                        console.log(customers);
                        if (customers.status == 'ok') {
                            this.activeFormSubscribe = true;
                            this.editForm = true;
                            this.editFormId = customers.data.id;
                            this.fixedRate = customers.fixedrate;
                        }
                        Swal.fire(
                            customers.message.info,
                            customers.message.text,
                            customers.message.type
                        )
                    }, error => { 
                        console.log(error);
                        // this.redirect();
                    });
                } else {
                    this.customerService.update(this.CustomerForm.value, this.editFormId)
                    .subscribe((customers: any) => {
                        console.log(customers);
                        Swal.fire(
                            customers.message.info,
                            customers.message.text,
                            customers.message.type
                        )
                    }, error => { 
                        console.log(error);
                        // this.redirect();
                    });
                }
                
            }
        });        
    }

    editRow(id: number, fixedrate: number) {
        this.customerService.find(id)
        .subscribe((customers: any) => {
            console.log(customers.data);
            this.editForm = true;
            this.editFormId = id;
            this.fixedRate = fixedrate;
            console.log(this.editCusType = customers.data.customer_type_id);
            this.getSubscriptions(id);
            this.CustomerForm.patchValue({
                firstname: customers.data.firstname,
                middlename: customers.data.middlename,
                lastname: customers.data.lastname,
                gender: customers.data.gender,
                birthdate: customers.data.birthdate,
                customer_type_id: customers.data.customer_type_id,
                vehicle_id: customers.data.vehicle_id,
                model: customers.data.model,
                plate_no: customers.data.plate_no,
                rfid_no: customers.data.rfid_no,
                payment_type_id: customers.data.payment_type_id
            });
        }, error => { 
            console.log(error);
            // this.redirect();
        });
        var overlaySpinner = <HTMLElement> document.querySelector('.overlay-spinner');
        overlaySpinner.classList.add('d-block');
        setTimeout(() => {
            overlaySpinner.classList.remove('d-block');
            this.displayForm();
        }, 500 + 300 * (Math.random() * 5));
    }

    deleteRow(id: number, active: number) {
        let text = (active == 0) ? 'The status will be changed to active.' : 'The status will be changed to inactive.';
        Swal.fire({
            title: 'Are you sure?',
            text: text,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, change it!',
            cancelButtonText: 'No, not now.'
            }).then((result) => {
            if (result.value) {                
                this.customerService.modify(id)
                .subscribe((customers: any) => {
                    console.log(customers);
                    this.getAllCustomers();
                    Swal.fire(
                        'Success!',
                        'the information has been successfully changed.',
                        'success'
                    )
                }, error => { 
                    console.log(error);
                    // this.redirect();
                });  
            }
        });        
    }

    openDialog(): void {
        if (!this.subscriptions.some(data => data.status == ('draft' || 'valid'))) {
            const dialogRef = this.dialog.open(CustomerSubscriptionDialogComponent, {
                width: '800px',
                disableClose: true,
                data: {
                    customer_id: this.editFormId,
                    customer_type: this.editCusType,
                    fixedrate: (this.editCusType != 4) ? this.fixedRate : 0
                }
            });
        
            dialogRef.afterClosed().subscribe(res => {
                this.getSubscriptions(this.editFormId);
            });
        }
    }

    editDialog(id: number, total_amount: number, registration_date: string, expiration_date: string, allowance_minute: string, subscriber_rate_option: string, excess_rate_option: string, status: string) {
        if (status == 'draft') {
            const dialogRef2 = this.dialog.open(CustomerSubscriptionDialogComponent, {
                width: '800px',
                disableClose: true,
                data: {
                    customer_id: this.editFormId,
                    customer_type: this.editCusType,
                    fixedrate: (this.editCusType != 4) ? this.fixedRate : 0,
                    total_amount: total_amount,
                    registration_date: registration_date,
                    expiration_date: expiration_date,
                    allowance_minute: allowance_minute,
                    subscriber_rate_option: subscriber_rate_option,
                    excess_rate_option: excess_rate_option,
                    editFormId: id,
                    editForm: true
                }
            });

            dialogRef2.afterClosed().subscribe(res => {
                this.getSubscriptions(this.editFormId);
            });
        }
    }

    deleteDialog(id: number, status: string) {
        if (status == 'draft') {
            Swal.fire({
                title: 'Are you sure?',
                text: 'The information will be deleted.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'No, not now.'
                }).then((result) => {
                if (result.value) {                
                    this.subscriptionService.delete(id)
                    .subscribe((subscriptions: any) => {
                        console.log(subscriptions);
                        this.getSubscriptions(this.editFormId);
                        Swal.fire(
                            'Success!',
                            'The information has been successfully deleted.',
                            'success'
                        )
                    }, error => { 
                        console.log(error);
                        // this.redirect();
                    });  
                }
            });  
        }      
    }

    updateDialog(id: number, status: string) {
        if (status == 'draft') {
            Swal.fire({
                title: 'Are you sure?',
                text: 'The status will be modifed.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, modify it!',
                cancelButtonText: 'No, not now.'
                }).then((result) => {
                if (result.value) {                
                    this.subscriptionService.modify(id)
                    .subscribe((subscriptions: any) => {
                        console.log(subscriptions);
                        this.getSubscriptions(this.editFormId);
                        Swal.fire(
                            'Success!',
                            'The status has been successfully modified.',
                            'success'
                        )
                    }, error => { 
                        console.log(error);
                        // this.redirect();
                    });  
                }
            });  
        }      
    }
    
}
