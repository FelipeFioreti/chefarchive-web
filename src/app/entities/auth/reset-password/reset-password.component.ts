import {HttpErrorResponse, HttpStatusCode} from '@angular/common/http';
import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {finalize} from 'rxjs';
import {AuthService} from "../../../core/services/auth.service";
import {NotificationService} from "../../../core/services/notification.service";
import {ApiErrorResponse} from "../../../core/models/api-error.model";
import {passwordMatchValidator} from "../../../shared/validators/password-match.validator";

function extractErrorMessage(error: HttpErrorResponse): string {
    if (error.status === HttpStatusCode.TooManyRequests) {
        return 'Muitas tentativas seguidas. Aguarde alguns minutos e tente novamente.';
    }

    if (error.status === HttpStatusCode.BadRequest) {
        return 'Este link e invalido, ja foi usado ou expirou. Solicite um novo link.';
    }

    const payload = error.error as ApiErrorResponse | null;

    return payload?.message ?? 'Nao foi possivel redefinir a senha.';
}

@Component({
    selector: 'app-reset-password',
    standalone: true,
    imports: [ReactiveFormsModule, RouterLink],
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResetPasswordComponent {

    readonly token = signal('');
    readonly isSubmitting = signal(false);
    readonly errorMessage = signal('');
    readonly form = this.formBuilder.nonNullable.group(
        {
            password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(255)]],
            confirmPassword: ['', [Validators.required]]
        },
        {validators: passwordMatchValidator}
    );

    public constructor(
        private notificationService: NotificationService,
        private authService: AuthService,
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router) {
        this.token.set(this.route.snapshot.queryParamMap.get('token') ?? '');

        // O token fica so em memoria: tira-lo da URL evita que ele permaneca no historico do navegador.
        if (this.token()) {
            void this.router.navigate([], {relativeTo: this.route, queryParams: {}, replaceUrl: true});
        }
    }

    submit(): void {
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
                    this.notificationService.success('Senha redefinida', 'Entre com a sua nova senha.');
                    void this.router.navigateByUrl('/auth/login');
                },
                error: (error: HttpErrorResponse) => {
                    this.errorMessage.set(extractErrorMessage(error));
                }
            });
    }
}
