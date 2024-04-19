---
title: "Malos olores: Duplicación"
pubDate: 2019-03-19T21:29:35Z
tags: ['bad-smells']
---
La duplicación causa los siguientes problemas:

* Hay más código que mantener.
* Las partes que varían están enterradas bajo las partes que se mantienen fijas.
* Variaciones en el código a menudo esconden similitudes más profundas.
* Hay tendencia a reparar un bug en un lugar y dejar otros idénticos sin reparar en otro sitio.

La duplicación del código suele ser síntoma de varios malos olores, como son:

* [Magic Number](#magic-number)
* [Duplicated Code](#duplicated-code)
* [Alternative Classes with Different Interfaces](#alternative-classes-with-different-interfaces)

## Magic Number
### Qué hacer

Utiliza *Replace Magic Number with Symbolic Constant* para el valor específico.
Si los valores son *strings*, puede que te interese aislarlos en alguna estructura (clase *wrapper*, *maps*, etc.)

### Recompensas

* Reduce la duplicidad.
* Mejora la comunicación.

### Contraindicaciones

Los tests suelen ser más legibles cuando simplemente utilizan variables.

## Duplicated Code
### Síntomas

* **Fácil de ver**: Dos fragmentos de código son prácticamente idénticos.
* **Difícil de ver**: Dos fragmentos de código tienen prácticamente el mismo efecto.

### Qué hacer

Si la duplicación se encuentra dentro de uno o dos métodos de la misma clase, utiliza *Extract Method* para mover la parte común a un método separado.

Si la duplicación se encuentra entre dos clases gemelas, utiliza *Extract Method* para crear una rutina única y luego usa *Pull Up Field/Method* para juntar las partes comunes. Luego podrás utilizar *Form Template Method* para crear un algoritmo común en el padre y pasos únicos en los hijos.

Si la duplicación se encuentra en dos clases no relacionadas, extrae la parte común en una nueva clase con *Extract Class*, o identifica si el olor es *Feature Envy* y por tanto el código duplicado pertenece únicamente a una de las dos clases.

Si en ambos lugares el código no es idéntico pero tiene el mismo efecto, decide cual es mejor y utiliza *Substitute Algorithm* para quedarte con una única copia.

### Recompensas

* Reduce la duplicación.
* Reduce el tamaño.
* Puede llevar a una mejor abstracción y mayor flexibilidad.

### Contraindicaciones

* En raras ocasiones puedes concluir que la duplicación es mejor para comunicar la intención y mantenerla.
* Puedes tener duplicación que es mera coincidencia y reducirla puede confundir a quien lo lea.

## Alternative Classes with Different Interfaces
### Síntomas

Dos clases parecen estar haciendo el mismo trabajo pero tienen nombres de métodos distintos.

### Qué hacer

1. Utiliza *Rename Method* para dejarlos similares.
2. Utiliza *Move Method*, *Add Parameter* y *Parameterize Method* para hacer los protocolos (firmas y enfoques) similares.
3. Si ambas clases son similares pero no identicas, utiliza *Extract Superclass* una vez que ambas estén en concordancia.
4. Elimina la clase extra si es posible.

### Recompensas

* Reduce la duplicación.
* Puede reducir el tamaño.
* Puede mejorar la comunicación.

### Contraindicaciones

En ocasiones las dos clases no pueden ser cambiadas (si están en librerías diferentes, por ejemplo). Cada librería puede tener su propia visión para un mismo concepto, pero puedes verte sin una buena forma de unificarlos.