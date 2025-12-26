/**
 * Tracking context for component-scoped reactivity
 */

export interface TrackingContext {
  track(signal: SignalSubscriber): void;
  update(): void;
  dispose(): void;
  registerMountCallback(callback: () => void): void;
  registerCleanupCallback(callback: () => void): void;
  callMountCallbacks(): void;
}

export interface SignalSubscriber {
  subscribe(context: TrackingContext): void;
  unsubscribe(context: TrackingContext): void;
}

let currentContext: TrackingContext | null = null;

/**
 * Get the current tracking context if any
 */
export function getCurrentContext(): TrackingContext | null {
  return currentContext;
}

/**
 * Create a new tracking context with an update callback
 */
export function createTrackingContext(update: () => void): TrackingContext {
  const trackedSignals = new Set<SignalSubscriber>();
  const mountCallbacks: Array<() => void> = [];
  const cleanupCallbacks: Array<() => void> = [];
  let isDisposed = false;
  let hasMounted = false;

  const context: TrackingContext = {
    track(signal) {
      if (!isDisposed && !trackedSignals.has(signal)) {
        trackedSignals.add(signal);
        signal.subscribe(context);
      }
    },
    update() {
      if (!isDisposed) {
        // Clear old subscriptions before update
        for (const signal of trackedSignals) {
          signal.unsubscribe(context);
        }
        trackedSignals.clear();
        update();
      }
    },
    dispose() {
      if (!isDisposed) {
        isDisposed = true;
        // Call all cleanup callbacks
        for (const cleanup of cleanupCallbacks) {
          try {
            cleanup();
          } catch (error) {
            console.error('Error in cleanup callback:', error);
          }
        }
        cleanupCallbacks.length = 0;
        mountCallbacks.length = 0;
        // Unsubscribe from all signals
        for (const signal of trackedSignals) {
          signal.unsubscribe(context);
        }
        trackedSignals.clear();
      }
    },
    registerMountCallback(callback) {
      if (!isDisposed) {
        if (hasMounted) {
          // If already mounted, call immediately
          callback();
        } else {
          mountCallbacks.push(callback);
        }
      }
    },
    registerCleanupCallback(callback) {
      if (!isDisposed) {
        cleanupCallbacks.push(callback);
      }
    },
    callMountCallbacks() {
      if (!hasMounted && !isDisposed) {
        hasMounted = true;
        for (const callback of mountCallbacks) {
          try {
            callback();
          } catch (error) {
            console.error('Error in mount callback:', error);
          }
        }
        mountCallbacks.length = 0;
      }
    },
  };
  return context;
}

/**
 * Run a function within a tracking context
 */
export function runInContext<T>(context: TrackingContext, fn: () => T): T {
  const prevContext = currentContext;
  currentContext = context;
  try {
    return fn();
  } finally {
    currentContext = prevContext;
  }
}

/**
 * Run a function without tracking (event handlers, etc)
 */
export function untracked<T>(fn: () => T): T {
  const prevContext = currentContext;
  currentContext = null;
  try {
    return fn();
  } finally {
    currentContext = prevContext;
  }
}

/**
 * Register a callback to run after the component first renders (mounts)
 * Must be called during component render
 */
export function onMount(callback: () => void): void {
  const context = getCurrentContext();
  if (!context) {
    throw new Error('onMount must be called during component render');
  }
  context.registerMountCallback(callback);
}

/**
 * Register a callback to run when the component unmounts
 * Must be called during component render
 */
export function onUnmount(callback: () => void): void {
  const context = getCurrentContext();
  if (!context) {
    throw new Error('onUnmount must be called during component render');
  }
  context.registerCleanupCallback(callback);
}
