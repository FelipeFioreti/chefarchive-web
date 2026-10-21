import {HttpErrorResponse} from '@angular/common/http';
import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {NonNullableFormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {finalize} from 'rxjs';
import {AuthService} from "../../../core/services/auth.service";
import {ApiErrorResponse} from "../../../core/models/api-error.model";
import {AlertComponent} from "../../../shared/ui/atoms/alert/alert.component";
import {ButtonComponent} from "../../../shared/ui/atoms/button/button.component";
import {TextInputComponent} from "../../../shared/ui/atoms/text-input/text-input.component";
import {PasswordInputComponent} from "../../../shared/ui/molecules/password-input/password-input.component";
import {FormFieldComponent} from "../../../shared/ui/molecules/form-field/form-field.component";
import {AuthLayoutComponent} from "../../../shared/ui/templates/auth-layout/auth-layout.component";

function extractErrorMessage(error: HttpErrorResponse, translateService: TranslateService): string {
    const payload = error.error as ApiErrorResponse | null;

    return payload?.message ?? translateService.instant('auth.login.error');
}

@Component({
    selector: 'app-sign-in',
    imports: [
        ReactiveFormsModule,
        RouterLink,
        TranslateModule,
        AuthLayoutComponent,
        FormFieldComponent,
        TextInputComponent,
        PasswordInputComponent,
        ButtonComponent,
        AlertComponent
    ],
    templateUrl: './login.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {

    private readonly authService = inject(AuthService);
    private readonly translateService = inject(TranslateService);
    private readonly formBuilder = inject(NonNullableFormBuilder);
    private readonly router = inject(Router);

    protected readonly isSubmitting = signal(false);
    protected readonly errorMessage = signal('');
    protected readonly form = this.formBuilder.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]]
    });

    protected submit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        this.isSubmitting.set(true);
        this.errorMessage.set('');

        this.authService
            .login(this.form.getRawValue())
            .pipe(finalize(() => this.isSubmitting.set(false)))
            .subscribe({
                next: () => {
                    void this.router.navigateByUrl('/app/home');
                },
                error: (error: HttpErrorResponse) => {
                    this.errorMessage.set(extractErrorMessage(error, this.translateService));
                }
            });
    }
}
