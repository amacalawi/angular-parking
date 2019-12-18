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
import { NavService } from '../../../services/nav.services';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

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
    typeFilter: any;
    vehicleFilter: any;
    statusFilter: any;
    searchFilter: any;

    displayedColumns: string[] = ['rfid', 'fullname', 'gender', 'type', 'vehicle', 'modified_at', 'status', 'commands'];
    dataSource = new MatTableDataSource(this.customers);    
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

    constructor(
        public navService: NavService,
        private router: Router,
        private route: ActivatedRoute,
        private vehicleService: VehicleService,
        private customertypeService: CustomerTypeService,
        private customerService: CustomerService
    ) { 
        this.pageURL = this.router.url;
        let params = this.router.url;
        this.pageTitle = params.replace(/\//g, " "); 
        this.pageTitle = this.pageTitle.replace(/-/g, " ");         
    }

    ngOnDestroy(): void {}

    ngOnInit() {
        if (sessionStorage.credentials !== undefined) {
            this.getAllVehicles();
            this.getAllCustomerTypes();
            this.getAllCustomers();
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
        } else {
            this.documentHeight = <HTMLElement> document.querySelector('.content-form');
            this.documentHeight = this.documentHeight.offsetHeight + 44.8;
        }
        activeForm = !false;
    }

    getAllVehicles() {
        this.vehicleService.getAllVehicles('active')
        .pipe(
            map(data => data)
        ).subscribe((vehicles: any) => {
            console.log(this.vehicles = vehicles.data);
        }, error => { 
            this.redirect();
        });
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

    filteredDataSource() {
        let temp = this.customers;
        // if (this.statusFilter && this.searchFilter) {    
        //     temp = temp.filter(data => {
        //         return ((data.vehicle_name.toLowerCase().includes(this.searchFilter) || data.validity_minute.toString().includes(this.searchFilter) || data.fixed_rate.toString().includes(this.searchFilter) || data.excess_rate_per_minute.toString().includes(this.searchFilter)) && data.is_active == this.statusFilter);
        //     })            
        // } else {
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
        // }

        this.dataSource = new MatTableDataSource(temp);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        return this.dataSource;
    }

    getAllCustomers() {
        this.customerService.getAllCustomers('all')
        .pipe(
            map(data => data)
        ).subscribe((customers: any) => {
            console.log(this.customers = customers.data);
            this.dataSource = new MatTableDataSource(this.customers);    
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
        }, error => { 
            this.redirect();
        });
    }
}
