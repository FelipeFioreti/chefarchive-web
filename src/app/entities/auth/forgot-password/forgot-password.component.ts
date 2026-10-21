import {HttpErrorResponse, HttpStatusCode} from '@angular/common/http';
import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {NonNullableFormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {finalize} from 'rxjs';
import {AuthService} from "../../../core/services/auth.service";
import {ApiErrorResponse} from "../../../core/models/api-error.model";
import {AlertComponent} from "../../../shared/ui/atoms/alert/alert.component";
import {ButtonComponent} from "../../../shared/ui/atoms/button/button.component";
import {TextInputComponent} from "../../../shared/ui/atoms/text-input/text-input.component";
import {FormFieldComponent} from "../../../shared/ui/molecules/form-field/form-field.component";
import {AuthLayoutComponent} from "../../../shared/ui/templates/auth-layout/auth-layout.component";

function extractErrorMessage(error: HttpErrorResponse, translateService: TranslateService): string {
    if (error.status === HttpStatusCode.TooManyRequests) {
        return translateService.instant('auth.errors.tooManyRequests');
    }

    const payload = error.error as ApiErrorResponse | null;

    return payload?.message ?? translateService.instant('auth.forgotPassword.error');
}

@Component({
    selector: 'app-forgot-password',
    imports: [
        ReactiveFormsModule,
        TranslateModule,
        AuthLayoutComponent,
        FormFieldComponent,
        TextInputComponent,
        ButtonComponent,
        AlertComponent
    ],
    templateUrl: './forgot-password.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ForgotPasswordComponent {

    private readonly authService = inject(AuthService);
    private readonly translateService = inject(TranslateService);
    private readonly formBuilder = inject(NonNullableFormBuilder);

    protected readonly isSubmitting = signal(false);
    protected readonly errorMessage = signal('');
    protected readonly sentTo = signal('');
    protected readonly form = this.formBuilder.group({
        email: ['', [Validators.required, Validators.email]]
    });

    protected submit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const payload = this.form.getRawValue();

        this.isSubmitting.set(true);
        this.errorMessage.set('');

        this.authService
            .forgotPassword(payload)
            .pipe(finalize(() => this.isSubmitting.set(false)))
            .subscribe({
                next: () => {
                    this.sentTo.set(payload.email);
                },
                error: (error: HttpErrorResponse) => {
                    this.errorMessage.set(extractErrorMessage(error, this.translateService));
                }
            });
    }
}
