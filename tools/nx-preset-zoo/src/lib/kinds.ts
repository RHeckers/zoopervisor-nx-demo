/**
 * The layer a generated library represents. Every generator constrains its
 * `--kind` to a subset of these — never free text — so the `type:` tag it
 * writes is always one the boundary rules understand.
 */
export type LibKind =
  | 'data-access'
  | 'ui'
  | 'util'
  | 'types'
  | 'slice'
  | 'feature'
  | 'shell';

/** kinds that ship Angular declarables (need the angular eslint + a prefix). */
export const ANGULAR_KINDS: ReadonlySet<LibKind> = new Set([
  'data-access',
  'ui',
  'slice',
  'feature',
  'shell',
]);

/** Map a kind onto the `type:` tag the boundary rules key off. */
export function typeTag(kind: LibKind): string {
  return `type:${kind}`;
}

/**
 * The on-disk folder / import-alias segment for a kind. Tags stay singular
 * (`type:util`), but folders read as plural where the spec's tree does
 * (`utils/`, `slices/`).
 */
export function segment(kind: LibKind): string {
  if (kind === 'util') return 'utils';
  if (kind === 'slice') return 'slices';
  return kind;
}

/** The component/directive selector prefix for every generated project. */
export const SELECTOR_PREFIX = 'zoo';
