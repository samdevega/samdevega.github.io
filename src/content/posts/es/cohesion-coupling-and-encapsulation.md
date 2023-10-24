---
title: "Orientado a objetos: Cohesión, acoplamiento y encapsulamiento"
pubDate: 2019-06-23T09:51:33Z
tags: ['object-oriented']
---
## Cohesión

En el diseño orientado a objetos, se entiende por cohesión (*cohesion* en inglés) al grado en el que los distintos elementos de un módulo se mantienen unidos a dicho módulo. Es decir, aquellos elementos que pueden entenderse como parte de un concepto que los engloba, deberían estar dentro de este y no dispersos en otros módulos.

<figure>
<img src="/images/cohesion-coupling-and-encapsulation-1.png" alt="cohesion">
<figcaption>Los elementos convergen hacia su propio módulo. Son conocidos y usados sólo por este.</figcaption>
</figure>

## Acoplamiento

Por otra parte, el acoplamiento (*coupling* en inglés) se refiere al grado en el que los distintos módulos de un sistema son independientes unos de otros. Cuando un módulo accede directamente a un elemento de otro módulo para definir su comportamiento, se dice que ambos módulos están acoplados.

<figure>
<img src="/images/cohesion-coupling-and-encapsulation-2.png" alt="coupling">
<figcaption>Los elementos salen hacia otros módulos. Son conocidos y usados por ellos.</figcaption>
</figure>

Ambos, cohesión y acoplamiento, pueden entenderse como fuerzas gravitatorias opuestas, dado que la necesidad de relacionarse entre módulos dará como resultado la aparición de estos.

Así, cuanta mayor cohesión tenga un sistema, menor será su acoplamiento y viceversa.

## Encapsulamiento

El encapsulamiento (*encapsulation* en inglés) es una de las guías del diseño orientado a objetos que enuncia que el estado (conjunto del valor de las propiedades) de un objeto nunca debe ser expuesto, de forma que este solo cambie por su propio comportamiento (sus métodos).

Podemos darnos cuenta de que este concepto propicia la cohesión frente al acoplamiento. Esto es algo que debemos buscar en el diseño de nuestros sistemas. Desde el nivel más básico, el de clase, como a los más abstractos, la interacción entre grupos de clases (entendidos como *packages* en algunos lenguajes como *Java*) o incluso en la interacción de nuestro sistema con otros.