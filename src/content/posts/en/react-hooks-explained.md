---
title: "React: Hooks explained"
pubDate: 2024-05-28T20:20:00Z
tags: ['react']
---
Hooks are utilities that allow us to use different React features from our functional components. There are several build-in hooks, but we can even build our own using the build-in ones as a base.

The hooks covered here are:
* [useState](#usestate)
* [useReducer](#usereducer)
* [useContext](#usecontext)
* [useRef](#useref)
* [useImperativeHandle](#useimperativehandle)
* [useEffect](#useeffect)
* [useLayoutEffect](#uselayouteffect)
* [useMemo](#usememo)
* [useCallback](#usecallback)
* [useTransition](#usetransition)
* [useDeferredValue](#usedeferredvalue)
* [Custom Hooks](#custom-hooks)

## State Hooks
These are the hooks that we use when we need to store some data in our component. There are two hooks that we can use to add state to our component.

### useState
Declares a state variable that we can update directly.
```javascript
export default function Counter() {
  const [count, setCount] = useState(0)

  function handleClick() {
    setCount(count + 1)
  }

  return (
    <button onClick={handleClick}>
      Clicked {count} times!
    </button>
  )
}
```

### useReducer
Declares a state variable with the update logic inside of a reducer function.  
A reducer function is a pure function which allow us to centralize the update logic of an state out of a component. This is useful when our component becomes complex enough that its state is updated in several ways.

We can migrate from `useState` to `useReducer` following the next steps:
1. We write a reducer function which returns the next state based on the update logic inside our event controllers.
2. We replace our event controllers logic by dispatching actions.
3. We replace `useState` by `useReducer`.

Here we declare the update logic of the state in our reducer function, *how* it is updated.

**taskReducer.js**
```javascript
export default function taskReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [
        ...tasks,
        {
          id: action.id,
          text: action.text,
          done: false
        },
      ]
    }
    case 'changed': {
      return tasks.map(task => task.id === action.task.id ? action.task : task)
    }
    case 'deleted': {
      return tasks.filter(task => task.id !== action.id)
    }
    default: {
      throw new Error(`Action ${action.type} is not implemented!`)
    }
  }
}
```

Here we use the `useReducer` hook and dispatch action objects from our event controllers, which describe *what* happened.  
By convention, an action object contains a `type` property that describes what has already happened and some extra information in other fields.

**TaskPage.jsx**
```javascript
import { useReducer } from 'react'
import AddTask from './AddTask'
import TaskList from './TaskList'
import tasksReducer from './taskReducer.js'

let nextId = 0
const initialTasks = []

export default function TaskPage() {
  const [tasks, dispatch] = useReducer(taskReducer, initialTasks)

  function handleAddTask(text) {
    dispatch({
      type: 'added',
      id: nextId++,
      text: text
    })
  }

  function handleChangeTask(task) {
    dispatch({
      type: 'changed',
      task: task
    })
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId
    })
  }

  return (
    <>
      <AddTask onAddTask={handleAddTask} />
      <TaskList
        tasks={tasks}
        onChangeTask={handleChangeTask}
        onDeleteTask={handleDeleteTask}
      />
    </>
  )
}
```

## Context Hooks
Context is used for receiving data from a distant parent component without having to pass it via props through all the component chain.

### useContext
Reads and subscribes to a context.

In the next example, we pass the `language` state to a context provider in the parent component `HomePage` and we get it back from context in the component `Greetings`. The component in the middle, `Banner`, knows nothing about `language`.

**Language.js**
```javascript
export default const Language = Object.freeze({
  English: 'en',
  Spanish: 'es'
})
```

**LanguageContext.js**
```javascript
import { createContext } from 'react'

export default const LanguageContext = createContext()
```

**HomePage.jsx**
```javascript
import { useState } from 'react'
import Language from './Language'
import LanguageContext from './LanguageContext'
import Banner from './Banner'

export default function HomePage() {
  const [language, setLanguage] = useState(Language.English)
  const buttons = Language.map((value, key) =>
    <button key={key} onClick={() => setLanguage(value)}>
      Display in {key}
    </button>
  )

  return (
    <LanguageContext.Provider value={language}>
      <Banner />
      {buttons}
    </LanguageContext.Provider>
  )
}
```

**Banner.jsx**
```javascript
import Greetings from './Greetings'

export default function Banner() {
  <>
    <p>
      Next message will be displayed
      in the current language without
      receiving it via props.
    </p>
    <Greetings />
  </>
}
```

**Greetings.jsx**
```javascript
import Language from './Language'
import LanguageContext from './LanguageContext'

export default function Greetings() {
  const language = useContext(LanguageContext)

  function greet() {
    switch (language) {
      case Language.Spanish:
        return '¡Hola!'
      case Language.English:
      default:
        return 'Hello!'
    }
  }

  return (
    <p>{greet()}</p>
  )
}
```

## Ref Hooks
Refs allow a component to hold some information which should not imply rendering again when it changes.

### useRef
Declares a ref that allow a component to hold any value, but it is commonly used to hold a DOM node.

Here we use it for changing a background color.
```javascript
import { useRef } from 'react'

export default function SomeComponent() {
  const wrapperRef = useRef(null)

  function toggleBackgroundColor() {
    wrapperRef.current.style.backgroundColor =
      wrapperRef.current.style.backgroundColor === 'white'
        ? 'black'
        : 'white'
  }

  return (
    <div
      ref={wrapperRef}
      style={{backgroundColor: 'white', height: '250px', width: '250px'}}
    >
      <button onClick={toggleBackgroundColor}>Toggle background color</button>
    </div>
  )
}
```

Here we use it for focusing an input.
```javascript
import { useRef } from 'react'

export default function SomeComponent() {
  const inputRef = useRef(null)

  function focusInput() {
    inputRef.current.focus()
  }

  return (
    <>
      <input ref={inputRef} type='text' />
      <button onClick={focusInput}>Focus input</button>
    </>
  )
}
```

### useImperativeHandle
Customizes the reference exposed by a component. It lets us decide which methods of a referenced element will be accessible to the parent component. It is useful when we do not want to expose a whole DOM element reference but just specific methods.

Here we change the previous example so the reference only shares the `focus()` method of the input instead of exposing the DOM element itself.

**TextInput.jsx**
```javascript
import { forwardRef, useRef, useImperativeHandle } from 'react'

export default forwardRef(function TextInput() {
  const inputRef = useRef(null)

  useImperativeHandle(ref, function() {
    return {
      focus() {
        inputRef.current.focus()
      }
    }
  }, [])

  return (
    <input ref={inputRef} type='text' />
  )
})
```

**Parent.jsx**
```javascript
import { useRef } from 'react'
import TextInput from './TextInput'

export default function Parent() {
  const ref = useRef(null)

  function handleClick() {
    ref.current.focus()
  }

  return (
    <>
      <TextInput ref={ref} />
      <button onClick={focusInput}>Focus input</button>
    </>
  )
}
```

A good practice is to use `useRef` when we only need access to the state of a child component and to use `useImperativeHandle` when we need to interact with the behavior of the child component.  
A use case for `useImperativeHandle` could be a form validation where the child component knows how to validate itself and exposes its `isValid()` method to the parent component.

## Effect Hooks
Effects let a component to connect and synchronize with non React code such as fetching data or interact with browser DOM, animations or widgets written another UI library and so on. We should not use effects to orchestrate the data flow of an application.

### useEffect
Connects a component to an external system.
```javascript
export default function RandomComponent() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async function () {
      try {
        setLoading(true)
        const response = await fetch.('https://some_url')
        if (response.ok) {
          setData(response.json())
        }
      } catch (error) {
        throw error
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <div>
      {loading && <p>'Loading...'</p>}
      {data?.message && <p>{data.message}</p>}
    </div>
  )
}
```

### useLayoutEffect
Fires before the browser repaints the screen. Unlike `useEffect`, this is executed synchronously. It syntax is almost exact as the previous hook.

We should use `useLayoutEffect` if the purpose of the effect is to mutate the DOM and get data from it. If not, we will use `useEffect`.

## Performance Hooks
These hooks allow to avoid unnecessary re-rendering. For example, skipping calculations or redefining functions.

### useMemo
Lets us cache the result of an expensive calculation.

Here we have a huge list of items where the last one is being selected.

**initialItems.js**
```javascript
export default const initialItems = new Array(50000000).fill(0).map((_, index) => ({
  id: index,
  isSelected: index === 49999999
}))
```

We import this items in our component and we stored them into the state.

**WithoutUseMemo.jsx**
```javascript
import { useState } from 'react'
import initialItems from './initialItems'

export default function WithoutUseMemo() {
  const [count, setCount] = useState(0)
  const [items] = useState(initialItems)

  const selectedItem = items.find(item => item.isSelected)

  function incrementCount() {
    setCount(count + 1)
  }

  return (
    <>
      <strong>Count:</strong> {count}<br />
      <strong>Selected item:</strong> {selectedItem.id}<br />
      <button onClick={incrementCount}>Increment count</button>
    </>
  )
}
```

The issue with this component is that every time the button is clicked, it will run the `incrementCount` function, which updates the value of the `count` in state, causing a re-render of the whole component and that will execute the logic to define the selected item again and again.  
The calculation for finding the selected item is very expensive cause it has to go through the whole `items` to find the selected one, which is the last one.  
That will cause our component to start re-rendering with delay.

We can change this using the `useMemo` hook.

**WithUseMemo.jsx**
```javascript
import { useMemo, useState } from 'react'
import initialItems from './initialItems'

export default function WithUseMemo() {
  const [count, setCount] = useState(0)
  const [items] = useState(initialItems)

  const selectedItem = useMemo(
    () => items.find(item => item.isSelected),
    [items]
  )

  function incrementCount() {
    setCount(count + 1)
  }

  return (
    <>
      <strong>Count:</strong> {count}<br />
      <strong>Selected item:</strong> {selectedItem.id}<br />
      <button onClick={incrementCount}>Increment count</button>
    </>
  )
}
```

This will cache the result of the `find` function on `items` and will only execute the calculation again if `items` change, cause we passed them to `useMemo` as a dependency in the second argument array.

### useCallback
Lets us cache a function definition before passing it down to an optimized component.

Here we have optimized the `SearchInput` component.

**SearchInput.jsx**
```javascript
import { memo } from 'react'

export default memo(function SearchInput({ onChange }) {
  return (
    <input
      type='text'
      placeholder='Search...'
      onChange={(event) => onChange(event.target.value)}
    />
  )
})
```

This input component is cached so it should not be re-rendered if its props do not change. But since the `onChange` prop is a function and a function reference is different on each render. It will cause this component to re-render when an state of its parent component change, even if the input has nothing to do with that state.  
To avoid this situation, we can use `useCallback` in the parent component.

**ParentUseCallback.jsx**
```javascript
import { useCallback, useState } from 'react'
import SearchInput from './SearchInput'

const initialBooks = [
  '1984',
  'Brave New World',
  'Do Androids Dream of Electric Sheep?',
  'Ubik',
]

export default function ParentUseCallback() {
  const [books, setBooks] = useState(initialBooks)

  const handleSearch = useCallback((text) => {
    const filteredBooks = initialBooks.filter((book) => book.includes(text))
    setBooks(filteredBooks)
  }, [])

  function shuffle(list) {
    const listCopy = [...list]
    return listCopy.sort(() => Math.random() - 0.5)
  }

  return (
    <>
      <button onClick={() => setBooks(shuffle(allBooks))}>
        Shuffle
      </button>
      <SearchInput onChange={handleSearch} />
      <ul>
        {books.map((book) => (
          <li key={book}>{book}</li>
        ))}
      </ul>
    </>
  )
}
```

Using `useCallback` will freeze the definition of the function after the first render, including every data inside the function itself, if it is not added to the dependency array of the second parameter.

### useTransition
Lets us to update the state without blocking the UI.
```javascript
import { useState, useTransition } from 'react'

export default function TabContainer() {
  const [isPending, startTransition] = useTransition()
  const [tab, setTab] = useState('home')

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab)
    })
  }
  ...
}
```

### useDeferredValue
Allows us to defer updating a non-critical part of the UI and let other parts update first.
```javascript
import { useDeferredValue, useState } from 'react'
import Child from './Child'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query)
  
  return (
    <>
      <input
        type='text'
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <Child text={deferredQuery} />
    </>
  )
}
```
We can now pass the `deferredQuery` to the `Child` component, which will work with an eventually synchronized value, allowing us to prioritize updating of the `input` without any delay.

## Custom Hooks
Sometimes we have a common behavior between components. In those cases, to avoid duplication, we can extract that logic into a JavaScript function, which will be our custom hook.  
To keep it simple, here we can see how to extract the logic of the first example, the one about the [useState](#usestate) hook.

**useCount.js**
```javascript
import { useState } from 'react'

export default function useCount(initialValue = 0) {
  const [count, setCount] = useState(initialValue)

  function increment() {
    setCount(count + 1)
  }

  return [
    count,
    increment
  ]
}
```

**Counter.jsx**
```javascript
import useCount from './useCount'

export default function Counter() {
  const [count, increment] = useCount()

  return (
    <button onClick={increment}>
      Clicked {count} times!
    </button>
  )
}
```

There are other build-in React Hooks. We can find them by visiting its <a href="https://react.dev/reference/react/hooks" target="_blank">official documentation</a>.