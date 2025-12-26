# Usage Guide

## Basic Signals

Signals are reactive values that notify subscribers when changed.

### Creating Signals

```ts
import { signal } from '@ochairo/signals';

const name = signal('Alice');
name.value;  // "Alice"
name.set('Bob');
```

### Reading Values

Access the `.value` property:

```ts
const current = count.value;
console.log(current);
```

### Updating Values

Use `.set()` method:

```ts
count.set(5);
count.set(count.value + 1);
```

---

## Computed Signals

Automatically track and recompute when dependencies change.

```ts
const firstName = signal('John');
const lastName = signal('Doe');

const fullName = signal(() =>
  `${firstName.value} ${lastName.value}`
);

console.log(fullName.value);  // "John Doe"
firstName.set('Jane');
console.log(fullName.value);  // "Jane Doe"
```

**Key Points:**

- Lazy evaluation - only compute when accessed
- Cached - won't recompute unless dependencies changed
- Automatic tracking - no manual dependency lists

---

## Subscriptions

Subscribe to signal changes with `.on()`:

```ts
const count = signal(0);

const unsubscribe = count.on((value) => {
  console.log(`Count: ${value}`);
  document.title = `Count: ${value}`;
});

count.set(1);  // Logs: "Count: 1"

// Cleanup
unsubscribe();
```

**Remember:**

- Always unsubscribe when done
- Callback runs immediately when value changes
- Callback receives the new value

---

## Untracked Reads

Sometimes you need to read a signal without tracking it:

```ts
const a = signal(1);
const b = signal(2);

const computed = signal(() => {
  const aVal = a.value;  // Tracked
  const bVal = untracked(() => b.value);  // Not tracked
  return aVal + bVal;
});

// Only updates when 'a' changes, not 'b'
```

---

## Lifecycle Hooks

### Component Mount

```ts
import { onMount } from '@ochairo/signals';

onMount(() => {
  console.log('Component mounted');
  fetchData();
});
```

### Component Unmount

```ts
import { onUnmount } from '@ochairo/signals';

const timerId = setInterval(() => {}, 1000);

onUnmount(() => {
  clearInterval(timerId);
});
```

---

## Best Practices

### ✅ Do

- Keep signals focused and single-purpose
- Use computed signals for derived state
- Always unsubscribe from `.on()` callbacks
- Use descriptive names

### ❌ Don't

- Mutate objects inside signals (create new objects instead)
- Create signals in loops or conditions
- Forget to unsubscribe
- Mix imperative and reactive patterns
