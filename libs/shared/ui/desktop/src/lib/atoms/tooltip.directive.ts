import { Directive, computed, input, signal } from '@angular/core';
import { Pointer } from '../native/pointer';

/**
 * A hover-driven tooltip. Hover intent is a pointer concept — it has no meaning
 * on a touch screen — so this control is `platform:desktop`. It gates on the
 * fake desktop `Pointer` capability to underline the point. Styling comes from
 * the `.zoo-tooltip` rule in libs/shared/styles (directives have no stylesheet,
 * and inline style bindings in TS are banned).
 */
@Directive({
  selector: '[zooTooltip]',
  host: {
    class: 'zoo-tooltip',
    '[attr.title]': 'title()',
    '(mouseenter)': 'hovered.set(true)',
    '(mouseleave)': 'hovered.set(false)',
  },
})
export class TooltipDirective {
  readonly zooTooltip = input('');
  protected readonly hovered = signal(false);
  private readonly finePointer = Pointer.hasFinePointer();

  protected readonly title = computed(() =>
    this.finePointer ? this.zooTooltip() : '',
  );
}
