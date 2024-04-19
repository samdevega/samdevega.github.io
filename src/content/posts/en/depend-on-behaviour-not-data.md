---
title: "Object-oriented: Depend on behavior, not data"
pubDate: 2021-10-10T13:45:42+01:00
tags: ['object-oriented']
---
When programming, you can be tempted to use variables to store the result of calling a specific method. This is particularly tricky when a method talks about application logic.

## Context

Let's assume an access form, which consists of an email, a password and the corresponding submit button.

For this point of the application the following rules have been defined:
* The email must be structurally valid.
* The password must have at least eight characters.

The corresponding code could be something like this:

```javascript
const email // Stored input email value
const password // Stored input password value
let isValidForm = false

const validateEmail = () => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

const validatePassword = () => {
  return password.length > 7
}

const validateForm = () => {
  isValidForm = validateEmail() && validatePassword()
}

const submitForm = () => {
  validateForm()
  if (!isValidForm)
    return
  // API call
}
```

## Problem

As we see, the logic of the code is correct, the operation is as expected. On the other hand, having chosen to store the validation response in a variable *isValidForm* means:
* Increase application status.
* Add duplicity.
* Add fragility.

The cost of adding and maintaining tests that validate the new state is introduced. It is necessary to check that the possible values of the variable fall within what is expected.

Duplication is introduced because the variable is a reflection of the result given by the methods that contain the form validation logic.

Duplicity gives rise to possible erroneous interpretations about the intention of the variable. Other people may think it would be a good idea to change its value somewhere in the middle of the application flow using a simple line.

```javascript
validateForm()
... // Several lines of code
isValidForm = true // Here is where hell begins!
... // Several lines of code
if (!isValidForm)
  return
// API call
```

In turn, the visibility that we decide to give to said variable (make it public, for example) now or in the future, could generate a coupling that extends through our code to other methods, classes, components, modules, system, infinity and beyond. All this implies fragility.

## Solution
The answer is to remove the *isValidForm* variable.

```javascript
const email // Stored input email value
const password // Stored input password value

const validateEmail = () => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

const validatePassword = () => {
  return password.length > 7
}

const validateForm = () => {
  return validateEmail() && validatePassword()
}

const submitForm = () => {
  if (!validateForm())
    return
  // API call
}
```

In this way, possible errors in interpretation or use are avoided. Now, if you want to pass the validation, you are forced to either enter the variable first or have to modify the validation rules themselves. Both cases are less trivial than updating the value of an already existing variable and will make you think twice about whether what you are about to do is what is really interesting.

With this we gain:
* Eliminate unnecessary complexity by reducing state.
* Eliminate duplicity, comply with <a href="https://en.wikipedia.org/wiki/Don%27t_repeat_yourself" target="_blank">DRY</a>.
* Remove the ability to create <a href="/en/blog/cohesion-coupling-and-encapsulation#coupling" target="_blank">coupling</a> , ensure <a href="/en/blog/cohesion-coupling-and-encapsulation#cohesion" target="_blank">cohesion</a>.

## Conclusion

As the state of an application grows, so does the complexity. Therefore, it is a good decision to avoid the appearance of unnecessary variables.

The lower the state of an application, the easier it is to test, expand and maintain over time.

It is important to keep in mind everything that can trigger the introduction of a "simple" variable that at first may seem innocuous.