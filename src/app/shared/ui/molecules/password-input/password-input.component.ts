import { ChangeDetectionStrategy, Component, computed, forwardRef, input, signal } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { BaseControl } from '../../atoms/base-control/base-control.directive';
import { ButtonComponent } from '../../atoms/button/button.component';
import { InputDirective } from '../../atoms/input/input.directive';

@Component({
  selector: 'app-password-input',
  imports: [InputDirective, ButtonComponent, FaIconComponent, TranslateModule],
  templateUrl: './password-input.component.html',
  styleUrl: './password-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: BaseControl, useExisting: forwardRef(() => PasswordInputComponent) }],
  host: { class: 'd-block' }
})
export class PasswordInputComponent extends BaseControl<string> {
  readonly autocomplete = input('');
  readonly maxlength = input<number | null>(null);

  protected readonly value = signal('');
  protected readonly visible = signal(false);
  protected readonly toggleLabel = computed(() =>
    this.visible() ? 'global.action.hidePassword' : 'global.action.showPassword'
  );

  writeValue(value: string | null): void {
    this.value.set(value ?? '');
  }

  protected handleInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;

    this.value.set(value);
    this.onChange(value);
  }

  protected toggleVisibility(): void {
    this.visible.update((visible) => !visible);
  }
}
