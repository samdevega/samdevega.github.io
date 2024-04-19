---
title: "Malos olores: Nombres"
pubDate: 2019-03-19T21:02:05Z
tags: ['bad-smells']
---
Algunas herramientas para escoger nombres pueden ser:

* Diccionarios de proyectos.
* Vocabularios del dominio, ontologías y lenguajes.
* Metáforas de *Xtreme Programming*. 

Los buenos nombres cumplen varias funciones:

* Proveen de un vocabulario para discutir nuestro dominio.
* Comunican intención.
* Aportan expectativas sobre cómo funciona el sistema.
* Se apoyan entre sí en un sistema de nombres. 

Para elegir buenos nombres, utiliza las siguientes guías:

* Usa verbos para *mutators* (modifican estado) y nombres o adjetivos para *accesors* (retornan estado).
* Usa la misma palabra para expresar conceptos similares y palabras distintas para expresar conceptos distintos.
* Prefiere nombres de una sola palabra.
* Valora más la comunicación. 

Entre los malos olores que podemos encontrar dentro de una clase, aquellos de una gravedad moderada son los relacionados con los nombres:

* [Type Embedded in Name](#type-embedded-in-name)
* [Uncommunicative Name](#uncommunicative-name)
* [Inconsistent Names](#inconsistent-names)

## Type Embedded in Name
### Qué hacer

Utiliza *Rename Method/Field/Constant* sobre un nombre para comunicar intención sin estar tan ligado a un tipo.

### Recompensas

* Mejora la comunicación.
* Puede facilitar la identificación de duplicidad. 

### Contraindicaciones

* Manten el tipo en el nombre cuando tengas una misma clase de operación para distintos tipos relacionados.
* No elimines el tipo si trabajas bajo un estándar utilizado por el equipo. 

## Uncommunicative Name
### Qué hacer

Utiliza *Rename Method/Field/Constant* para darle un mejor nombre.

### Recompensas

Mejora la comunicación.

### Contraindicaciones

* El uso de nombres como *i/k/j* para índices de iteradores o *c* para caracteres no son muy confusos si el ámbito es pequeño.
* En ocasiones puedes encontrarte con que las variables enumeradas comunican mejor. 

## Inconsistent Names
### Qué hacer

Elige el mejor nombre y utiliza *Rename Method/Field/Constant* para poner el mismo nombre al mismo concepto. Una vez hecho, verás que las clases se ven más similares que antes. Busca entonces olores de duplicidad de código y elimínalos.

### Recompensas

* Mejora la comunicación.
* Puede exponer duplicidad.