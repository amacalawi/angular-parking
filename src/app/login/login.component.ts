import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public LoginForm: FormGroup;
  formErrors: any;

  constructor(private builder: FormBuilder) { 
    this.LoginForm = this.builder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.formErrors = {
      email: {},
      password: {},
    };
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

  ngOnInit() {
    this.LoginForm.valueChanges.subscribe(() => {
      this.onFormValuesChanged();
    });
  }

}
