# API Reference

## Core Functions

### `signal(value)` / `signal(fn)`

Create a reactive signal.

**Signature:**

```ts
function signal<T>(value: T): Signal<T>
function signal<T>(fn: () => T): Signal<T>
```

**Returns:** Signal object with:

- `.value` property to read (reactive)
- `.set(value)` method to update
- `.on(callback)` method to subscribe

**Example:**

```ts
const count = signal(0);
const double = signal(() => count.value * 2);

count.value;      // 0
count.set(5);
double.value;     // 10
```

---

### `isSignal(value)`

Check if value is a signal.

**Signature:**

```ts
function isSignal(value: unknown): boolean
```

**Example:**

```ts
const s = signal(0);
isSignal(s);    // true
isSignal(42);   // false
```

---

## Signal Methods

### `.value`

Read the signal's current value. Automatically tracks dependencies when accessed inside tracking contexts.

```ts
const count = signal(0);
console.log(count.value);  // 0
```

---

### `.set(newValue)`

Update the signal's value and notify all subscribers.

```ts
count.set(1);
count.set(count.value + 1);
```

---

### `.on(callback)`

Subscribe to signal changes. Returns unsubscribe function.

**Signature:**

```ts
on(callback: (value: T) => void): () => void
```

**Example:**

```ts
const count = signal(0);

const unsubscribe = count.on((value) => {
  console.log('Count changed:', value);
});

count.set(1);  // Logs: "Count changed: 1"
unsubscribe(); // Stop listening
```

---

## Tracking Context

### `createTrackingContext(update)`

Create context for component-scoped reactivity.

**Signature:**

```ts
function createTrackingContext(update: () => void): TrackingContext
```

**Methods:**

- `.track(signal)` - Track a signal
- `.update()` - Trigger update
- `.dispose()` - Clean up
- `.registerMountCallback(fn)` - Register mount callback
- `.registerCleanupCallback(fn)` - Register cleanup callback

**Example:**

```ts
const ctx = createTrackingContext(() => {
  console.log('Update triggered');
});
ctx.dispose();
```

---

### `runInContext(context, fn)`

Execute function within a tracking context.

**Signature:**

```ts
function runInContext<T>(context: TrackingContext, fn: () => T): T
```

---

### `untracked(fn)`

Execute function without tracking dependencies.

**Signature:**

```ts
function untracked<T>(fn: () => T): T
```

**Example:**

```ts
const computed = signal(() => {
  const a = signalA.value;           // Tracked
  const b = untracked(() => signalB.value);  // Not tracked
  return a + b;
});
```

---

## Lifecycle Hooks

### `onMount(fn)`

Register callback for component mount. Must be called during render.

**Signature:**

```ts
function onMount(fn: () => void): void
```

---

### `onUnmount(fn)`

Register cleanup callback. Must be called during render.

**Signature:**

```ts
function onUnmount(fn: () => void): void
```

**Example:**

```ts
onUnmount(() => {
  clearInterval(timerId);
});
```

---

## Types

### `Signal<T>`

```ts
interface Signal<T> {
  readonly value: T;
  set(newValue: T): void;
  on(callback: (value: T) => void): () => void;
}
```

### `TrackingContext`

```ts
interface TrackingContext {
  track(signal: SignalSubscriber): void;
  update(): void;
  dispose(): void;
  registerMountCallback(callback: () => void): void;
  registerCleanupCallback(callback: () => void): void;
  callMountCallbacks(): void;
}
```
