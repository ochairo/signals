# Examples

## Counter

```ts
import { signal } from '@ochairo/signals';

function Counter() {
  const count = signal(0);

  return {
    get value() { return count.value; },
    increment() { count.set(count.value + 1); },
    decrement() { count.set(count.value - 1); },
    reset() { count.set(0); }
  };
}

const counter = Counter();
counter.increment();
console.log(counter.value);  // 1
```

---

## Todo List

```ts
import { signal } from '@ochairo/signals';

const todos = signal([
  { id: 1, text: 'Learn signals', done: true },
  { id: 2, text: 'Build app', done: false },
]);

const completedCount = signal(() =>
  todos.value.filter(t => t.done).length
);

const totalCount = signal(() => todos.value.length);

const progress = signal(() =>
  `${completedCount.value}/${totalCount.value}`
);

console.log(progress.value);  // "1/2"
```

---

## Form Validation

```ts
import { signal } from '@ochairo/signals';

const email = signal('');
const password = signal('');

const emailValid = signal(() =>
  email.value.includes('@')
);

const passwordValid = signal(() =>
  password.value.length >= 8
);

const formValid = signal(() =>
  emailValid.value && passwordValid.value
);

email.set('user@example.com');
password.set('secret123');
console.log(formValid.value);  // true
```

---

## Async Data Fetching

```ts
import { signal } from '@ochairo/signals';

function createResource<T>(fetcher: () => Promise<T>) {
  const data = signal<T | null>(null);
  const loading = signal(true);
  const error = signal<Error | null>(null);

  fetcher()
    .then(result => {
      data.set(result);
      loading.set(false);
    })
    .catch(err => {
      error.set(err);
      loading.set(false);
    });

  return { data, loading, error };
}

const user = createResource(() =>
  fetch('/api/user').then(r => r.json())
);

// Subscribe to changes
user.loading.on((isLoading) => {
  if (isLoading) {
    console.log('Loading...');
  } else if (user.error.value) {
    console.log('Error:', user.error.value);
  } else {
    console.log('User:', user.data.value);
  }
});
```

---

## Timer

```ts
import { signal, onUnmount } from '@ochairo/signals';

function Timer() {
  const seconds = signal(0);

  const timerId = setInterval(() => {
    seconds.set(seconds.value + 1);
  }, 1000);

  onUnmount(() => {
    clearInterval(timerId);
  });

  const formatted = signal(() => {
    const s = seconds.value;
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  });

  return formatted;
}
```

---

## Reactive DOM Updates

```ts
import { signal } from '@ochairo/signals';

const count = signal(0);

const button = document.querySelector('button');
const display = document.querySelector('span');

const unsubscribe = count.on((value) => {
  display.textContent = value.toString();
});

button.addEventListener('click', () => {
  count.set(count.value + 1);
});

// Cleanup when done
// unsubscribe();
```

---

## Derived State

```ts
import { signal } from '@ochairo/signals';

const price = signal(100);
const quantity = signal(2);
const taxRate = signal(0.1);

const subtotal = signal(() =>
  price.value * quantity.value
);

const tax = signal(() =>
  subtotal.value * taxRate.value
);

const total = signal(() =>
  subtotal.value + tax.value
);

console.log(total.value);  // 220

price.set(150);
console.log(total.value);  // 330
```
