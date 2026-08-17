import { mergeTranslations } from './merge-translations';

describe('mergeTranslations', () => {
  it('deep-merges, preserving sibling keys the override does not mention', () => {
    const shared = { errors: { generic: 'Something went wrong.', dismiss: 'Dismiss' } };
    const app = { errors: { generic: 'Please ask a member of staff.' } };

    expect(mergeTranslations(shared, app)).toEqual({
      errors: {
        generic: 'Please ask a member of staff.',
        dismiss: 'Dismiss', // survives — proves it is not a shallow spread
      },
    });
  });

  it('replaces arrays rather than concatenating', () => {
    expect(mergeTranslations({ tags: ['a', 'b'] }, { tags: ['c'] })).toEqual({
      tags: ['c'],
    });
  });
});
