import { Component, ViewChild, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NavService } from '../../../services/nav.services'
import { CustomerTypeService } from '../../../services/customer-types.services';
import { CustomerType } from '../../../shared/customer-type';
import { SubscriptionRateService } from '../../../services/subscriptionrates.services';
import { SubscriptionRate } from '../../../shared/subscriptionrate';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AmazingTimePickerService } from 'amazing-time-picker';
import Swal from 'sweetalert2';


@Component({
    selector: 'app-subcription-rate',
    templateUrl: './subcription-rate.component.html',
    styleUrls: ['./subcription-rate.component.scss']
})
export class SubcriptionRateComponent implements OnInit {
    pageTitle: string;
    customertypes: CustomerType[];
    subscriptionrates: SubscriptionRate[];
    formErrors: any;
    isLoading = false;
    editForm = false;
    editFormId: number;
    statusFilter: any;
    searchFilter: any;

    public SubscriptionRateForm: FormGroup;

    displayedColumns: string[] = ['id', 'customer_type', 'starting_period', 'ending_period', 'subscription_rate', 'excess_min', 'excess_hour', 'modified', 'status', 'commands'];
    dataSource = new MatTableDataSource(this.subscriptionrates);    
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    
    constructor(
        private atp: AmazingTimePickerService,
        public navService: NavService,
        private router: Router,
        private route: ActivatedRoute,
        private subscriptionrateService: SubscriptionRateService,
        private customerTypeService: CustomerTypeService,
        private builder: FormBuilder
    ) { 
        let params = this.router.url;
        this.pageTitle = params.replace(/\//g, " "); 
        this.pageTitle = this.pageTitle.replace(/-/g, " "); 
        this.SubscriptionRateForm = this.builder.group({
            customer_type_id: ['', Validators.required],
            starting_period: ['', Validators.required],
            ending_period: ['', Validators.required],
            subscription_rate: ['', Validators.required],
            excess_rate_per_minute: ['', Validators.required],
            excess_rate_per_hour: ['', Validators.required]
        });

        this.formErrors = {
            customer_type_id: {},
            starting_period: {},
            ending_period: {},
            subscription_rate: {},
            excess_rate_per_minute: {},
            excess_rate_per_hour: {}
        };    
    }
    
    ngOnInit() {
        if (sessionStorage.credentials !== undefined) {
            this.getAllCustomerTypeNotSubscriptionRate();
            this.getAllSubscriptionRate();
            // this.SubscriptionRateForm.valueChanges.subscribe(() => {
            //     this.onFormValuesChanged();
            // });
        } else {
            this.router.navigate([this.route.snapshot.queryParams.redirect || '/'], { replaceUrl: true });
        }
    }

    redirect() {
        sessionStorage.clear();
        localStorage.clear();
        this.router.navigate(['/login'], { queryParams: { redirect: this.router.url }, replaceUrl: true });
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

    resetForm() {
        this.getAllCustomerTypeNotSubscriptionRate();
        this.getAllSubscriptionRate();
        this.editForm = false;
        this.editFormId = null;
        this.SubscriptionRateForm.patchValue({
            customer_type_id: '',
            starting_period: '',
            ending_period: '',
            subscription_rate: '',
            excess_rate_per_minute: '',
            excess_rate_per_hour: ''
        });
    }

    getAllCustomerTypeNotSubscriptionRate() {
        this.customerTypeService.getAllCustomerTypes('not-rate')
        .subscribe((customertypes: any) => {
            console.log(this.customertypes = customertypes.data);
        }, error => { 
            // this.redirect();
        });
    }

    getAllSubscriptionRate() {
        this.subscriptionrateService.getAllSubscriptionRate('all')
        .subscribe((subscriptionrates: any) => {
            console.log(this.subscriptionrates = subscriptionrates.data);
            this.dataSource = new MatTableDataSource(this.subscriptionrates);    
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
        }, error => { 
            // this.redirect();
        });
    }

    filteredDataSource() {
        let temp = this.subscriptionrates;
        if (this.statusFilter && this.searchFilter) {    
            temp = temp.filter(data => {
                return ((data.customer_type.toLowerCase().includes(this.searchFilter) || data.starting_period.toString().includes(this.searchFilter) || data.ending_period.toString().includes(this.searchFilter) || data.excess_rate_per_minute.toString().includes(this.searchFilter) || data.excess_rate_per_hour.toString().includes(this.searchFilter) || data.subscription_rate.toString().includes(this.searchFilter)) && data.is_active == this.statusFilter);
            })            
        } else {
            if(this.statusFilter) {            
                temp = temp.filter(data => data.is_active == this.statusFilter);   
            }
            if(this.searchFilter) { 
                temp = temp.filter(data => {
                    return (data.customer_type.toLowerCase().includes(this.searchFilter) || data.starting_period.toString().includes(this.searchFilter) || data.ending_period.toString().includes(this.searchFilter) || data.excess_rate_per_minute.toString().includes(this.searchFilter) || data.excess_rate_per_hour.toString().includes(this.searchFilter) || data.subscription_rate.toString().includes(this.searchFilter));
                })
            }
        }

        this.dataSource = new MatTableDataSource(temp);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        return this.dataSource;
    }

    displayForm() {
        this.activeForm = true;
        this.documentHeight = <HTMLElement> document.querySelector('.content-form');
        this.documentHeight = this.documentHeight.offsetHeight + 44.8;
    }

    open() {
        const amazingTimePicker = this.atp.open();
        amazingTimePicker.afterClose().subscribe(time => {
          console.log(time);
        });
    }

    saveSubscriptionRate() {
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
                    this.subscriptionrateService.create(this.SubscriptionRateForm.value)
                    .subscribe((subscriptionrates: any) => {
                        this.editForm = true;
                        this.editFormId = subscriptionrates.data.id;
                        console.log(subscriptionrates);
                    }, error => { 
                        console.log(error);
                        // this.redirect();
                    });
                } else {
                    this.subscriptionrateService.update(this.SubscriptionRateForm.value, this.editFormId)
                    .subscribe((subscriptionrates: any) => {
                        console.log(subscriptionrates);
                    }, error => { 
                        console.log(error);
                        // this.redirect();
                    });
                }
                Swal.fire(
                    'Success!',
                    'The information has been successfully saved.',
                    'success'
                )
            }
        });        
    }

    filterVehicle(id: number): Promise <any> {
        return Promise.resolve((() => {
            this.customerTypeService.filter(id)
            .subscribe((customertypes: any) => {
                console.log(this.customertypes = customertypes.data);
            }, error => { 
                this.redirect();
            });
            return this.customertypes;
        })());
    }

    editRow(id: number) {
        this.filterVehicle(id).then(data1 => {
            this.subscriptionrateService.find(id)
            .subscribe((subscriptionrates: any) => {
                console.log(subscriptionrates.data);
                this.editForm = true;
                this.editFormId = id;
                this.SubscriptionRateForm.patchValue({
                    customer_type_id: subscriptionrates.data.customer_type_id,
                    starting_period: subscriptionrates.data.starting_period,
                    ending_period: subscriptionrates.data.ending_period,
                    subscription_rate: subscriptionrates.data.subscription_rate,
                    excess_rate_per_minute: subscriptionrates.data.excess_rate_per_minute,
                    excess_rate_per_hour: subscriptionrates.data.excess_rate_per_hour
                });
            }, error => { 
                this.redirect();
            });
            var overlaySpinner = <HTMLElement> document.querySelector('.overlay-spinner');
            overlaySpinner.classList.add('d-block');
            setTimeout(() => {
                overlaySpinner.classList.remove('d-block');
                this.displayForm();
            }, 500 + 300 * (Math.random() * 5));
        });
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
                this.subscriptionrateService.modify(id)
                .subscribe((fixedrates: any) => {
                    console.log(fixedrates);
                    this.getAllSubscriptionRate();
                    Swal.fire(
                        'Success!',
                        'the information has been successfully changed.',
                        'success'
                    )
                }, error => { 
                    this.redirect();
                });  
            }
        });        
    }
}
