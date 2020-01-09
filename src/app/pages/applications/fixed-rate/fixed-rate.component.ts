import { Component, ViewChild, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NavService } from '../../../services/nav.services'
import { VehicleService } from '../../../services/vehicles.services';
import { Vehicle } from '../../../shared/vehicle';
import { FixedRateService } from '../../../services/fixedrates.services';
import { FixedRate } from '../../../shared/fixedrate';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-fixed-rate',
  templateUrl: './fixed-rate.component.html',
  styleUrls: ['./fixed-rate.component.scss']
})
export class FixedRateComponent implements OnInit {
    pageTitle: string;
    vehicles: Vehicle[];
    fixedrates: FixedRate[];
    formErrors: any;
    isLoading = false;
    editForm = false;
    editFormId: number;
    statusFilter: any;
    searchFilter: any;

    public FixedRateForm: FormGroup;

    displayedColumns: string[] = ['id', 'vehicle', 'validity', 'fixedrate', 'excess', 'modified', 'status', 'commands'];
    dataSource = new MatTableDataSource(this.fixedrates);    
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    
    constructor(
        public navService: NavService,
        private router: Router,
        private route: ActivatedRoute,
        private fixedrateService: FixedRateService,
        private vehicleService: VehicleService,
        private builder: FormBuilder
    ) {   
        let params = this.router.url;
        this.pageTitle = params.replace(/\//g, " "); 
        this.pageTitle = this.pageTitle.replace(/-/g, " ");    
        this.FixedRateForm = this.builder.group({
            vehicle_id: ['', Validators.required],
            validity_minute: ['', Validators.required],
            fixed_rate: ['', Validators.required],
            excess_rate_per_minute: ['', Validators.required],
            excess_rate_per_hour: ['', Validators.required]
        });

        this.formErrors = {
            vehicle_id: {},
            validity_minute: {},
            fixed_rate: {},
            excess_rate_per_minute: {},
            excess_rate_per_hour: {}
        };    
    }

    ngOnInit() {
        if (sessionStorage.credentials !== undefined) {
            this.getAllVehiclesNotFixedRate();
            this.getAllFixedRate();
            this.FixedRateForm.valueChanges.subscribe(() => {
                this.onFormValuesChanged();
            });
        } else {
            this.router.navigate([this.route.snapshot.queryParams.redirect || '/'], { replaceUrl: true });
        }
    }

    filteredDataSource() {
        let temp = this.fixedrates;
        if (this.statusFilter && this.searchFilter) {    
            temp = temp.filter(data => {
                return ((data.vehicle_name.toLowerCase().includes(this.searchFilter) || data.validity_minute.toString().includes(this.searchFilter) || data.fixed_rate.toString().includes(this.searchFilter) || data.excess_rate_per_minute.toString().includes(this.searchFilter)) && data.is_active == this.statusFilter);
            })            
        } else {
            if(this.statusFilter) {            
                temp = temp.filter(data => data.is_active == this.statusFilter);   
            }
            if(this.searchFilter) { 
                temp = temp.filter(data => {
                    return data.vehicle_name.toLowerCase().includes(this.searchFilter) || data.validity_minute.toString().includes(this.searchFilter) || data.fixed_rate.toString().includes(this.searchFilter) || data.excess_rate_per_minute.toString().includes(this.searchFilter);
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

    getAllVehiclesNotFixedRate() {
        this.vehicleService.getAllVehicles('not-fixed-rate')
        .subscribe((vehicles: any) => {
            console.log(this.vehicles = vehicles.data);
        }, error => { 
            // this.redirect();
        });
    }

    getAllFixedRate() {
        this.fixedrateService.getAllFixedRate('all')
        .subscribe((fixedrates: any) => {
            console.log(this.fixedrates = fixedrates.data);
            this.dataSource = new MatTableDataSource(this.fixedrates);    
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
        }, error => { 
            // this.redirect();
        });
    }

    resetForm() {
        this.getAllVehiclesNotFixedRate();
        this.getAllFixedRate();
        this.editForm = false;
        this.editFormId = null;
        this.FixedRateForm.patchValue({
            vehicle_id: '',
            validity_minute: '',
            fixed_rate: '',
            excess_rate_per_minute: '',
            excess_rate_per_hour: ''
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
        this.getAllVehiclesNotFixedRate();
    }

    onFormValuesChanged()
    {
        for ( const field in this.formErrors )
        {
            if ( !this.formErrors.hasOwnProperty(field) )
            {
                continue;
            }
            
            this.formErrors[field] = {};
            
            const control = this.FixedRateForm.get(field);
            if ( control && control.dirty && !control.valid )
            {
                this.formErrors[field] = control.errors;
            }
        }
    }

    filterVehicle(id: number): Promise <any> {
        return Promise.resolve((() => {
            this.vehicleService.filter(id)
            .subscribe((vehicles: any) => {
                console.log(this.vehicles = vehicles.data);
            }, error => { 
                this.redirect();
            });
            return this.vehicles;
        })());
    }

    editRow(id: number) {
        this.filterVehicle(id).then(data1 => {
            this.fixedrateService.find(id)
            .subscribe((fixedrates: any) => {
                console.log(fixedrates.data);
                this.editForm = true;
                this.editFormId = id;
                this.FixedRateForm.patchValue({
                    vehicle_id: fixedrates.data.vehicle_id,
                    validity_minute: fixedrates.data.validity_minute,
                    fixed_rate: fixedrates.data.fixed_rate,
                    excess_rate_per_minute: fixedrates.data.excess_rate_per_minute,
                    excess_rate_per_hour: fixedrates.data.excess_rate_per_hour
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
                this.fixedrateService.modify(id)
                .subscribe((fixedrates: any) => {
                    console.log(fixedrates);
                    this.getAllFixedRate();
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

    saveFixedRate() {
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
                    this.fixedrateService.create(this.FixedRateForm.value)
                    .subscribe((vehicles: any) => {
                        console.log(vehicles);
                    }, error => { 
                        console.log(error);
                        // this.redirect();
                    });
                } else {
                    this.fixedrateService.update(this.FixedRateForm.value, this.editFormId)
                    .subscribe((vehicles: any) => {
                        console.log(vehicles);
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
}
