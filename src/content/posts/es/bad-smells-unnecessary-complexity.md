---
title: "Malos olores: Complejidad innecesaria"
pubDate: 2019-03-19T21:14:35Z
tags: ['bad-smells']
---
>"Todo debería hacerse lo más simple posible. Pero no más simple."
>
>-- <cite>Albert Einstein</cite>

La complejidad innecesaria del código puede presentarse en los siguientes malos olores:

* [Dead Code](#dead-code)
* [Speculative Generality](#speculative-generality)

## Introducción

Sigue el principio *YAGNI* (You Aren’t Gonna Need It).

## Dead Code
### Qué hacer

Elimina el código no utilizado y los tests asociados.

### Recompensas

* Reduce el tamaño.
* Mejora la comunicación.
* Mejora la simplicidad.

### Contraindicaciones

No elimines código que pueda ser utilizado para dar soporte a clientes aunque no sea utilizado dentro de tu framework.

## Speculative Generality
### Qué hacer

* Para clases innecesarias:
  * Si los padres o hijos de la clase parecen el sitio correcto para el comportamiento, mételo dentro de uno de ellos con *Colapse Hierarchy*.
  * En otro caso, mételo dentro del *caller* con *Inline Class*.
* Para métodos innecesarios, utiliza *Inline Method* o *Remove Method*.
* Para un campo innecesario, asegúrate de que no hay referencias al mismo y elimínalo.
* Para un parámetro innecesario, utiliza *Remove Parameter*.

### Recompensas

* Reduce el tamaño.
* Mejora la comunicación.
* Mejora la simplicidad.

### Contraindicaciones

* No elimines código que pueda ser utilizado para dar soporte a clientes aunque no sea utilizado dentro de tu framework.
* Si algunos elementos son utilizados por los tests y le dan a este información privilegiada sobre la clase, puede ser indicativo de que no estás teniendo en cuenta una abstracción que puedas testear de forma independiente.