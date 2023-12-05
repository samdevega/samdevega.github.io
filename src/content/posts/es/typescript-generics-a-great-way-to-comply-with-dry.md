---
title: 'TypeScript Generics: Una excelente manera de cumplir con DRY'
pubDate: 2023-12-03T16:30:00Z
tags: ['typescript']
---
En los lenguajes orientados a objetos, se conoce como genéricos a los componentes que pueden trabajar con diversos tipos de datos en lugar de un único tipo. Esto permite a sus consumidores reutilizar la lógica de estos genéricos usando sus propios tipos.

En TypeScript, podemos aprovechar el uso de generics por ejemplo para tener un único tipo para todas las respuestas de una API, crear una única clase para gestionar colas de diferentes elementos o definir el orden en el que se muestran los elementos de una lista independientemente del tipo de dichos elementos. Veamos este último ejemplo en código.

## Ejemplo

Supongamos que en nuestra aplicación tenemos objetos de tipo usuario con la siguiente estructura.

```typescript
type User = {
  age: number
  id: number
  name: string
}
```

En un momento dado de nuestra aplicación, donde tenemos una lista de usuarios, queremos ordenarlos alfabéticamente en orden ascendente (A-Z). Así que añadimos la función correspondiente, preferiblemente sin mutar la lista original.

```typescript
function sortUsersByName(users: User[]): User[] {
  return users.toSorted((a, b) => {
    return a.name > b.name
      ? 1
      : a.name < b.name
        ? -1
        : 0
  })
}
```

Un poco más tarde en el desarrollo, nos piden ordenar una lista de elementos de tipo producto también en base al nombre de los mismos, en orden ascendente. Así que añadimos una segunda función para los productos.

```typescript
type Product = {
  id: number
  name: string
  price: number
}
```

```typescript
function sortProductsByName(products: Product[]): Product[] {
  return products.toSorted((a, b) => {
    return a.name > b.name
      ? 1
      : a.name < b.name
        ? -1
        : 0
  })
}
```

Como podemos ver, acabamos de incumplir el principio <a href="https://es.wikipedia.org/wiki/No_te_repitas" target="_blank">DRY</a> dado que tenemos un bloque de lógica duplicado, cuya intención es la misma. Ordenar los elementos de una lista en base al valor de una de sus propiedades, en un orden determinado.

Este camino puede llevar a una explosión de métodos y duplicación de lógica, si en cualquier momento aparece uno de los siguientes requerimientos:
* Una de las listas que ya disponen de una función de ordenado requieren ser ordenadas por el mismo campo en orden inverso.
* Una de las listas que ya disponen de una función de ordenado requieren ser ordenadas por otro campo.
* Otra lista de otro tipo requiere ser ordenada.

Para solventar el primer punto, refactorizamos la primera función de forma que sea escalable para permitir ordenar dicho campo en orden descendente.

```typescript
type AscendingOrder = 'ascending'
type DescendingOrder = 'descending'
type Order = AscendingOrder | DescendingOrder

function sortUsersByName(users: User[], order: Order = 'ascending'): User[] {
  const sortValues = {
    ascending: [1, -1],
    descending: [-1, 1]
  }

  return users.toSorted((a, b) => {
    return a.name > b.name
      ? sortValues[order][0]
      : a.name < b.name
        ? sortValues[order][1]
        : 0
  })
}
```

Para solventar el segundo punto, refactorizamos la función anterior para permitir el paso del nombre de la propiedad por la que se quiere ordenar como un argumento, aprovechando el operador de tipo _keyof_.

```typescript
function sortUsersBy(users: User[], field: keyof User, order: Order = 'ascending'): User[] {
  const sortValues = {
    ascending: [1, -1],
    descending: [-1, 1]
  }

  return users.toSorted((a, b) => {
    return a[field] > b[field]
      ? sortValues[order][0]
      : a[field] < b[field]
        ? sortValues[order][1]
        : 0
  })
}
```

Por último, para solventar el tercer punto, refactorizamos la función haciendo uso de genéricos.

```typescript
function sortBy<T, K extends keyof T>(list: T[], field: K, order: Order = 'ascending'): T[] {
  const sortValues = {
    ascending: [1, -1],
    descending: [-1, 1]
  }

  return list.toSorted((a, b) => {
    return a[field] > b[field]
      ? sortValues[order][0]
      : a[field] < b[field]
        ? sortValues[order][1]
        : 0
  })
}
```

Ahora tenemos una única función de ordenación de listas que es agnóstica del tipo de elementos y podemos reutilizarla.

```typescript
const users = [
  { id: 2, age: 8, name: 'John' },
  { id: 3, age: 24, name: 'Alex' },
  { id: 1, age: 30, name: 'Carol' },
]
const products = [
  { id: 2, name: 'Potato', price: 3.20 },
  { id: 3, name: 'Cucumber', price: 4.10 },
  { id: 1, name: 'Onion', price: 5.00 },
]

sortBy(users, 'age', 'ascending')
sortBy(users, 'age', 'descending')
sortBy(users, 'name', 'ascending')
sortBy(users, 'name', 'descending')
sortBy(products, 'name', 'ascending')
sortBy(products, 'name', 'descending')
sortBy(products, 'price', 'ascending')
sortBy(products, 'price', 'descending')
```

Como beneficio adicional, TypeScript nos proporcionará ayuda en tiempo de compilación indicándonos si hemos introducido un valor no válido para alguno de los argumentos, además de aportarnos un autocompletado a la hora de escribirlos.