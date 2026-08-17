/** Collapse any thrown value into a display string. */
export function normalizeError(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === 'string') return err;
  return 'Something went wrong';
}
