---
title: "Connascence: Una métrica para el acoplamiento"
pubDate: 2023-12-06T17:20:00Z
tags: ['object-oriented']
---
Esta métrica para la calidad del software fue inventada por Meilir Page-Jones para permitir evaluar el grado de acoplamiento entre los distintos actores en un diseño orientado a objetos. Para ello categoriza el acoplamiento en distintos tipos, sirviendo como una herramienta de análisis para medir el impacto del acoplamiento y una guía para reducirlo.

Para medir la forma de connascence existen tres factores:

* **Fuerza**: Cuando un cambio en un actor implica un cambio en otro. Será más grave cuanto más complejo y costoso sea el cambio.
* **Grado**: La ocurrencia con la que se da el acoplamiento. Será más grave cuantas más veces se repita a lo largo del código.
* **Localidad**: La distancia entre los actores intervinientes en el acoplamiento. Será más grave cuanto más distanciados se encuentren los actores.

<figure>
<img src="/images/connascence-vector.png" alt="connascence vector">
<figcaption>Fuerza (de menor a mayor), grado (de bajo a alto) y localidad (de cerca a lejos).</figcaption>
</figure>

## Tipos de connascence

Los tipos de connascence se dividen en dinámicos y estáticos, yendo en gravedad de más fuertes a más débiles.

Dinámicos
* [Connascence de identidad (CoI)](#connascence-de-identidad)
* [Connascence de valor (CoV)](#connascence-de-valor)
* [Connascence de tiempo (CoT)](#connascence-de-tiempo)
* [Connascence de ejecución (CoE)](#connascence-de-ejecución)

Estáticos
* [Connascence de algoritmo (CoA)](#connascence-de-algoritmo)
* [Connascence de posición (CoP)](#connascence-de-posición)
* [Connascence de significado (CoM)](#connascence-de-significado)
* [Connascence de tipo (CoT)](#connascence-de-tipo)
* [Connascence de nombre (CoN)](#connascence-de-nombre)

### Dinámicos

#### Connascence de identidad

Múltiples elementos hacen referencia a un mismo elemento.

```typescript
// Both controllers knows about ViewsCounter

class ViewsCounter { ... }

class HomeController {
  constructor(private viewsCounter: ViewsCounter) {}

  index() {
    this.viewsCounter.increment()
    ...
  }
}

class PostController {
  constructor(private viewsCounter: ViewsCounter) {}

  index() {
    this.viewsCounter.increment()
    ...
  }
}
```

#### Connascence de valor

Múltiples valores en diferentes elementos deben cambiar conjuntamente.

```typescript
// If PostState changes, so does Post and the test function

enum PostState {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED'
}

class Post {
  private body: string
  private state: PostState
  private title: string

  constructor(title: string) {
    this.body = ''
    this.state = PostState.DRAFT
    this.title = title
  }

  getState() {
    return this.state
  }

  ...
}

test('Post should be created as a draft', () => {
  assert(new Post('My first post').getState()).toEqual('DRAFT')
})
```

#### Connascence de tiempo

El momento de la ejecución de múltiples elementos es importante.

```typescript
// The render function needs the promise to be resolved for rendering the Post list

const getPosts = async (): Promise<Post[]> => {
  return posts
}

getPosts().then((posts) => render(posts))
```

#### Connascence de ejecución

El orden de ejecución de múltiples elementos es importante.

```typescript
// Changing the order of the if clauses in the main function will change its behavior

function isFizz(number: number): boolean { ... }
function isBuzz(number: number): boolean { ... }
function isFizzBuzz(number: number): boolean { ... }

function main(number: number): string {
  if (isFizzBuzz(number)) {
    return 'FizzBuzz'
  }
  if (isFizz(number)) {
    return 'Fizz'
  }
  if (isBuzz(number)) {
    return 'Buzz'
  }
  return number.toString()
}
```

### Estáticos

#### Connascence de algoritmo

Múltiples elementos deben estar de acuerdo en un algoritmo en particular.

```typescript
// Here the test function knows about the algorithm used for the user's password encription

test('User password should be properly encoded', () => {
  const password = 'my_completely_secure_password'
  const user = new User(password, 'John Doe')

  assert(user.getEncodedPassword()).toEqual(md5(password))
})
```

#### Connascence de posición

Múltiples elementos deben estar de acuerdo en el orden de los valores.

```typescript
// Here any consumer of the getUserAddress function have to know the position of each piece of information in order to use it

function getUserAddress(user: User): (string | number)[] {
  return [
    user.getStreetName(),
    user.getStreetNumber(),
    user.getPostalCode(),
    user.getCity(),
    user.getCountry()
  ]
}
```

#### Connascence de significado

Múltiples elementos deben estar de acuerdo en el significado de ciertos valores.

```typescript
// Any consumer of the getRole function needs to know the meaning of its value.
// Does 1 mean Administrator; Customer; Manager; Moderator maybe?

const user = Database.getUserByName('John Doe')

if (user.getRole() === 1) {
  ...
}
```

#### Connascence de tipo

Múltiples elementos deben estar de acuerdo en el tipo de una entidad (es común encontrarlo en lenguajes de tipado débil o dinámico).

```javascript
// Which call will be correct?

function calculateAge(birthYear, birthMonth, birthDay) { ... }

calculateAge(1990, 9, 10)
calculateAge(90, 9, 10)
calculateAge('1990', '9', '10')
calculateAge('1990', 'September', '10')
```

#### Connascence de nombre

Múltiples elementos deben estar de acuerdo en el nombre de una entidad (es inevitable).

```typescript
// Locally changing a property name in one point will break the class.
// Also locally changing a public property or method will break users of Customer class

class Customer {
  constructor(private name: string, private familyName: string) {}

  fullName() {
    return `${this.name} ${this.familyName}`
  }
}
```

## Reducir el acoplamiento

Ahora que somos capaces de catalogar el grado de acoplamiento en un determinado punto de nuestro sistema identificando el tipo de connascence, podemos refactorizar para pasar a un tipo más débil, reduciendo así el acoplamiento.

### Ejemplo: Paso de connascence de posición a connascence de nombre

Antes

```typescript
function getUserAddress(user: User): (string | number)[] {
  return [
    user.getStreetName(),
    user.getStreetNumber(),
    user.getPostalCode(),
    user.getCity(),
    user.getCountry()
  ]
}

// Getting the city
const address = getUserAddress(user)
const city = address[3]
```

Después

```typescript
type UserAddress = {
  streetName: string
  streetNumber: number
  postalCode: number
  city: string
  country: string
}

function getUserAddress(user: User): UserAddress {
  return {
    streetName: user.getStreetName(),
    streetNumber: user.getStreetNumber(),
    postalCode: user.getPostalCode(),
    city: user.getCity(),
    country: user.getCountry()
  }
}

// Getting the city
const address = getUserAddress(user)
const city = address.city
```

### Ejemplo: Paso de connascence de valor a connascence de nombre

Antes

```typescript
enum PostState {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED'
}

class Post {
  private body: string
  private state: PostState
  private title: string

  constructor(title: string) {
    this.body = ''
    this.state = PostState.DRAFT
    this.title = title
  }

  getState() {
    return this.state
  }

  ...
}

// Test knows about Post internal implementation
test('Post should be created as a draft', () => {
  assert(new Post('My first post').getState()).toEqual('DRAFT')
})
```

Después

```typescript
enum PostState {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED'
}

class Post {
  private body: string
  private state: PostState
  private title: string

  constructor(title: string) {
    this.body = ''
    this.state = PostState.DRAFT
    this.title = title
  }

  isPublished(): boolean {
    return this.state === PostState.PUBLISHED
  }

  ...
}

// Test does not know about Post internal implementation
test('Post should be created as a draft', () => {
  assert(new Post('My first post').isPublished()).toBeFalsy()
})
```

## Conclusión

Connascence nos aporta una métrica y un vocabulario común que pueden ser usados por un equipo para hablar sobre acoplamiento. Además nos será de ayuda a la hora de tomar decisiones sobre cambios en el diseño, de cara a mejorarlo.