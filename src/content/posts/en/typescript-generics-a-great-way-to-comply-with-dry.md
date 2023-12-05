---
title: 'TypeScript Generics: A great way to comply with DRY'
pubDate: 2023-12-03T16:30:00Z
tags: ['typescript']
---
In object-oriented languages, components that can work with various types of data instead of a single type are known as generics. This allows consumers to reuse the logic of these generics using their own types.

In TypeScript, we can take advantage of the use of generics, for example to have a single type for all the responses of an API, create a single class to manage queues of different elements or define the order in which the elements of a list are displayed regardless of the type of said elements. Let's look at this last example in code.

## Example

Suppose that in our application we have objects of type user with the following structure.

```typescript
type User = {
  age: number
  id: number
  name: string
}
```

At a given point in our application, where we have a list of users, we want to sort them alphabetically in ascending order (A-Z). So we add the corresponding function, preferably without mutating the original list.

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

A little later in the development, we are asked to sort a list of product type elements also based on their name, in ascending order. So we added a second function for products.

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

As we can see, we have just violated the <a href="https://en.wikipedia.org/wiki/Don%27t_repeat_yourself" target="_blank">DRY</a> principle since we have a duplicate logic block, whose intent is the same. Sort the elements of a list based on the value of one of its properties, in a specific order.

This path can lead to an explosion of methods and duplication of logic, if at any time one of the following requirements appears:
* One of the lists that already have a sort function requires being sorted by the same field in reverse order.
* One of the lists that already have a sort function requires being sorted by another field.
* Another list of another type requires sorting.

To solve the first point, we refactor the first function so that it is scalable to allow said field to be sorted in descending order.

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

To solve the second point, we refactor the previous function to allow passing the name of the property by which we want to sort as an argument, taking advantage of the _keyof_ type operator.

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

Finally, to solve the third point, we refactor the function using generics.

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

We now have a single list sort function that is element type agnostic and we can reuse it.

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

As a bonus, TypeScript will provide us with help at compile time, telling us if we have entered an invalid value for any of the arguments, in addition to providing autocompletion when writing them.