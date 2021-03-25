const RegistrationForm: HTMLFormElement = <HTMLFormElement>document.getElementById('registrationForm');

const validateForm = (form: HTMLFormElement): Boolean => {
    Array.from(<HTMLFormControlsCollection>(form.elements)).forEach((formControl: any) => {
        console.log(formControl['name']);
        switch(formControl['name']) {
            case 'firstName':
                break;
            case 'lastName':
                break;
            case 'email':
                break;
            case 'phone':
                break;
            case 'password':
                break;
        }
    })
    return false;
}

RegistrationForm.addEventListener('submit', function(event) {
    if (validateForm(RegistrationForm) === false) {
        event.preventDefault();
        event.stopPropagation();
    }
    RegistrationForm.classList.add('was-validated');
}, false);