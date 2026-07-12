export type CategoryKey = 'research-notes' | 'reading-notes' | 'essays' | 'explainers' | 'field-notes';

export const categoryOrder: CategoryKey[] = [
  'research-notes',
  'reading-notes',
  'essays',
  'explainers',
  'field-notes',
];

export const categoryMeta: Record<CategoryKey, { label: string; subtitle: string }> = {
  'research-notes': {
    label: 'Research Notes',
    subtitle: 'Things I learnt while doing research.',
  },
  'reading-notes': {
    label: 'Reading Notes',
    subtitle: 'Papers worth reading, and what they changed in my thinking.',
  },
  essays: {
    label: 'Essays',
    subtitle: 'Models for understanding people.',
  },
  explainers: {
    label: 'Explainers',
    subtitle: 'One difficult idea, explained properly.',
  },
  'field-notes': {
    label: 'Field Notes',
    subtitle: 'Short, current, unfinished thoughts.',
  },
};
