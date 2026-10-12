import {HttpErrorResponse, HttpStatusCode} from '@angular/common/http';
import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {finalize} from 'rxjs';
import {AuthService} from "../../../core/services/auth.service";
import {ApiErrorResponse} from "../../../core/models/api-error.model";

function extractErrorMessage(error: HttpErrorResponse): string {
    if (error.status === HttpStatusCode.TooManyRequests) {
        return 'Muitas tentativas seguidas. Aguarde alguns minutos e tente novamente.';
    }

    const payload = error.error as ApiErrorResponse | null;

    return payload?.message ?? 'Nao foi possivel enviar o link de redefinicao.';
}

@Component({
    selector: 'app-forgot-password',
    standalone: true,
    imports: [ReactiveFormsModule, RouterLink],
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ForgotPasswordComponent {

    readonly isSubmitting = signal(false);
    readonly errorMessage = signal('');
    readonly sentTo = signal('');
    readonly form = this.formBuilder.nonNullable.group({
        email: ['', [Validators.required, Validators.email]]
    });

    public constructor(
        private authService: AuthService,
        private formBuilder: FormBuilder) {
    }

    submit(): void {
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
                    this.errorMessage.set(extractErrorMessage(error));
                }
            });
    }
}
