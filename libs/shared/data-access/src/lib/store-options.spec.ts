import {
  appendItem,
  appendToList,
  deepMergeById,
  overwriteWithResult,
  removeItem,
  replaceItem,
  runOperation,
  setResult,
} from './store-options';

interface State {
  items: { id: string; n?: number }[];
  loading: boolean;
  error: string | null;
}

const state: State = { items: [{ id: 'a' }], loading: false, error: null };

describe('default updaters', () => {
  it('setResult / overwriteWithResult replaces the key with the result', () => {
    expect(setResult('items')([{ id: 'b' }], state)).toEqual({
      items: [{ id: 'b' }],
    });
    expect(overwriteWithResult('items')([{ id: 'b' }], state)).toEqual({
      items: [{ id: 'b' }],
    });
  });

  it('appendItem appends one created item (create)', () => {
    expect(appendItem('items')({ id: 'b' }, state)).toEqual({
      items: [{ id: 'a' }, { id: 'b' }],
    });
  });

  it('replaceItem replaces the matching entry (update)', () => {
    const s: State = { ...state, items: [{ id: 'a', n: 0 }, { id: 'b' }] };
    expect(
      replaceItem<State['items'][number], State, 'items'>('items')(
        { id: 'a', n: 9 },
        s,
      ),
    ).toEqual({ items: [{ id: 'a', n: 9 }, { id: 'b' }] });
  });

  it('removeItem drops the id (delete, result ignored)', () => {
    const s: State = { ...state, items: [{ id: 'a' }, { id: 'b' }] };
    expect(
      removeItem<void, State['items'][number], State, 'items'>('items', 'a')(
        undefined,
        s,
      ),
    ).toEqual({ items: [{ id: 'b' }] });
  });

  it('appendToList appends a batch', () => {
    expect(appendToList('items')([{ id: 'b' }], state)).toEqual({
      items: [{ id: 'a' }, { id: 'b' }],
    });
  });

  it('deepMergeById upserts by id', () => {
    expect(
      deepMergeById<State['items'][number], State, 'items'>('items')(
        [{ id: 'a', n: 1 }, { id: 'c' }],
        state,
      ),
    ).toEqual({ items: [{ id: 'a', n: 1 }, { id: 'c' }] });
  });
});

describe('runOperation', () => {
  it('runs the source, applies the default updater, clears loading', async () => {
    const local: State = { items: [], loading: false, error: null };
    await runOperation<{ id: string }, State>(
      (p) => Object.assign(local, p),
      () => local,
      { source: async () => ({ id: 'x' }), updater: appendItem('items') },
    );
    expect(local).toEqual({ items: [{ id: 'x' }], loading: false, error: null });
  });

  it('lets a call site override the updater', async () => {
    const local: State = { items: [{ id: 'a' }], loading: false, error: null };
    await runOperation<{ id: string }, State>(
      (p) => Object.assign(local, p),
      () => local,
      { source: async () => ({ id: 'x' }), updater: appendItem('items') },
      { updater: setResult('items') },
    );
    expect(local.items).toEqual({ id: 'x' });
  });

  it('normalises errors and fires onError', async () => {
    const local: State = { items: [], loading: false, error: null };
    let caught: unknown;
    await runOperation<{ id: string }, State>(
      (p) => Object.assign(local, p),
      () => local,
      {
        source: async () => {
          throw new Error('boom');
        },
        updater: appendItem('items'),
      },
      { onError: (e) => (caught = e) },
    );
    expect(local.error).toBe('boom');
    expect(caught).toBeInstanceOf(Error);
  });
});
