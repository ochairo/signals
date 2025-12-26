import { describe, expect, it, vi } from 'vitest';
import { signal } from '../signal.js';

describe('Signal with .value API', () => {
  it('should create a signal with initial value', () => {
    const sig = signal(10);
    expect(sig.value).toBe(10);
  });

  it('should update value with .set()', () => {
    const sig = signal(5);
    sig.set(10);
    expect(sig.value).toBe(10);
  });

  it('should not notify if value is the same', () => {
    const sig = signal(5);
    const listener = vi.fn();
    sig.on(listener);

    sig.set(5);
    expect(listener).not.toHaveBeenCalled();
  });

  it('should notify listeners with .on()', () => {
    const sig = signal(0);
    const listener = vi.fn();

    sig.on(listener);
    sig.set(10);

    expect(listener).toHaveBeenCalledWith(10);
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('should return unsubscribe function from .on()', () => {
    const sig = signal(0);
    const listener = vi.fn();

    const unsubscribe = sig.on(listener);
    sig.set(10);
    expect(listener).toHaveBeenCalledTimes(1);

    unsubscribe();
    sig.set(20);
    expect(listener).toHaveBeenCalledTimes(1); // Still 1, not called again
  });

  it('should work with arrays', () => {
    const todos = signal<string[]>([]);

    expect(todos.value).toEqual([]);
    expect(Array.isArray(todos.value)).toBe(true);

    todos.set(['task1', 'task2']);
    expect(todos.value.length).toBe(2);
    expect(todos.value[0]).toBe('task1');
  });

  it('should support array methods on .value', () => {
    const todos = signal(['a', 'b', 'c']);

    const mapped = todos.value.map((t) => t.toUpperCase());
    expect(mapped).toEqual(['A', 'B', 'C']);

    const filtered = todos.value.filter((t) => t !== 'b');
    expect(filtered).toEqual(['a', 'c']);
  });

  it('should notify multiple listeners', () => {
    const sig = signal(0);
    const listener1 = vi.fn();
    const listener2 = vi.fn();

    sig.on(listener1);
    sig.on(listener2);
    sig.set(5);

    expect(listener1).toHaveBeenCalledWith(5);
    expect(listener2).toHaveBeenCalledWith(5);
  });
});
