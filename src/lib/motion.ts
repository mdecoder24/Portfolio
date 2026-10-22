export const ease = { out: [0.22, 1, 0.36, 1], inOut: [0.65, 0, 0.35, 1] } as const;
export const duration = { press: 0.1, quick: 0.16, base: 0.24, panel: 0.32, scene: 1.2 } as const;
export const spring = { panel: { type: 'spring', stiffness: 380, damping: 34 } } as const;
