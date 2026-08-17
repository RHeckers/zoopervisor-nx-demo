/*
 * ⚠️ DELIBERATE VIOLATION — kept for the talk.
 *
 * `ZONES.map(...)` runs at module-evaluation time, so esbuild cannot prove this
 * module is side-effect free and will keep it in any bundle that reaches this
 * barrel — even when nothing imports ZONE_LABELS.
 *
 * The fix is one line lower: move the call inside a function. See
 * zone-labels.fixed.util.ts for the version we would actually ship.
 */
const ZONES = ['savanna', 'aviary', 'aquarium', 'reptile-house'];

export const ZONE_LABELS = ZONES.map((z) => z.replace('-', ' '));

export function isZone(value: string): boolean {
  return ZONES.includes(value);
}
