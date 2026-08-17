import {
  Binding,
  Component,
  inject,
  input,
  inputBinding,
  isSignal,
  OnInit,
  OutputEmitterRef,
  output,
  outputBinding,
  reflectComponentType,
  Signal,
  ViewContainerRef,
} from '@angular/core';

import { PHOTO_PICKER } from './photo-picker.contract';

@Component({
  selector: 'lib-photo-picker',
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
      // A signal is already a `() => value`, so it can be passed straight in.
      // The filter skips inputs the implementation declares but we don't.
      ...mirror.inputs
        .filter(({ propName }) => isSignal(self[propName]))
        .map(({ propName, templateName }) =>
          inputBinding(templateName, self[propName] as Signal<unknown>),
        ),

      ...mirror.outputs
        .filter(({ propName }) => self[propName] instanceof OutputEmitterRef)
        .map(({ propName, templateName }) =>
          outputBinding(templateName, (value) =>
            (self[propName] as OutputEmitterRef<unknown>).emit(value),
          ),
        ),
    ];
  }
}
