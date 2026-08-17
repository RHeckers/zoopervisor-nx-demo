/*
 * ⚠️ FAKE NATIVE PACKAGE — stands in for @capacitor/haptics.
 *
 * A real keeper-mobile build would delete this file and instead:
 *     import { Haptics, ImpactStyle } from '@capacitor/haptics';
 *
 * We fake it so the demo needs no native toolchain, while keeping the same
 * shape. The point for the talk: this is a *mobile-only* capability. This lib
 * is tagged `platform:mobile`, and the boundary rules ban any
 * `platform:desktop` lib from importing `@capacitor/*`. Swapping the two lines
 * above back in keeps that ban meaningful.
 */
export type ImpactStyle = 'light' | 'medium' | 'heavy';

export const Haptics = {
  async impact(style: ImpactStyle = 'medium'): Promise<void> {
    // The real plugin vibrates the device; the fake just logs.
    console.debug(`[haptics] ${style} impact`);
  },
};
