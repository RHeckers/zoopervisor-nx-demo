import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Renders a keyboard-shortcut hint like ⌘K. Keyboard accelerators are a
 * desktop affordance — meaningless without a physical keyboard — so this is
 * `platform:desktop`.
 */
@Component({
  selector: 'zoo-key-hint',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<kbd class="zoo-key-hint">{{ keys() }}</kbd>`,
  styles: `
    .zoo-key-hint {
      font-family: var(--font-body);
      font-size: var(--font-size-caption);
      padding: 1px var(--spacer-xs);
      border: 1px solid var(--color-muted);
      border-bottom-width: 2px;
      border-radius: var(--spacer-xs);
      background: var(--color-paper);
      color: var(--color-muted);
    }
  `,
})
export class KeyHintComponent {
  readonly keys = input.required<string>();
}
