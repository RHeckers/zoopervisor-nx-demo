import { providePhotoPicker } from './contract';

class NotAPicker {}

describe('providePhotoPicker', () => {
  it('rejects a component missing the contract (compile-time)', () => {
    // @ts-expect-error NotAPicker has no `multiple` input or `selected` output.
    providePhotoPicker(NotAPicker);
    expect(true).toBe(true);
  });
});
