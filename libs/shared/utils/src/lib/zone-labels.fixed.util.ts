/*
 * The version we would actually ship. `ZONES.map(...)` now runs INSIDE a
 * function, so the module has no top-level side effect. esbuild can prove it is
 * inert and drops it from any bundle that doesn't call `zoneLabels()`.
 */
const ZONES = ['savanna', 'aviary', 'aquarium', 'reptile-house'];

export function zoneLabels(): string[] {
  return ZONES.map((z) => z.replace('-', ' '));
}
