import {HttpErrorResponse, HttpStatusCode} from '@angular/common/http';
import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {NonNullableFormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {finalize} from 'rxjs';
import {AuthService} from "../../../core/services/auth.service";
import {NotificationService} from "../../../core/services/notification.service";
import {ApiErrorResponse} from "../../../core/models/api-error.model";
import {passwordMatchValidator} from "../../../shared/validators/password-match.validator";
import {AlertComponent} from "../../../shared/ui/atoms/alert/alert.component";
import {ButtonComponent} from "../../../shared/ui/atoms/button/button.component";
import {PasswordInputComponent} from "../../../shared/ui/molecules/password-input/password-input.component";
import {FormFieldComponent} from "../../../shared/ui/molecules/form-field/form-field.component";
import {AuthLayoutComponent} from "../../../shared/ui/templates/auth-layout/auth-layout.component";

function extractErrorMessage(error: HttpErrorResponse, translateService: TranslateService): string {
    if (error.status === HttpStatusCode.TooManyRequests) {
        return translateService.instant('auth.errors.tooManyRequests');
    }

    if (error.status === HttpStatusCode.BadRequest) {
        return translateService.instant('auth.resetPassword.expiredLink');
    }

    const payload = error.error as ApiErrorResponse | null;

    return payload?.message ?? translateService.instant('auth.resetPassword.error');
}

@Component({
    selector: 'app-reset-password',
    imports: [
        ReactiveFormsModule,
        RouterLink,
        TranslateModule,
        AuthLayoutComponent,
        FormFieldComponent,
        PasswordInputComponent,
        ButtonComponent,
        AlertComponent
    ],
    templateUrl: './reset-password.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResetPasswordComponent {

    private readonly notificationService = inject(NotificationService);
    private readonly translateService = inject(TranslateService);
    private readonly authService = inject(AuthService);
    private readonly formBuilder = inject(NonNullableFormBuilder);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);

    protected readonly token = signal(this.route.snapshot.queryParamMap.get('token') ?? '');
    protected readonly isSubmitting = signal(false);
    protected readonly errorMessage = signal('');
    protected readonly form = this.formBuilder.group(
        {
            password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(255)]],
            confirmPassword: ['', [Validators.required]]
        },
        {validators: passwordMatchValidator}
    );

    public constructor() {
        // O token fica so em memoria: tira-lo da URL evita que ele permaneca no historico do navegador.
        if (this.token()) {
            void this.router.navigate([], {relativeTo: this.route, queryParams: {}, replaceUrl: true});
        }
    }

    protected submit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        this.isSubmitting.set(true);
        this.errorMessage.set('');

        this.authService
            .resetPassword({token: this.token(), newPassword: this.form.getRawValue().password})
            .pipe(finalize(() => this.isSubmitting.set(false)))
            .subscribe({
                next: () => {
                    this.authService.clearSession();
                    this.notificationService.success(
                        this.translateService.instant('auth.resetPassword.successTitle'),
                        this.translateService.instant('auth.resetPassword.successMessage')
                    );
                    void this.router.navigateByUrl('/auth/login');
                },
                error: (error: HttpErrorResponse) => {
                    this.errorMessage.set(extractErrorMessage(error, this.translateService));
                }
            });
    }
}
