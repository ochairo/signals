<!-- markdownlint-disable MD033 MD041 -->

<div align="center">

# ⚡ signals

Fine-grained reactive primitives for building reactive applications.<br>
_No virtual DOM. No useEffect. Just pure reactivity._

[![npm version](https://img.shields.io/npm/v/@ochairo/signals)](https://www.npmjs.com/package/@ochairo/signals)
[![npm downloads](https://img.shields.io/npm/dm/@ochairo/signals)](https://www.npmjs.com/package/@ochairo/signals)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@ochairo/signals)](https://bundlephobia.com/package/@ochairo/signals)
![CI](https://github.com/ochairo/signals/workflows/CI/badge.svg)
![License](https://img.shields.io/badge/license-MIT-blue)

</div>

## Features

- 📦 **Ultra Lightweight**: ~2.4KB minified
- ⚡ **Automatic Tracking**: Tracks dependencies automatically
- 🔧 **Framework-agnostic**: Works anywhere
- 💡 **Simple**: Just `signal()` and reactive updates

## Install

```bash
pnpm add @ochairo/signals
```

## Quick Start

```ts
import { signal } from '@ochairo/signals';

const count = signal(0);

count.value;     // Read: 0
count.set(1);    // Write: 1
```

### Computed

```ts
const firstName = signal('John');
const lastName = signal('Doe');
const fullName = signal(() => `${firstName.value} ${lastName.value}`);

fullName.value;  // "John Doe"
```

### Effects

```ts
const count = signal(0);

count.on((value) => {
  console.log(`Count: ${value}`);
});

count.set(1);  // Logs: "Count: 1"
```

## Documentation

- [API Reference](./docs/API.md)
- [Usage Guide](./docs/USAGE.md)
- [Examples](./docs/EXAMPLES.md)

<br><br>

<div align="center">

[Report Bug](https://github.com/ochairo/signals/issues) • [Request Feature](https://github.com/ochairo/signals/issues)

**Made with ❤︎ by [ochairo](https://github.com/ochairo)**

</div>
