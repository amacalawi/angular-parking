import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { AuthenticationService, untilDestroyed } from '../core';
import { CredentialsService } from '../core/authentication/credentials.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

    error: string | undefined;
    public LoginForm: FormGroup;
    formErrors: any;
    isLoading = false;
    hide = true;

    constructor(
        private credentialsService: CredentialsService,
        private router: Router,
        private route: ActivatedRoute,
        private builder: FormBuilder,
        private authenticationService: AuthenticationService,
    ) { 
        this.LoginForm = this.builder.group({
            username: ['', Validators.required],
            password: ['', Validators.required],
            rememeber: true
        });

        this.formErrors = {
            username: {},
            password: {},
        };
    }

    ngOnDestroy() {}

    ngOnInit() {
        if (sessionStorage.credentials !== undefined) {
            this.router.navigate([this.route.snapshot.queryParams.redirect || '/'], { replaceUrl: true });
        } else {
            // this.LoginForm.valueChanges.subscribe(() => {
            //     this.onFormValuesChanged();
            // });
        }
    }

    login() {
        this.isLoading = true;
        const login$ = this.authenticationService.login(this.LoginForm.value);
        login$
            .pipe(
                finalize(() => {
                    this.LoginForm.markAsPristine();
                    this.isLoading = false;
                }),
                untilDestroyed(this)
                )
            .subscribe(
                () => {
                    this.router.navigate([this.route.snapshot.queryParams.redirect || '/dashboard'], { replaceUrl: true });
                },
                error => {
                    //log.debug(`Login error: ${error}`);
                    this.error = error;
                    console.log(error);
                    //   this.errorNotif();
                }
            );
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
            const control = this.LoginForm.get(field);
            if ( control && control.dirty && !control.valid )
            {
                this.formErrors[field] = control.errors;
            }
        }
    }

}
