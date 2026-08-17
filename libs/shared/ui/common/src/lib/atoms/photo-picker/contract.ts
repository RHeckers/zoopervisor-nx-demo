import {
  InjectionToken,
  InputSignal,
  OutputEmitterRef,
  Provider,
  Type,
} from '@angular/core';

/** What any photo-picker implementation must expose. */
export interface PhotoPickerContract {
  multiple: InputSignal<boolean>;
  selected: OutputEmitterRef<File[]>;
}

export const PHOTO_PICKER = new InjectionToken<Type<PhotoPickerContract>>(
  'PHOTO_PICKER',
);

/**
 * The typed wrapper is required, not optional: `ValueProvider.useValue` is typed
 * `any`, so registering the token directly would let a non-conforming component
 * through. Going through `providePhotoPicker` is what enforces the contract at
 * registration.
 */
export function providePhotoPicker(impl: Type<PhotoPickerContract>): Provider {
  return { provide: PHOTO_PICKER, useValue: impl };
}
