import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { BaseControl } from '../base-control/base-control.directive';

export type CheckboxVariant = 'checkbox' | 'switch';

let nextId = 0;

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'd-block' }
})
export class CheckboxComponent extends BaseControl<boolean> {
  readonly variant = input<CheckboxVariant>('checkbox');

  protected readonly checked = signal(false);

  // O label fica dentro do componente, então sempre precisa de um id.
  private readonly generatedId = `app-checkbox-${nextId++}`;
  protected readonly id = computed(() => this.inputId() || this.generatedId);

  writeValue(value: boolean | null): void {
    this.checked.set(!!value);
  }

  protected handleChange(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;

    this.checked.set(checked);
    this.onChange(checked);
  }
}
