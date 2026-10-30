import { describe, expect, it } from 'vitest';
import { BRAND_PATHS, IDEA_GLYPHS } from '@/components/sections/stack-logos';
import * as content from '@/content';

describe('stack teardown logos', () => {
  it('gives every skill a brand mark or a glyph', () => {
    const missing = content.skills.map((s) => s.name).filter((n) => !(n in BRAND_PATHS) && !(n in IDEA_GLYPHS));
    expect(missing).toEqual([]);
  });

  it('has no marks for skills that no longer exist', () => {
    const names = new Set(content.skills.map((s) => s.name));
    expect([...Object.keys(BRAND_PATHS), ...Object.keys(IDEA_GLYPHS)].filter((n) => !names.has(n))).toEqual([]);
  });
});
