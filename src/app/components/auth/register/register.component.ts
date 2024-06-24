import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { ProfileService } from 'src/app/service/profile.service';


@Component({
    templateUrl: './register.component.html',
})
export class RegisterComponent implements OnInit{
    confirmed: boolean = false;

    constructor( private formBuilder: FormBuilder, private authService: AuthService, private router: Router, private profileService: ProfileService ) {}

    ngOnInit(): void {
       
    }

    public formLogin: FormGroup = this.formBuilder.group({
        name: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        password_confirmation: ['', [Validators.required, Validators.minLength(8)]]

    });

   /*  ngAfterContentInit(): void {
      

        this.formLogin.valueChanges.subscribe((res) => {
            
            this.profileService.setformUserProfile(res);
            console.log('res',res)
        });
    } */

    navigateToLogin() {
        this.router.navigate([`/auth/login`]);
    }
    registerUser() {
        if (this.formLogin.valid) {
            this.profileService.registerUser(this.formLogin.value).subscribe(
                (res) => {
                    // Handle success, e.g., show a success message or navigate to another page
                   
                    this.navigateToLogin()
                },
                (error) => {
                    // Handle error, e.g., show an error message
                    console.error('Registration failed', error);
                }
            );
        } else {
            // Form is invalid, handle accordingly
            console.error('Form is invalid');
        }
    }


}
