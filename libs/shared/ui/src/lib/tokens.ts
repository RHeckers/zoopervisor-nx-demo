/**
 * Design tokens shared across every zoo app. Pure values, no components, so the
 * dumb `<zoo-*>` components below build on them without any domain knowledge.
 */
export const zooTokens = {
  color: {
    savanna: '#e8c07d',
    aquarium: '#4a90d9',
    leaf: '#4caf50',
    ink: '#1b1b1b',
    paper: '#fbfbf7',
  },
  /** 4px base scale. */
  space: (steps: number): string => `${steps * 4}px`,
  radius: '0.5rem',
} as const;
