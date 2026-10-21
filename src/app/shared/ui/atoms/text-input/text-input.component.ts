import { ChangeDetectionStrategy, Component, forwardRef, input, signal } from '@angular/core';
import { BaseControl } from '../base-control/base-control.directive';
import { InputDirective } from '../input/input.directive';

export type TextInputType = 'text' | 'email' | 'password' | 'search' | 'tel' | 'url';

@Component({
  selector: 'app-text-input',
  imports: [InputDirective],
  templateUrl: './text-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: BaseControl, useExisting: forwardRef(() => TextInputComponent) }],
  host: { class: 'd-block' }
})
export class TextInputComponent extends BaseControl<string> {
  readonly type = input<TextInputType>('text');
  readonly autocomplete = input('');
  readonly maxlength = input<number | null>(null);

  protected readonly value = signal('');

  writeValue(value: string | null): void {
    this.value.set(value ?? '');
  }

  protected handleInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;

    this.value.set(value);
    this.onChange(value);
  }
}
