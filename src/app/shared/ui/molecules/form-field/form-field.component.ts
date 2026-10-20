import { booleanAttribute, ChangeDetectionStrategy, Component, computed, contentChild, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { NgControl, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { of, switchMap } from 'rxjs';
import { BaseControl } from '../../atoms/base-control/base-control.directive';

@Component({
  selector: 'app-form-field',
  imports: [TranslateModule],
  templateUrl: './form-field.component.html',
  styleUrl: './form-field.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormFieldComponent {
  readonly label = input('');
  readonly for = input('');
  readonly error = input('');
  readonly hint = input('');
  // Por padrão vem do Validators.required do controle; informe só para sobrescrever.
  readonly required = input<boolean | undefined, unknown>(undefined, {
    transform: (value: unknown) => (value === undefined ? undefined : booleanAttribute(value))
  });

  private readonly ngControl = contentChild(NgControl, { descendants: true });
  private readonly control = contentChild(BaseControl, { descendants: true });

  private readonly controlEvent = toSignal(
    toObservable(this.ngControl).pipe(switchMap((ngControl) => ngControl?.control?.events ?? of(null)))
  );

  protected readonly labelFor = computed(() => this.for() || this.control()?.id() || null);

  protected readonly isRequired = computed(() => {
    this.controlEvent();

    return this.required() ?? !!this.ngControl()?.control?.hasValidator(Validators.required);
  });

  protected readonly showError = computed(() => {
    this.controlEvent();
    const ngControl = this.ngControl();

    return !!ngControl?.touched && !!ngControl.invalid;
  });

  protected readonly hasRequiredError = computed(() => {
    this.controlEvent();

    return !!this.ngControl()?.hasError('required');
  });
}
