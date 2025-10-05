---
title: "React: Más hooks explicados"
pubDate: 2025-08-17T18:00:00Z
tags: ['react']
image:
  url: "/images/react.jpg"
  alt: "Desarrollar de una aplicación web usando React"
---
React en su versión 18 introdujo nuevos hooks, no incluídos en el anterior artículo <a href="/es/blog/react-hooks-explained">React: Hooks explicados</a>, que serán explicados aquí:
* <a href="#useformstatus">useFormStatus</a>
* <a href="#useinsertioneffect">useInsertionEffect</a>
* <a href="#usesyncexternalstore">useSyncExternalStore</a>

## State Hooks
### useFormStatus
Este hook permite interactuar con los estados de los formularios. Permite realizar un seguimiento del estado de los envíos como _pending_, _submitted_, _error_, lo que facilita su gestión en aplicaciones React modernas, especialmente con renderizado concurrente.

**MyForm.jsx**
```javascript
import { useFormStatus, useState } from 'react'

export const MyForm = ({ submit }) => {
  const { pending, formStatus, setFormStatus } = useFormStatus()
  const [email, setEmail] = useState('')
  const [error, setError] = useState(null)
  const isPending = formStatus === 'pending'
  const isError = formStatus === 'error'

  const handleSubmit = async (event) => {
    event.preventDefault()
    setFormStatus('pending')
    try {
      await submit(email)
      setFormStatus('submitted')
    } catch () {
      setFormStatus('error')
      setError('Submission error. Please try again.')
    }
  }

  return (
    <div>
      <h1>My Form</h1>      
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <button type="submit" disabled={isPending}>
          {isPending ? 'Submitting...' : 'Submit'}
        </button>
        {isError && <p>{error}</p>}
      </form>
    </div>
  )
}
```

## Effect Hooks
### useInsertionEffect
Este hook permite ejecutar efectos secundarios sincrónicamente, antes de que las mutaciones se confirmen en el DOM. Es útil cuando se necesita insertar algo en el DOM, como añadir una hoja de estilos, antes de que React renderice la página. Forma parte de la API de bajo nivel para gestionar las mutaciones del DOM de forma segura.

**DynamicStylesheet.jsx**
```javascript
import { useInsertionEffect } from 'react'
import { theme } from '@/config'

export const DynamicStylesheet = () => {  
  useInsertionEffect(() => {
    const styleElement = document.createElement('style')
    styleElement.innerHTML = `
      body {
        background-color: ${theme === 'dark' ? '#333' : '#FFF'}
        color: ${theme === 'dark' ? '#FFF' : '#000'}
      }
    `
    document.head.appendChild(styleElement)
    
    return () => {
      document.head.removeChild(styleElement)
    }
  }, [theme])
  
  return <div>Content with dynamic styles based on theme</div>
}
```

## Hooks para bibliotecas de terceros
### useSyncExternalStore
Este hook permite suscribirse a stores externos o estados fuera de React, lo que garantiza la consistencia al usar renderizado concurrente. Está diseñado para funcionar correctamente con bibliotecas como Redux, Zustand o cualquier otra implementación de store personalizada.

**store.js**
```javascript
import create from 'zustand'

export const useStore = create((set) => ({
  count: 0,
  decrease: () => set((state) => ({ count: state.count - 1 })),
  increase: () => set((state) => ({ count: state.count + 1 })),
}))
```

**Counter.jsx**
```javascript
import { useSyncExternalStore } from 'react'
import { useStore } from '@/store'

export const Counter = () => {
  const [count, decrease, increase] = useStore((state) => [
    state.count,
    state.decrease,
    state.increase
  ])
  const syncCount = useSyncExternalStore(
    useStore.subscribe,
    () => count,
    () => count
  )

  return (
    <div>
      <h1>Count: {syncCount}</h1>
      <button onClick={decrease}>Decrease</button>
      <button onClick={increase}>Increase</button>
    </div>
  )
}
```

Estos hooks proporcionan una forma más controlada de interactuar con el ciclo de vida y el estado externo de React, lo que facilita la gestión de aplicaciones complejas y concurrentes.