import { AfterViewInit, ChangeDetectionStrategy, Component, computed, ElementRef, input, viewChild } from '@angular/core';
import { BaseControl } from '../base-control/base-control.directive';
import { InputDirective } from '../input/input.directive';

@Component({
  selector: 'app-number-input',
  imports: [InputDirective],
  templateUrl: './number-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'd-block' }
})
export class NumberInputComponent extends BaseControl<number | null> implements AfterViewInit {
  readonly min = input<number | null>(null);
  readonly max = input<number | null>(null);
  readonly step = input<number | 'any' | null>(null);

  protected readonly inputMode = computed(() => {
    const step = this.step();

    return step === null || Number.isInteger(step) ? 'numeric' : 'decimal';
  });

  private readonly field = viewChild<ElementRef<HTMLInputElement>>('field');

  // Escrito direto no elemento: um [value] apagaria entradas parciais como "1." ou "-".
  private writtenValue = '';

  ngAfterViewInit(): void {
    this.syncView();
  }

  writeValue(value: number | null): void {
    this.writtenValue = value === null || value === undefined ? '' : String(value);
    this.syncView();
  }

  protected handleInput(event: Event): void {
    const value = (event.target as HTMLInputElement).valueAsNumber;

    this.onChange(Number.isNaN(value) ? null : value);
  }

  private syncView(): void {
    const element = this.field()?.nativeElement;

    if (element) {
      element.value = this.writtenValue;
    }
  }
}
