---
title: "React: Hooks explicados"
pubDate: 2024-05-28T20:20:00Z
tags: ['react']
---
Los hooks son utilidades que nos permiten utilizar diferentes características de React de nuestros componentes funcionales. Hay varios hooks de serie, pero incluso podemos construir los nuestros propios usando los de serie como base.

Los hooks cubiertos aquí son:
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
Estos son los hooks que utilizamos cuando necesitamos almacenar algunos datos en nuestro componente. Hay dos hooks que podemos usar para agregar estado a nuestro componente.

### useState
Declara una variable de estado que podemos actualizar directamente.
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
Declara una variable de estado con la lógica de actualización dentro de una función reductora.
Una función reductora es una función pura que nos permite centralizar la lógica de actualización de un estado fuera de un componente. Esto es útil cuando nuestro componente se vuelve lo suficientemente complejo como para que su estado se actualice de varias maneras.

Podemos migrar de `useState` a `useReducer` siguiendo los siguientes pasos:
1. Escribimos una función reductora que devuelve el siguiente estado según la lógica de actualización dentro de nuestros controladores de eventos.
2. Reemplazamos nuestra lógica de controladores de eventos enviando acciones.
3. Reemplazamos `useState` por `useReducer`.

Aquí declaramos la lógica de actualización del estado en nuestra función reductora, *cómo* se actualiza.

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

Aquí usamos el hook `useReducer` y enviamos objetos de acción desde nuestros controladores de eventos, que describen *qué* sucedió.  
Por convención, un objeto de acción contiene una propiedad `type` que describe lo que ya sucedió y alguna información adicional en otros campos.

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
El contexto se utiliza para recibir datos de un componente padre distante sin tener que pasarlos mediante props a través de toda la cadena de componentes.

### useContext
Lee y se suscribe a un contexto.

En el siguiente ejemplo, pasamos el estado `language` a un proveedor de contexto en el componente padre `HomePage` y lo recuperamos del contexto en el componente `Greetings`. El componente del medio, `Banner`, no sabe nada sobre `language`.

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
Las referencias permiten que un componente contenga cierta información que no debería implicar renderizar nuevamente cuando cambia.

### useRef
Declara una referencia que permite que un componente contenga cualquier valor, pero se usa comúnmente para contener un nodo del DOM.

Aquí lo usamos para cambiar el color de fondo.
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

Aquí lo usamos para enfocar un input.
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
Personaliza la referencia expuesta por un componente. Nos permite decidir qué métodos de un elemento referenciado serán accesibles para el componente padre. Es útil cuando no queremos exponer una referencia completa de un elemento del DOM sino solo métodos específicos.

Aquí cambiamos el ejemplo anterior para que la referencia solo comparta el método `focus()` del input en lugar de exponer el elemento del DOM en sí.

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

Una buena práctica es usar `useRef` cuando solo necesitamos acceder al estado de un componente hijo y usar `useImperativeHandle` cuando necesitamos interactuar con el comportamiento del componente hijo.
Un caso de uso para `useImperativeHandle` podría ser una validación de formulario donde el componente hijo sabe cómo validarse a sí mismo y expone su método `isValid()` al componente padre.

## Effect Hooks
Los efectos permiten que un componente se conecte y sincronice con código que no sea React, como obtener datos o interactuar con el DOM del navegador, animaciones o widgets escritos en otra biblioteca de UI, etc. No deberíamos utilizar efectos para orquestar el flujo de datos de una aplicación.

### useEffect
Conecta un componente a un sistema externo.
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
Se activa antes de que el navegador vuelva a pintar la pantalla. A diferencia de `useEffect`, esto se ejecuta de forma sincrónica. Su sintaxis es casi exacta a la del hook anterior.

Deberíamos usar `useLayoutEffect` si el propósito del efecto es mutar el DOM y obtener datos de él. Si no, usaremos `useEffect`.

## Performance Hooks
Estos hooks permiten evitar renderizados innecesarios. Por ejemplo, evitando cálculos o redefinir funciones.

### useMemo
Nos permite almacenar en caché el resultado de un cálculo costoso.

Aquí tenemos una lista enorme de items donde se selecciona el último.

**initialItems.js**
```javascript
export default const initialItems = new Array(50000000).fill(0).map((_, index) => ({
  id: index,
  isSelected: index === 49999999
}))
```

Importamos estos items en nuestro componente y los almacenamos en el estado.

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

El problema con este componente es que cada vez que el botón es pulsado, ejecutará la función `incrementCount`, que actualiza el valor de `count` en el estado, provocando una nueva renderización de todo el componente y eso ejecutará la lógica para definir el item seleccionado una y otra vez.  
El cálculo para encontrar el item seleccionado es muy costoso porque hay que revisar todos los `items` para encontrarlo, pues es el último.
Eso hará que nuestro componente comience a renderizarse con retraso.

Podemos cambiar esto usando el hook `useMemo`.

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

Esto almacenará en caché el resultado de la función `find` en `items` y solo ejecutará el cálculo nuevamente si los `items` cambian, porque los pasamos a `useMemo` como una dependencia en el array del segundo argumento.

### useCallback
Nos permite guardar en caché una definición de función antes de pasarla a un componente optimizado.

Aquí hemos optimizado el componente `SearchInput`.

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

Este componente de entrada se almacena en caché, por lo que no se debe volver a renderizar si sus props no cambian. Pero dado que la propiedad `onChange` es una función y la referencia de una función es diferente en cada renderizado. Hará que este componente se vuelva a renderizar cuando cambie el estado de su componente padre, incluso si el input no tiene nada que ver con ese estado.  
Para evitar esta situación, podemos usar `useCallback` en el componente padre.

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

El uso de `useCallback` congelará la definición de la función después del primer renderizado, incluidos todos los datos dentro de la función, si no se agrega al array de dependencia del segundo parámetro.

### useTransition
Nos permite actualizar el estado sin bloquear la interfaz de usuario.
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
Permite posponer la actualización de una parte no crítica de la UI y dejar que otras partes se actualicen primero.
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
Ahora podemos pasar la `deferredQuery` al componente `Child`, que funcionará con un valor eventualmente sincronizado, permitiéndonos priorizar la actualización del `input` sin demora alguna.

## Custom Hooks
A veces tenemos un comportamiento común entre componentes. En esos casos, para evitar duplicación, podemos extraer esa lógica en una función de JavaScript, que será nuestro custom hook.
Para mantenerlo simple, aquí podemos ver cómo extraer la lógica del primer ejemplo, el hook [useState](#usestate).

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

Hay otros Hooks de React de serie. Podemos encontrarlos visitando su <a href="https://react.dev/reference/react/hooks" target="_blank">documentación oficial</a>.