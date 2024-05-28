import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/service/auth.service';


@Component({
    templateUrl: './register.component.html',
})
export class RegisterComponent implements OnInit{
    confirmed: boolean = false;

    constructor( private formBuilder: FormBuilder, private authService: AuthService ) {}

    ngOnInit(): void {
        this.authService.getCrsfToken().subscribe();
    }

    public formLogin: FormGroup = this.formBuilder.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]]
    });

}
