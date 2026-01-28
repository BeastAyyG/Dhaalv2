import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('cn utility', () => {
    it('combines class names', () => {
        expect(cn('bg-red-500', 'text-white')).toContain('bg-red-500');
        expect(cn('bg-red-500', 'text-white')).toContain('text-white');
    });

    it('merges tailwind classes', () => {
        // tailwind-merge should resolve conflict
        // p-4 (padding 1rem) vs p-2 (padding 0.5rem) -> should take last one
        expect(cn('p-4', 'p-2')).toBe('p-2');
    });

    it('handles conditional classes', () => {
        const isTrue = true;
        const isFalse = false;
        expect(cn('base', isTrue && 'active', isFalse && 'inactive')).toBe('base active');
    });
});
