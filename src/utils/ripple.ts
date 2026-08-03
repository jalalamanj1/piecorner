import type React from 'react';

// The click ripple effect has been removed by design.
// Kept as a no-op so existing callers remain valid without DOM side effects.
export const createRipple = (_event: React.MouseEvent<HTMLElement>) => {
  // intentionally empty — no ripple
};
