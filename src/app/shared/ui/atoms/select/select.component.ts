import { NgTemplateOutlet } from '@angular/common';
import { booleanAttribute, ChangeDetectionStrategy, Component, contentChild, input, signal, TemplateRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { BaseControl } from '../base-control/base-control.directive';
import { SelectOptionDirective } from './select-option.directive';

@Component({
  selector: 'app-select',
  imports: [FormsModule, NgSelectModule, NgTemplateOutlet],
  templateUrl: './select.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'd-block' }
})
export class SelectComponent<T = unknown> extends BaseControl<unknown> {
  readonly items = input<readonly T[]>([]);
  readonly bindLabel = input('');
  readonly bindValue = input('');
  readonly multiple = input(false, { transform: booleanAttribute });
  readonly searchable = input(false, { transform: booleanAttribute });
  readonly clearable = input(true, { transform: booleanAttribute });
  readonly appendTo = input('');

  protected readonly optionTemplate = contentChild(SelectOptionDirective, { read: TemplateRef });
  protected readonly value = signal<unknown>(null);

  writeValue(value: unknown): void {
    this.value.set(value ?? null);
  }

  protected handleChange(value: unknown): void {
    this.value.set(value);
    this.onChange(value);
  }
}
