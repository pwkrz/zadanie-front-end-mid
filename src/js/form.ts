const NameRegexp = new RegExp(/^[a-zA-Z]{3,}$/);
const EmailRegexp = new RegExp(/^[a-zA-Z0-9_]+[a-zA-Z0-9_.+-]*@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]{2,}$/);
const PhoneRegexp = new RegExp(/^(\+48)?\d{3}-\d{3}-\d{3}$/);
const PasswordRegexp = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\+\-\~@$#!%*?&])[A-Za-z\d\+\-\~@$#!%*?&]{8,}$/);

const RegistrationForm: HTMLFormElement = <HTMLFormElement>document.getElementById('registrationForm');

const applyFormValidationClasses = (formControl: HTMLInputElement, isValid: boolean) => {
    if (isValid) {
        formControl.classList.remove('is-invalid');
        formControl.classList.add('is-valid');
    } else {
        formControl.classList.remove('is-valid');
        formControl.classList.add('is-invalid');
    }
}

const validateForm = (form: HTMLFormElement): Boolean => {
    let formControlArray = Array.from(form.elements) as HTMLInputElement[];
    let hasErrors = false;

    formControlArray.forEach(formControl => {
        let isValid: boolean;
        let val = formControl.value;

        switch(formControl.name) {
            case 'firstName':
            case 'lastName':
                isValid = NameRegexp.test(val);
                break;
            case 'email':
                isValid = EmailRegexp.test(val);
                break;
            case 'phone':
                isValid = PhoneRegexp.test(val);
                break;
            case 'password':
                isValid = PasswordRegexp.test(val);
                break;
        }
        if (!isValid) {
            hasErrors = true;
        }
        applyFormValidationClasses(formControl, isValid);
    })
    return !hasErrors;
}

RegistrationForm.addEventListener('submit', function(event) {
    if (validateForm(RegistrationForm) === false) {
        event.preventDefault();
        event.stopPropagation();
    } else {
        RegistrationForm.submit();
    }
}, false);