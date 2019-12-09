import { Component, HostBinding, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { VehicleService } from '../../../services/vehicles.services';
import { Vehicle } from '../../../shared/vehicle';
import { CustomerTypeService } from '../../../services/customer-types.services';
import { CustomerType } from '../../../shared/customer-type';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { NavItem } from '../../../shared/nav-item';
import { NavService } from '../../../services/nav.services'

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
    expanded: boolean;
    @HostBinding('attr.aria-expanded') ariaExpanded = this.expanded;
    items: NavItem;

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
        public navService: NavService,
        private router: Router,
        private route: ActivatedRoute,
        private vehicleService: VehicleService,
        private customertypeService: CustomerTypeService
    ) { 
        let params = this.router.url;
        this.pageTitle = params.replace(/\//g, " "); 
        this.pageTitle = this.pageTitle.replace(/-/g, " ");
        for (var i = 0; i < this.collection.count; i++) {
            this.collection.data.push(
            {
            id: i + 1,
            value: "items number " + (i + 1)
            }
            );
        }
    }

    ngOnDestroy(): void {}

    ngOnInit() {
        if (sessionStorage.credentials !== undefined) {
            this.getAllVehicles();
            this.getAllCustomerTypes();
        } else {
            this.router.navigate([this.route.snapshot.queryParams.redirect || '/login'], { replaceUrl: true });
        }
    }

    onPageChange(event){
        console.log(event);
        this.config.currentPage = event;
    }

    searchbar = true;
    toggleClass(searchbar: boolean) {
        searchbar = !false;
    }
    
    redirect() {
        sessionStorage.clear();
        localStorage.clear();
        this.router.navigate([this.route.snapshot.queryParams.redirect || '/login'], { replaceUrl: true });
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
        this.vehicleService.getAllVehicles()
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
}
