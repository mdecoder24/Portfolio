// Per-frame values shared by scene components. Mutated in useFrame only; never read by React render.
export const rig = {
  /** Opening progress, 0 to 1: the pearl grows out of the headline's full stop. */
  open: 1,
  /** Formation weights after damping, written by Particles, read by Pearl. */
  weights: new Float32Array([1, 0, 0, 0, 0]),
  /** Pointer influence: 0 on touch devices and under reduced motion. */
  pointer: 1,
};

export const HALF_H = 8 * Math.tan((35 * Math.PI) / 360); // visible half-height at z = 0
