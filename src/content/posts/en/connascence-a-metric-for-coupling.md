---
title: "Connascence: A metric for coupling"
pubDate: 2023-12-06T17:20:00Z
tags: ['object-oriented']
---
This metric for software quality was invented by Meilir Page-Jones to allow evaluating the degree of coupling between the different actors in an object-oriented design. To do this, it categorizes coupling into different types, serving as an analysis tool to measure the impact of coupling and a guide to reduce it.

To measure the form of connascence there are three factors:

* **Strength**: When a change in one actor implies a change in another. It will be more serious the more complex and expensive the change is.
* **Degree**: The occurrence with which the coupling occurs. It will be more serious the more times it is repeated throughout the code.
* **Locality**: The distance between the actors involved in the coupling. It will be more serious the more distanced the actors are.

<figure>
<img src="/images/connascence-vector.png" alt="connascence vector">
<figcaption>Strength (from low to high), degree (from low to high), and locality (from near to far).</figcaption>
</figure>

## Types of Connascence

The types of connascence are divided into dynamic and static, going in severity from strongest to weakest.

Dynamic
* [Connascence of Identity (CoI)](#connascence-of-identity)
* [Connascence of Value (CoV)](#connascence-of-value)
* [Connascence of Timing (CoT)](#connascence-of-timing)
* [Connascence of Execution (CoE)](#connascence-of-execution)

Static
* [Connascence of Algorithm (CoA)](#connascence-of-algorithm)
* [Connascence of Position (CoP)](#connascence-of-position)
* [Connascence of Meaning (CoM)](#connascence-of-meaning)
* [Connascence of Type (CoT)](#connascence-of-type)
* [Connascence of Name (CoN)](#connascence-of-name)

### Dynamic

#### Connascence of Identity

Multiple elements refer to the same element.

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

#### Connascence of Value

Multiple values in different elements must change together.

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

#### Connascence of Timing

The timing of execution of multiple elements is important.

```typescript
// The render function needs the promise to be resolved for rendering the Post list

const getPosts = async (): Promise<Post[]> => {
  return posts
}

getPosts().then((posts) => render(posts))
```

#### Connascence of Execution

The order of execution of multiple elements is important.

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

### Static

#### Connascence of Algorithm

Multiple elements must agree on a particular algorithm.

```typescript
// Here the test function knows about the algorithm used for the user's password encription

test('User password should be properly encoded', () => {
  const password = 'my_completely_secure_password'
  const user = new User(password, 'John Doe')

  assert(user.getEncodedPassword()).toEqual(md5(password))
})
```

#### Connascence of Position

Multiple elements must agree on the order of values.

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

#### Connascence of Meaning

Multiple elements must agree on the meaning of certain values.

```typescript
// Any consumer of the getRole function needs to know the meaning of its value.
// Does 1 mean Administrator; Customer; Manager; Moderator maybe?

const user = Database.getUserByName('John Doe')

if (user.getRole() === 1) {
  ...
}
```

#### Connascence of Type

Multiple elements must agree on the type of an entity (commonly found in weakly or dynamically typed languages).

```javascript
// Which call will be correct?

function calculateAge(birthYear, birthMonth, birthDay) { ... }

calculateAge(1990, 9, 10)
calculateAge(90, 9, 10)
calculateAge('1990', '9', '10')
calculateAge('1990', 'September', '10')
```

#### Connascence of Name

Multiple elements must agree on the name of an entity (it's inevitable).

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

## Reduce coupling

Now that we are able to catalog the degree of coupling at a given point in our system by identifying the type of connascence, we can refactor to a weaker type, thus reducing coupling.

### Example: Passing from Connascence of Position to Connascence of Name

Before

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

After

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

### Example: Passing from Connascence of Value to Connascence of Name

Before

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

After

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

## Conclusion

Connascence gives us a common metric and vocabulary that can be used by a team to talk about coupling. It will also help us when making decisions about changes to the design, in order to improve it.