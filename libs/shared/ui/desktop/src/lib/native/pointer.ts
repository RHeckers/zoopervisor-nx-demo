/*
 * ⚠️ FAKE DESKTOP CAPABILITY — stands in for pointer/keyboard features a touch
 * device doesn't have (hover intent, right-click menus, keyboard accelerators).
 *
 * A real build might reach for Electron APIs or `(pointer: fine)` media
 * queries. The point for the talk: this is a *desktop-only* capability. This
 * lib is tagged `platform:desktop`, and the boundary rules keep any
 * `platform:mobile` lib from importing it.
 */
export const Pointer = {
  /** True on a device with a precise pointer (mouse/trackpad). */
  hasFinePointer(): boolean {
    return (
      typeof matchMedia !== 'undefined' && matchMedia('(pointer: fine)').matches
    );
  },
};
