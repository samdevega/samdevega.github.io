---
title: "Orientado a objetos: Depende del comportamiento, no de los datos"
pubDate: 2021-10-10T13:45:42+01:00
tags: ['object-oriented']
---
Al programar, se puede caer en la tentación de utilizar variables para almacenar el resultado de la llamada a un método determinado. Esto es particularmente delicado cuando un método habla sobre la lógica de la aplicación.

## Contexto

Supongamos un formulario de acceso, el cual se compone de un email, una contraseña y el correspondiente botón de envío.

Para este punto de la aplicación se han definido las siguientes reglas:
* El email debe ser estructuralmente válido.
* La contraseña debe tener como mínimo ocho caracteres.

El código correspondiente podría ser algo así:

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

## Problema

Como vemos, la lógica del código es correcta, el funcionamiento es el esperado. Por otra parte, haber optado por almacenar la respuesta de la validación en una variable *isValidForm* supone:
* Incrementar el estado de la aplicación.
* Añadir duplicidad.
* Añadir fragilidad.

Se introduce el coste de añadir y mantener tests que validen el nuevo estado. Hay que comprobar que los posibles valores de la variable entran dentro de lo esperado.

Se introduce duplicidad porque la variable es un reflejo del resultado dado por los métodos que contienen la lógica de validación del formulario.

La duplicidad da pie a posibles interpretaciones erróneas sobre la intención de la variable. Otras personas pueden pensar que sería una buena idea cambiar su valor en algún momento intermedio del flujo de la aplicación mediante una simple línea.

```javascript
validateForm()
... // Several lines of code
isValidForm = true // Here is where hell begins!
... // Several lines of code
if (!isValidForm)
  return
// API call
```

A su vez, la visibilidad que se decida dar a dicha variable (hacerla pública por ejemplo) ahora o en un futuro, podría generar un acoplamiento que se extienda por nuestro código hacia otros métodos, clases, componentes, módulos, sistema, el infinito y más allá. Todo ello supone fragilidad.

## Solución
La respuesta es eliminar la variable *isValidForm*.

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

De esta forma se evitan posibles errores de interpretación o uso. Ahora, si se quiere pasar la validación, se fuerza bien a introducir la variable en primer lugar o bien a tener que modificar las propias reglas de validación. Ambos casos son menos triviales que la actualización del valor de una variable ya existente y harán pensar dos veces si lo que se está a punto de hacer es lo que realmente interesa.

Con ello ganamos:
* Eliminar complejidad innecesaria al reducir el estado.
* Eliminar duplicidad, cumplir <a href="https://es.wikipedia.org/wiki/No_te_repitas" target="_blank">DRY</a>.
* Eliminar la posibilidad de crear <a href="https://www.samdevega.com/es/blog/design-principles-cohesion-coupling-and-encapsulation#coupling" target="_blank">acoplamiento</a>, asegurar la <a href="https://www.samdevega.com/es/blog/design-principles-cohesion-coupling-and-encapsulation#cohesion" target="_blank">cohesión</a>.

## Conclusión

A medida que el estado de una aplicación crece, la complejidad lo hace a su vez. Por ello, es una buena decisión evitar la aparición de variables innecesarias.

Cuanto menor sea el estado de una aplicación, más sencilla es de testear, ampliar y mantener en el tiempo.

Es importante tener presente todo lo que puede desencadenar la introducción de una "simple" variable que en primera instancia puede parecer inocua.