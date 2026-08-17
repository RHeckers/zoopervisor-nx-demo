import {
  appendToList,
  deepMergeById,
  overwriteWithResult,
  prependToList,
  runLoad,
} from './store-options';

interface State {
  items: { id: string; n?: number }[];
  loading: boolean;
  error: string | null;
}

const state: State = { items: [{ id: 'a' }], loading: false, error: null };

describe('store default updaters', () => {
  it('overwriteWithResult replaces the list', () => {
    expect(overwriteWithResult('items')([{ id: 'b' }], state)).toEqual({
      items: [{ id: 'b' }],
    });
  });

  it('appendToList appends', () => {
    expect(appendToList('items')([{ id: 'b' }], state)).toEqual({
      items: [{ id: 'a' }, { id: 'b' }],
    });
  });

  it('prependToList prepends', () => {
    expect(prependToList('items')([{ id: 'b' }], state)).toEqual({
      items: [{ id: 'b' }, { id: 'a' }],
    });
  });

  it('deepMergeById upserts by id', () => {
    const updater = deepMergeById<{ id: string; n?: number }, State, 'items'>(
      'items',
    );
    expect(updater([{ id: 'a', n: 1 }, { id: 'c' }], state)).toEqual({
      items: [{ id: 'a', n: 1 }, { id: 'c' }],
    });
  });
});

describe('runLoad', () => {
  it('applies source + default updater and clears loading', async () => {
    const local: State = { items: [], loading: false, error: null };
    await runLoad<{ id: string }, State>(
      (p) => Object.assign(local, p),
      () => local,
      { query: '' },
      { source: async () => [{ id: 'x' }], updater: overwriteWithResult('items') },
    );
    expect(local).toEqual({ items: [{ id: 'x' }], loading: false, error: null });
  });

  it('normalises errors and fires onError', async () => {
    const local: State = { items: [], loading: false, error: null };
    let caught: unknown;
    await runLoad<{ id: string }, State>(
      (p) => Object.assign(local, p),
      () => local,
      { query: '', onError: (e) => (caught = e) },
      {
        source: async () => {
          throw new Error('boom');
        },
        updater: overwriteWithResult('items'),
      },
    );
    expect(local.error).toBe('boom');
    expect(caught).toBeInstanceOf(Error);
  });
});
