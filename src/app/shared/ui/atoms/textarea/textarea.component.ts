import { booleanAttribute, ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { BaseControl } from '../base-control/base-control.directive';
import { InputDirective } from '../input/input.directive';

@Component({
  selector: 'app-textarea',
  imports: [InputDirective],
  templateUrl: './textarea.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'd-block' }
})
export class TextareaComponent extends BaseControl<string> {
  readonly rows = input(3);
  readonly maxlength = input<number | null>(null);
  readonly showCount = input(false, { transform: booleanAttribute });

  protected readonly value = signal('');

  writeValue(value: string | null): void {
    this.value.set(value ?? '');
  }

  protected handleInput(event: Event): void {
    const value = (event.target as HTMLTextAreaElement).value;

    this.value.set(value);
    this.onChange(value);
  }
}
