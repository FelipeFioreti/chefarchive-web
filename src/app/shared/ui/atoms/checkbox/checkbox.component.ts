import { ChangeDetectionStrategy, Component, forwardRef, input, signal } from '@angular/core';
import { BaseControl } from '../base-control/base-control.directive';

export type CheckboxVariant = 'checkbox' | 'switch';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: BaseControl, useExisting: forwardRef(() => CheckboxComponent) }],
  host: { class: 'd-block' }
})
export class CheckboxComponent extends BaseControl<boolean> {
  readonly variant = input<CheckboxVariant>('checkbox');

  protected readonly checked = signal(false);

  writeValue(value: boolean | null): void {
    this.checked.set(!!value);
  }

  protected handleChange(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;

    this.checked.set(checked);
    this.onChange(checked);
  }
}
