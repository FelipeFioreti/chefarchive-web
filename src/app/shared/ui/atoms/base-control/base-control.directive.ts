import { AfterContentInit, booleanAttribute, computed, DestroyRef, Directive, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';

@Directive()
export abstract class BaseControl<T> implements ControlValueAccessor, AfterContentInit {
  readonly inputId = input('');
  readonly placeholder = input('');
  readonly readonly = input(false, { transform: booleanAttribute });
  readonly invalid = input<boolean | undefined>(undefined);

  private readonly generatedId = `app-control-${uuidv4()}`;
  readonly id = computed(() => this.inputId() || this.generatedId);

  protected readonly disabled = signal(false);
  private readonly controlInvalid = signal(false);
  protected readonly isInvalid = computed(() => this.invalid() ?? this.controlInvalid());

  private readonly ngControl = inject(NgControl, { self: true, optional: true });
  private readonly destroyRef = inject(DestroyRef);

  protected onChange: (value: T) => void = () => {};
  protected onTouched: () => void = () => {};

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  ngAfterContentInit(): void {
    const control = this.ngControl?.control;

    control?.events.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.controlInvalid.set(control.touched && control.invalid);
    });
  }

  abstract writeValue(value: T | null): void;

  registerOnChange(fn: (value: T) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }
}
