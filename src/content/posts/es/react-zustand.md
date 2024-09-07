---
title: "React: Zustand"
pubDate: 2024-09-07T23:00:00Z
tags: ['react']
---
Zustand es una solución de gestión de estados pequeña, rápida y escalable con una sencilla API basada en hooks, que se adapta muy bien a las últimas versiones de React. No requiere configuración y es una gran opción para proyectos pequeños y medianos.

## Crear un store
El store en Zustand es un custom hook. Podemos poner primitivos, objetos o funciones. La función `set()` fusiona el estado.

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

## Acceder a un estado
Solo necesitamos importar nuestro store y obtener el estado que queremos.

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

## Mutar un estado
Importamos nuestro store, obtenemos la función para mutar el estado y la vinculamos a un evento en nuestro componente.

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

Podemos encontrar más información al respecto visitando su <a href="https://zustand.docs.pmnd.rs/getting-started/introduction" target="_blank">documentación oficial</a>.