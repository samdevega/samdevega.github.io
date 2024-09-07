---
title: "React: Zustand"
pubDate: 2024-09-07T23:00:00Z
tags: ['react']
---
Zustand is a small, fast and scalable state management solution with a simple hook-based API, which suits really well with the latest versions of React. It requires no configuration and is a great choice for small to medium-sized projects. 

## Creating a store
The store in Zustand is a custom hook. We can put primitives, objects or functions. The `set()` function merges the state.

**store.js**
```javascript
import { create } from 'zustand'

export const useStore = create((set) => ({
  count: 0,
  decrease: () => set((state) => ({ count: state.count - 1 })),
  increase: () => set((state) => ({ count: state.count + 1 })),
  decreaseBy: (value) => set((state) => { count: state.count - value }),
  increaseBy: (value) => set((state) => { count: state.count + value })
}))
```

## Accessing a state
We just need to import our store and get the state we want from it.

**Counter.jsx**
```javascript
import { useStore } from './store.js'

export default function Counter() {
  const count = useStore((state) => state.count)

  return (
    <>
      <h1>Count: { count }</h1>
    </>
  )
}
```

## Mutating a state
We import our store, get the function to mutate the state, and bind it to an event in our component.

**Counter.jsx**
```javascript
import { useStore } from './store.js'

export default function Counter() {
  const [count, increase] = useStore((state) => [state.count, state.increase])

  return (
    <>
      <h1>Count: {count}</h1>
      <button onClick={increase}>+</button>
    </>
  )
}
```

We can find more information about it by visiting its <a href="https://zustand.docs.pmnd.rs/getting-started/introduction" target="_blank">official documentation</a>.