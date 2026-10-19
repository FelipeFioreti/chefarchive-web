import { ChangeDetectionStrategy, Component, computed, contentChild, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { NgControl } from '@angular/forms';
import { of, switchMap } from 'rxjs';

@Component({
  selector: 'app-form-field',
  templateUrl: './form-field.component.html',
  styleUrl: './form-field.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormFieldComponent {
  readonly label = input('');
  readonly for = input('');
  readonly error = input('');
  readonly hint = input('');

  private readonly ngControl = contentChild(NgControl, { descendants: true });

  private readonly controlEvent = toSignal(
    toObservable(this.ngControl).pipe(switchMap((ngControl) => ngControl?.control?.events ?? of(null)))
  );

  protected readonly showError = computed(() => {
    this.controlEvent();
    const ngControl = this.ngControl();

    return !!this.error() && !!ngControl?.touched && !!ngControl.invalid;
  });
}
