import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { NavService } from '../../../services/nav.services'
import { VehicleService } from '../../../services/vehicles.services';
import { Vehicle } from '../../../shared/vehicle';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.scss']
})
export class VehiclesComponent implements OnInit {
    pageTitle: string;
    vehicles: Vehicle[];

    displayedColumns: string[] = ['id', 'code', 'name', 'description', 'created_at', 'status', 'commands'];
    dataSource = new MatTableDataSource(this.vehicles);    
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    
    constructor(
        public navService: NavService,
        private router: Router,
        private route: ActivatedRoute,
        private vehicleService: VehicleService
    ) {   
        let params = this.router.url;
        this.pageTitle = params.replace(/\//g, " "); 
        this.pageTitle = this.pageTitle.replace(/-/g, " ");        
    }

    ngOnInit() {
        this.getAllVehicles();
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
            this.dataSource = new MatTableDataSource(this.vehicles);    
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
        }, error => { 
            this.redirect();
        });
    }

    displayForm() {
        this.activeForm = true;
        this.documentHeight = <HTMLElement> document.querySelector('.content-form');
        this.documentHeight = this.documentHeight.offsetHeight + 44.8;
    }

    editRow(id: number) {
        var overlaySpinner = <HTMLElement> document.querySelector('.overlay-spinner');
        overlaySpinner.classList.add("d-block");
        setTimeout(() => {
            overlaySpinner.classList.remove("d-block");
            this.displayForm();
        }, 500 + 300 * (Math.random() * 5));
    }

    deleteRow(id: number) {
        console.log('delete: ' + id);
    }
}
