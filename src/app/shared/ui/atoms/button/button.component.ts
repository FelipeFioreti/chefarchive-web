import { booleanAttribute, ChangeDetectionStrategy, Component, computed, ElementRef, inject, input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

export type ButtonVariant = 'primary' | 'outline-primary' | 'outline-secondary' | 'outline-danger' | 'link';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'button[appButton], a[appButton]',
  imports: [TranslateModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'btn',
    '[class]': 'variantClass()',
    '[class.btn-sm]': 'size() === "sm"',
    '[class.btn-lg]': 'size() === "lg"',
    '[class.w-100]': 'block()',
    '[class.disabled]': 'isAnchor && isDisabled()',
    '[attr.disabled]': '!isAnchor && isDisabled() ? "" : null',
    '[attr.aria-disabled]': 'isAnchor && isDisabled() ? "true" : null',
    '[attr.tabindex]': 'isAnchor && isDisabled() ? -1 : null',
    '[attr.aria-busy]': 'loading() ? "true" : null'
  }
})
export class ButtonComponent {
  readonly variant = input<ButtonVariant>('primary');
  readonly size = input<ButtonSize>('md');
  readonly block = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly loading = input(false, { transform: booleanAttribute });
  readonly loadingText = input('');

  protected readonly isDisabled = computed(() => this.disabled() || this.loading());
  protected readonly variantClass = computed(() => `btn-${this.variant()}`);
  protected readonly showLoadingText = computed(() => this.loading() && !!this.loadingText());

  protected readonly isAnchor = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement.tagName === 'A';
}
