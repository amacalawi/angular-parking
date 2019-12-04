import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { VehicleService } from '../../services/vehicles.services';
import { Vehicle } from '../../shared/vehicle';
import { CustomerTypeService } from '../../services/customer-types.services';
import { CustomerType } from '../../shared/customer-type';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {

    collection = { count: 60, data: [] };
    config = {
        itemsPerPage: 5,
        currentPage: 1,
        totalItems: this.collection.count
    };  

    public maxSize: number = 7;
    public directionLinks: boolean = true;
    public autoHide: boolean = false;
    public responsive: boolean = true;
    public labels: any = {
        previousLabel: '',
        nextLabel: '',
        screenReaderPaginationLabel: 'Pagination',
        screenReaderPageLabel: 'page',
        screenReaderCurrentLabel: `You're on page`
    };

    vehicles: Vehicle[];
    customertypes: CustomerType[];

    constructor(
        private router: Router,
        private vehicleService: VehicleService,
        private customertypeService: CustomerTypeService,
    ) { 
        for (var i = 0; i < this.collection.count; i++) {
            this.collection.data.push(
            {
            id: i + 1,
            value: "items number " + (i + 1)
            }
            );
        }
    }

    ngOnInit() {
        this.getAllVehicles();
        this.getAllCustomerTypes();
    }

    onPageChange(event){
        console.log(event);
        this.config.currentPage = event;
    }

    opened = false;
    log(state: any) {
        console.log(state)
    }

    opened2 = false;
    log2(state: any) {
        console.log(state)
    }

    searchbar = true;
    toggleClass(searchbar: boolean) {
        searchbar = !false;
    }

    goTo(link: string) {
        setTimeout(() => {
            this.router.navigate(['/' + link]);
        }, 300);
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

    logout() {
        sessionStorage.clear();
        localStorage.clear();
        this.router.navigate(['/login']);
    }

    getAllVehicles() {
        this.vehicleService.getAllVehicles()
        .pipe(
            map(data => data)
        ).subscribe((vehicles: any) => {
            console.log(this.vehicles = vehicles.data);
        }, error => { console.log(error) });
    }

    getAllCustomerTypes() {
        this.customertypeService.getAllCustomerTypes()
        .pipe(
            map(data => data)
        ).subscribe((customertypes: any) => {
            console.log(this.customertypes = customertypes.data);
        }, error => { console.log(error) });
    }
}
