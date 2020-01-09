import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NavService } from '../../../services/nav.services'
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { User } from '../../../shared/user';
import { Role } from '../../../shared/role';
import { UserService } from '../../../services/users.services';
import { RoleService } from '../../../services/roles.services';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
    pageTitle: string;
    users: User[];
    roles: Role[];
    formErrors: any;
    isLoading = false;
    editForm = false;
    editFormId: number;
    statusFilter: any;
    searchFilter: any;
    hide = true;

    public UserForm: FormGroup;

    displayedColumns: string[] = ['id', 'username', 'fullname', 'roles', 'modified', 'status', 'commands'];
    dataSource = new MatTableDataSource(this.users);    
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

    constructor(
        public navService: NavService,
        private router: Router,
        private route: ActivatedRoute,
        private builder: FormBuilder,
        private userService: UserService,
        private roleService: RoleService
    ) { 
        let params = this.router.url;
        this.pageTitle = params.replace(/\//g, " "); 
        this.pageTitle = this.pageTitle.replace(/-/g, " ");    

        this.UserForm = this.builder.group({
            role_id: ['', Validators.required],
            email: ['', Validators.required],
            name: ['', Validators.required],
            password: ['', Validators.required]
        });

        this.formErrors = {
            role_id: {},
            email: {},
            name: {},
            password: {}
        };    
    }

    ngOnInit() {
        if (sessionStorage.credentials !== undefined) {
            this.getAllRoles();
            this.getAllUsers();
            this.UserForm.valueChanges.subscribe(() => {
                this.onFormValuesChanged();
            });
        } else {
            this.router.navigate([this.route.snapshot.queryParams.redirect || '/'], { replaceUrl: true });
        }
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
            
            const control = this.UserForm.get(field);
            if ( control && control.dirty && !control.valid )
            {
                this.formErrors[field] = control.errors;
            }
        }
    }

    redirect() {
        sessionStorage.clear();
        localStorage.clear();
        this.router.navigate(['/login'], { queryParams: { redirect: this.router.url }, replaceUrl: true });
    }
    
    resetForm() {
        this.getAllRoles();
        this.getAllUsers();
        this.editForm = false;
        this.editFormId = null;
        this.hide = true;
        this.UserForm.patchValue({
            role_id: '',
            email: '',
            name: '',
            password: ''
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

    displayTable() {
        this.activeForm = false;
        this.documentHeight = <HTMLElement> document.querySelector('.content-table');
        this.documentHeight = this.documentHeight.offsetHeight + 44.8;
        this.getAllUsers();
    }

    getAllRoles() {
        this.roleService.getAllRoles('all')
        .subscribe((roles: any) => {
            console.log(this.roles = roles.data);
        }, error => { 
            // this.redirect();
        });
    }

    getAllUsers() {
        this.userService.getAllUsers('all')
        .subscribe((users: any) => {
            console.log(this.users = users.data);
            this.dataSource = new MatTableDataSource(this.users);    
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
        }, error => { 
            // this.redirect();
        });
    }

    saveUser() {
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
                    this.userService.create(this.UserForm.value)
                    .subscribe((users: any) => {
                        console.log(users);
                        if (users.status == 'ok') {
                            this.editForm = true;
                            this.editFormId = users.data.id;
                        }
                        Swal.fire(
                            users.message.info,
                            users.message.text,
                            users.message.type
                        )
                    }, error => { 
                        console.log(error);
                        // this.redirect();
                    });
                } else {
                    this.userService.update(this.UserForm.value, this.editFormId)
                    .subscribe((users: any) => {
                        console.log(users);
                        Swal.fire(
                            users.message.info,
                            users.message.text,
                            users.message.type
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
        this.userService.find(id)
        .subscribe((users: any) => {
            console.log(users.data);
            this.editForm = true;
            this.editFormId = id;
            this.UserForm.patchValue({
                role_id: users.data[0].roles,
                email: users.data[0].email,
                name: users.data[0].name,
                password: users.data[0].password
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
}
