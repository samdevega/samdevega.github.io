---
title: "React: More hooks explained"
pubDate: 2025-08-17T18:00:00Z
tags: ['react']
---
React version 18 introduced new hooks, not included in the previous article <a href="/en/blog/react-hooks-explained">React: Hooks explained</a>, which will be explained here:
* <a href="#useformstatus">useFormStatus</a>
* <a href="#useinsertioneffect">useInsertionEffect</a>
* <a href="#usesyncexternalstore">useSyncExternalStore</a>

## State Hooks
### useFormStatus
This hook allows you to interact with form states. It tracks the status of submissions such as _pending_, _submitted_ or _error_, making them easier to manage in modern React applications, especially with concurrent rendering.

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
This hook allows you to execute side effects synchronously, before mutations are committed to the DOM. It's useful when you need to insert something into the DOM, such as adding a stylesheet, before React renders the page. It's part of the low-level API for safely handling DOM mutations.

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

## Hooks for Third-Party Libraries
### useSyncExternalStore
This hook allows you to subscribe to external stores or states outside of React, ensuring consistency when using concurrent rendering. It's designed to work well with libraries like Redux, Zustand, or any other custom store implementation.

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

These hooks provide a more controlled way to interact with the React lifecycle and external state, making it easier to manage complex, concurrent applications.