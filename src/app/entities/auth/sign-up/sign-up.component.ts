import {HttpErrorResponse} from '@angular/common/http';
import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {NonNullableFormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {finalize} from 'rxjs';
import {ApiErrorResponse} from "../../../core/models/api-error.model";
import {NotificationService} from "../../../core/services/notification.service";
import {AuthService} from "../../../core/services/auth.service";
import {passwordMatchValidator} from "../../../shared/validators/password-match.validator";
import {AlertComponent} from "../../../shared/ui/atoms/alert/alert.component";
import {ButtonComponent} from "../../../shared/ui/atoms/button/button.component";
import {TextInputComponent} from "../../../shared/ui/atoms/text-input/text-input.component";
import {FormFieldComponent} from "../../../shared/ui/molecules/form-field/form-field.component";
import {AuthLayoutComponent} from "../../../shared/ui/templates/auth-layout/auth-layout.component";

function extractErrorMessage(error: HttpErrorResponse, translateService: TranslateService): string {
    const payload = error.error as ApiErrorResponse | null;

    return payload?.message ?? translateService.instant('auth.signUp.error');
}

@Component({
    selector: 'app-sign-up',
    imports: [
        ReactiveFormsModule,
        TranslateModule,
        AuthLayoutComponent,
        FormFieldComponent,
        TextInputComponent,
        ButtonComponent,
        AlertComponent
    ],
    templateUrl: './sign-up.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignUpComponent {

    private readonly notificationService = inject(NotificationService);
    private readonly translateService = inject(TranslateService);
    private readonly authService = inject(AuthService);
    private readonly formBuilder = inject(NonNullableFormBuilder);
    private readonly router = inject(Router);

    protected readonly isSubmitting = signal(false);
    protected readonly errorMessage = signal('');
    protected readonly form = this.formBuilder.group(
        {
            name: ['', [Validators.required, Validators.maxLength(255)]],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', [Validators.required]]
        },
        {validators: passwordMatchValidator}
    );

    protected submit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const {confirmPassword: _, ...payload} = this.form.getRawValue();

        this.isSubmitting.set(true);
        this.errorMessage.set('');

        this.authService
            .register(payload)
            .pipe(finalize(() => this.isSubmitting.set(false)))
            .subscribe({
                next: () => {
                    this.notificationService.success(
                        this.translateService.instant('auth.signUp.successTitle'),
                        this.translateService.instant('auth.signUp.successMessage')
                    );
                    void this.router.navigateByUrl('/auth/login');
                },
                error: (error: HttpErrorResponse) => {
                    this.errorMessage.set(extractErrorMessage(error, this.translateService));
                }
            });
    }
}
