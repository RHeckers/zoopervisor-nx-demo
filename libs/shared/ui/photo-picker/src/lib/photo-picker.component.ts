import {
  Binding,
  ChangeDetectionStrategy,
  Component,
  OnInit,
  OutputEmitterRef,
  Signal,
  ViewContainerRef,
  inject,
  input,
  inputBinding,
  isSignal,
  output,
  outputBinding,
  reflectComponentType,
} from '@angular/core';
import { PHOTO_PICKER } from './contract';

/**
 * The placeholder. It renders whichever implementation the app registered for
 * PHOTO_PICKER, mirroring its own inputs/outputs onto it. Nothing in shared
 * imports an implementation, and no consumer threads a flag down.
 *
 * Uses ViewContainerRef.createComponent, NOT NgComponentOutlet: the outlet has
 * no `bindings` input in Angular, so binding through it is silently ignored and
 * the implementation renders with its own defaults.
 */
@Component({
  selector: 'zoo-photo-picker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ``,
})
export class PhotoPickerComponent implements OnInit {
  readonly multiple = input(false);
  readonly selected = output<File[]>();

  private readonly vcr = inject(ViewContainerRef);
  private readonly impl = inject(PHOTO_PICKER);

  ngOnInit(): void {
    this.vcr.createComponent(this.impl, { bindings: this.createBindings() });
  }

  private createBindings(): Binding[] {
    const mirror = reflectComponentType(this.impl);

    if (!mirror) {
      throw new Error('PHOTO_PICKER must be provided with a component type.');
    }

    const self = this as unknown as Record<string, unknown>;

    return [
      // Bind by templateName so an aliased input still works. Pass the signal
      // itself (already () => T) so the impl keeps receiving updates. The filter
      // guards against inputs the placeholder doesn't declare.
      ...mirror.inputs
        .filter(({ propName }) => isSignal(self[propName]))
        .map(({ propName, templateName }) =>
          inputBinding(templateName, self[propName] as Signal<unknown>),
        ),

      ...mirror.outputs
        .filter(({ propName }) => self[propName] instanceof OutputEmitterRef)
        .map(({ propName, templateName }) =>
          outputBinding(templateName, (value: unknown) =>
            (self[propName] as OutputEmitterRef<unknown>).emit(value),
          ),
        ),
    ];
  }
}
