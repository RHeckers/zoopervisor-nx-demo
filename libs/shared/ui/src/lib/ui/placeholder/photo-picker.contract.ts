import {
  InjectionToken,
  InputSignal,
  OutputEmitterRef,
  Provider,
  Type,
} from '@angular/core';

export interface PhotoPickerContract {
  multiple: InputSignal<boolean>;
  selected: OutputEmitterRef<File[]>;
}

export const PHOTO_PICKER = new InjectionToken<Type<PhotoPickerContract>>(
  'PHOTO_PICKER',
);

/**
 * Typed wrapper. `useValue` is typed as `any`, so registering the token
 * directly would let a non-conforming component through unnoticed.
 */
export function providePhotoPicker(
  impl: Type<PhotoPickerContract>,
): Provider {
  return { provide: PHOTO_PICKER, useValue: impl };
}
