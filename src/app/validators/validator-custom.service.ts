import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';

@Injectable({
    providedIn: 'root',
})
export class ValidatorCustomService {

    passwordMatchValidator(password: string, confirmPassword:string){
        return ((control: AbstractControl): ValidationErrors | null => {
            return control.value[password] === control.value[confirmPassword] ? null : { passwordMismatch: true };
        });
    }

   
    confirmPasswordValidator(control: AbstractControl): ValidationErrors | null {
        if (!control || !control.parent) {
            return null;
        }

        const password = control.parent.get('password');
        const confirmation = control;

        if (!password || !confirmation) {
            return null;
        }

        if (confirmation.value !== password.value) {
            return { passwordsDontMatch: true };
        }

        return null;
    }

 /*    endDateValidator(startDateField: string, endDateField: string) {
        return (control: AbstractControl): ValidationErrors | null => {
            if (!control) {
                return null;
            }

            let startDate = control.get(startDateField)?.value;
            let endDate = control.get(endDateField)?.value;

            if (endDate && startDate) {
                if (endDate < startDate) {
                    return { invalidEndDate: true };
                }
            }

            return null;
        };
    }

    valueLessThanZero(control: AbstractControl) {
        if (
            control.value !== null &&
            control.value !== undefined &&
            control.value <= 0
        ) {
            return { valueLessThanZero: true };
        }
        return null;
    } */

    arrayFromIdValidator(control: AbstractControl): ValidationErrors | null {
        const value = control.value;
        if (value !== null && value !== undefined) {
          // Transforma o valor em um array de inteiros
          const intArray = [parseInt(value, 10)];
          console.log('Array de inteiros:', intArray); // Apenas para depuração
          // Aqui você pode armazenar ou usar o array conforme necessário
          return { arrayResult: intArray }; // Retorna o array no objeto de erros de validação (se necessário)
        }
        return null; // Retorna nulo se não houver erro
      }
}
