/*
 * How far past the viewport an element must be before it resets. It must stay larger than the biggest hidden-state
 * offset (40px, .edu-stage): an element resetting at the viewport edge would shift back into view and flicker.
 */
const RESET_MARGIN = '120px 0px';

/**
 * Calls onEnter each time an element comes into view, and onReset once it is fully off screen, so an animation plays
 * again on every visit. Two boundaries keep a row in the entry margin from resetting or restarting while still visible.
 * Returns a function that stops watching.
 */
export function watchScrollReplay(
  elements: Iterable<Element>,
  enterMargin: string,
  onEnter: (el: Element) => void,
  onReset: (el: Element) => void,
): () => void {
  const inEntry = new WeakSet<Element>();
  const nearView = new WeakSet<Element>();
  const active = new WeakSet<Element>();

  const sync = (el: Element) => {
    if (inEntry.has(el) && !active.has(el)) {
      active.add(el);
      onEnter(el);
    } else if (!nearView.has(el) && !inEntry.has(el) && active.has(el)) {
      active.delete(el);
      onReset(el);
    }
  };
  // A busy frame can deliver "left" and "came back" together, and each observer's batch arrives separately. Acting on
  // every entry would let a stale exit reset an element on screen, with no later entry to show it again: keep only the
  // newest state per element and judge it against both boundaries.
  const observerFor = (seen: WeakSet<Element>, rootMargin: string) =>
    new IntersectionObserver(
      (entries) => {
        const latest = new Map(entries.map((e) => [e.target, e.isIntersecting]));
        for (const [el, hit] of latest) {
          if (hit) seen.add(el);
          else seen.delete(el);
          sync(el);
        }
      },
      { rootMargin },
    );

  const enter = observerFor(inEntry, enterMargin);
  const reset = observerFor(nearView, RESET_MARGIN);
  for (const el of elements) {
    enter.observe(el);
    reset.observe(el);
  }
  return () => {
    enter.disconnect();
    reset.disconnect();
  };
}
