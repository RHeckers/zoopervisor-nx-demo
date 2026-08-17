import type { Translation } from '@jsverse/transloco';
import { deepmergeCustom } from 'deepmerge-ts';

/**
 * Deep merge where arrays REPLACE (last wins) rather than concatenate — a spread
 * (`{ ...shared, ...app }`) would delete sibling keys, which is exactly the bug
 * the ticket-kiosk sparse override would trigger. No Angular here, so it's unit
 * testable on its own.
 */
export const mergeTranslations = deepmergeCustom<Translation>({
  mergeArrays: (values) => values[values.length - 1],
});
