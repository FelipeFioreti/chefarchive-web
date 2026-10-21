import { booleanAttribute, ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  imports: [RouterLink],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthLayoutComponent {
  readonly headerText = input.required<string>();
  readonly title = input.required<string>();
  readonly footerText = input('');
  readonly footerLinkLabel = input('');
  readonly footerLink = input('');
  readonly wide = input(false, { transform: booleanAttribute });
}
