/**
 * Core Signal Implementation with .value API
 */

import { getCurrentContext, type SignalSubscriber, type TrackingContext } from './tracking.js';

export interface Signal<T> extends SignalSubscriber {
  /**
   * Get the current value (reactive - tracks in render contexts)
   */
  readonly value: T;

  /**
   * Set a new value
   */
  set(newValue: T): void;

  /**
   * Subscribe to changes
   */
  on(callback: (value: T) => void): () => void;
}

type ChangeListener<T> = (value: T) => void;

// Batch updates to prevent cascading re-renders
const pendingUpdates = new Set<TrackingContext>();
let isFlushScheduled = false;

function scheduleUpdate(context: TrackingContext): void {
  pendingUpdates.add(context);
  if (!isFlushScheduled) {
    isFlushScheduled = true;
    queueMicrotask(() => {
      isFlushScheduled = false;
      const updates = Array.from(pendingUpdates);
      pendingUpdates.clear();
      for (const ctx of updates) {
        ctx.update();
      }
    });
  }
}

class SignalImpl<T> implements Signal<T> {
  private _value: T;
  private _contexts = new Set<TrackingContext>();
  private _listeners = new Set<ChangeListener<T>>();

  constructor(initialValue: T) {
    this._value = initialValue;
  }

  get value(): T {
    const context = getCurrentContext();
    if (context) context.track(this);
    return this._value;
  }

  set(newValue: T): void {
    if (this._value === newValue) return;
    this._value = newValue;
    for (const context of this._contexts) {
      scheduleUpdate(context);
    }
    for (const listener of this._listeners) {
      listener(newValue);
    }
  }

  on(callback: (value: T) => void): () => void {
    this._listeners.add(callback);
    return () => this._listeners.delete(callback);
  }

  subscribe(context: TrackingContext): void {
    this._contexts.add(context);
  }

  unsubscribe(context: TrackingContext): void {
    this._contexts.delete(context);
  }
}

// Component state hook integration
let useComponentStateHook: (<T>(initialValue: T) => T) | null = null;

/**
 * Register the component state hook from jsx-runtime
 */
export function registerComponentStateHook(hook: <T>(initialValue: T) => T): void {
  useComponentStateHook = hook;
}

/**
 * Create a reactive signal with .value property
 * Automatically preserves signal instance across component re-renders
 */
export function signal<T>(initialValue: T): Signal<T> {
  if (useComponentStateHook) {
    // Safe cast: useComponentStateHook returns the signal instance from the factory function
    // The hook preserves the signal across component re-renders
    return useComponentStateHook<Signal<T> | (() => Signal<T>)>(() => new SignalImpl(initialValue)) as Signal<T>;
  }
  return new SignalImpl(initialValue);
}

/**
 * @deprecated Use `signal()` instead. This alias will be removed in a future version.
 */
export const createSignal = signal;

/**
 * Check if a value is a Signal
 */
export function isSignal(value: unknown): value is Signal<unknown> {
  if (value === null || typeof value !== 'object') {
    return false;
  }

  const obj = value as Record<string, unknown>;
  return 'value' in obj && 'set' in obj && 'on' in obj && typeof obj.set === 'function' && typeof obj.on === 'function';
}
