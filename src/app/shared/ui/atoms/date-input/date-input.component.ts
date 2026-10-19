import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, input, viewChild } from '@angular/core';
import { BaseControl } from '../base-control/base-control.directive';
import { InputDirective } from '../input/input.directive';

// Valor no formato ISO do input nativo: 'yyyy-MM-dd'.
@Component({
  selector: 'app-date-input',
  imports: [InputDirective],
  templateUrl: './date-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'd-block' }
})
export class DateInputComponent extends BaseControl<string | null> implements AfterViewInit {
  readonly min = input<string | null>(null);
  readonly max = input<string | null>(null);

  private readonly field = viewChild<ElementRef<HTMLInputElement>>('field');

  // Escrito direto no elemento: um [value] apagaria a data enquanto ela é digitada parcialmente.
  private writtenValue = '';

  ngAfterViewInit(): void {
    this.syncView();
  }

  writeValue(value: string | null): void {
    this.writtenValue = value ?? '';
    this.syncView();
  }

  protected handleInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;

    this.onChange(value || null);
  }

  private syncView(): void {
    const element = this.field()?.nativeElement;

    if (element) {
      element.value = this.writtenValue;
    }
  }
}
