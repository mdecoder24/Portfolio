import { afterEach, describe, expect, it, vi } from 'vitest';
import { watchScrollReplay } from '@/lib/scroll-replay';

type Entry = { target: Element; isIntersecting: boolean };

/** Observers in creation order: the entry boundary, then the reset boundary. */
function stubObservers() {
  const callbacks: ((entries: Entry[]) => void)[] = [];
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      constructor(callback: (entries: Entry[]) => void) {
        callbacks.push(callback);
      }
      observe() {}
      disconnect() {}
    },
  );
  return callbacks;
}

function setup() {
  const [enter, reset] = [0, 1];
  const callbacks = stubObservers();
  const el = {} as Element;
  const onEnter = vi.fn();
  const onReset = vi.fn();
  watchScrollReplay([el], '0px', onEnter, onReset);
  const fire = (which: number, ...hits: boolean[]) => callbacks[which](hits.map((isIntersecting) => ({ target: el, isIntersecting })));
  return { enter, reset, fire, onEnter, onReset };
}

describe('watchScrollReplay', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('plays again after the element has left and returned', () => {
    const { enter, reset, fire, onEnter, onReset } = setup();
    fire(reset, true);
    fire(enter, true);
    fire(enter, false);
    fire(reset, false);
    expect(onReset).toHaveBeenCalledTimes(1);
    fire(reset, true);
    fire(enter, true);
    expect(onEnter).toHaveBeenCalledTimes(2);
  });

  it('neither resets nor restarts while the element is only outside the entry margin', () => {
    const { enter, reset, fire, onEnter, onReset } = setup();
    fire(reset, true);
    fire(enter, true);
    fire(enter, false);
    fire(enter, true);
    expect(onEnter).toHaveBeenCalledTimes(1);
    expect(onReset).not.toHaveBeenCalled();
  });

  it('stays shown when a quick away-and-back arrives as one batch', () => {
    const { enter, reset, fire, onEnter, onReset } = setup();
    fire(reset, true);
    fire(enter, true);
    fire(enter, false, true);
    fire(reset, false, true);
    expect(onReset).not.toHaveBeenCalled();
    expect(onEnter).toHaveBeenCalledTimes(1);
  });

  it('shows an element whose stale exit arrives in the same batch as its entry', () => {
    const { enter, reset, fire, onEnter, onReset } = setup();
    fire(reset, false, true);
    fire(enter, true);
    expect(onEnter).toHaveBeenCalledTimes(1);
    expect(onReset).not.toHaveBeenCalled();
  });
});
