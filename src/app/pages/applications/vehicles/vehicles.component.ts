import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NavService } from '../../../services/nav.services'
import { VehicleService } from '../../../services/vehicles.services';
import { Vehicle } from '../../../shared/vehicle';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.scss']
})
export class VehiclesComponent implements OnInit {
    pageTitle: string;
    vehicles: Vehicle[];
    public VehicleForm: FormGroup;
    formErrors: any;
    isLoading = false;
    editForm = false;
    editFormId: number;
    statusFilter: any;
    searchFilter: any;

    displayedColumns: string[] = ['id', 'code', 'name', 'description', 'created_at', 'status', 'commands'];
    dataSource = new MatTableDataSource(this.vehicles);    
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    
    constructor(
        public navService: NavService,
        private router: Router,
        private route: ActivatedRoute,
        private vehicleService: VehicleService,
        private builder: FormBuilder
    ) {   
        let params = this.router.url;
        this.pageTitle = params.replace(/\//g, " "); 
        this.pageTitle = this.pageTitle.replace(/-/g, " ");    
        this.VehicleForm = this.builder.group({
            code: ['', Validators.required],
            name: ['', Validators.required],
            description: ['', ''],
        });

        this.formErrors = {
            code: {},
            name: {},
            description: {}
        };    
    }

    ngOnInit() {
        if (sessionStorage.credentials !== undefined) {
            this.getAllVehicles();
            this.VehicleForm.valueChanges.subscribe(() => {
                this.onFormValuesChanged();
            });
        } else {
            this.router.navigate([this.route.snapshot.queryParams.redirect || '/'], { replaceUrl: true });
        }
    }

    filteredDataSource() {
        let temp = this.vehicles;
        if (this.statusFilter && this.searchFilter) {    
            temp = temp.filter(data => {
                return ((data.code.toLowerCase().includes(this.searchFilter) || data.name.toLowerCase().includes(this.searchFilter) || data.description.toLowerCase().includes(this.searchFilter)) && data.is_active == this.statusFilter);
            })            
        } else {
            if(this.statusFilter) {            
                temp = temp.filter(data => data.is_active == this.statusFilter);   
            }
            if(this.searchFilter) { 
                temp = temp.filter(data => {
                    return (data.code.toLowerCase().includes(this.searchFilter) || data.name.toLowerCase().includes(this.searchFilter) || data.description.toLowerCase().includes(this.searchFilter));
                })
            }
        }

        this.dataSource = new MatTableDataSource(temp);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        return this.dataSource;
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

    getAllVehicles() {
        this.vehicleService.getAllVehicles('all')
        .subscribe((vehicles: any) => {
            console.log(this.vehicles = vehicles.data);
            this.dataSource = new MatTableDataSource(this.vehicles);    
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
        }, error => { 
            this.redirect();
        });
    }

    resetForm() {
        this.getAllVehicles();
        this.editForm = false;
        this.editFormId = null;
        this.VehicleForm.patchValue({
            code: '',
            name: '',
            description: ''
        });
    }

    displayForm() {
        this.activeForm = true;
        this.documentHeight = <HTMLElement> document.querySelector('.content-form');
        this.documentHeight = this.documentHeight.offsetHeight + 44.8;
    }

    displayTable() {
        this.activeForm = false;
        this.documentHeight = <HTMLElement> document.querySelector('.content-table');
        this.documentHeight = this.documentHeight.offsetHeight + 44.8;
    }

    onFormValuesChanged()
    {
        for ( const field in this.formErrors )
        {
            if ( !this.formErrors.hasOwnProperty(field) )
            {
                continue;
            }
            // Clear previous errors
            this.formErrors[field] = {};
            // Get the control
            const control = this.VehicleForm.get(field);
            if ( control && control.dirty && !control.valid )
            {
                this.formErrors[field] = control.errors;
            }
        }
    }

    editRow(id: number) {        
        this.vehicleService.find(id)
        .subscribe((vehicles: any) => {
            console.log(vehicles.data);
            this.editForm = true;
            this.editFormId = id;
            this.VehicleForm.patchValue({
                code: vehicles.data.code,
                name: vehicles.data.name,
                description: vehicles.data.description
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
    }

    deleteRow(id: number) {
        console.log('delete: ' + id);
    }

    saveVehicle() {
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
                    this.vehicleService.create(this.VehicleForm.value)
                    .subscribe((vehicles: any) => {
                        console.log(vehicles);
                    }, error => { 
                        console.log(error);
                        // this.redirect();
                    });
                } else {
                    this.vehicleService.update(this.VehicleForm.value, this.editFormId)
                    .subscribe((vehicles: any) => {
                        console.log(vehicles);
                    }, error => { 
                        console.log(error);
                        // this.redirect();
                    });
                }
                Swal.fire(
                    'Success!',
                    'All stored items has been reset successfully.',
                    'success'
                )
            }
        });        
    }
}
