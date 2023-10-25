---
title: "Malos olores: Alojando el cambio"
pubDate: 2019-03-20T17:31:25Z
tags: ['bad-smells']
---
Algunos problemas se vuelven más aparentes cuando intentas cambiar el código. Lo ideal es que una decisión de cambio afecte sólo a un único lugar. Cuando esto no sucede, es una señal de duplicidad de código. Detectar estos problemas suele tener otros beneficios como facilitar la testeabilidad del código.

Los malos olores relativos al cambio simultáneo forzado entre clases son:

* [Divergent Change](#divergent-change)
* [Shotgun Surgery](#shotgun-surgery)
* [Parallel Inheritance Hierarchies](#parallel-inheritance-hierarchies)
* [Combinatorial Explosion](#combinatorial-explosion)

## Divergent Change
### Síntomas

Una misma clase necesita cambiar por diferentes motivos.

### Qué hacer

* Si la clase encuentra un objeto y hace algo con él, deja que el cliente encuentre el objeto y pásaselo o deja que la clase retorne un valor que el cliente use.
* Usa *Extract Class* para crear clases separadas para cada decisión.
* Si varias clases están compartiendo el mismo tipo de decisiones, puedes unificarlas en una nueva clase con *Extract Superclass* o *Extract Subclass*. Llegado el caso estas clases pueden formar una capa.

### Recompensas

* Mejora la comunicación (al expresar mejor la intención).
* Mejora la estructura para futuros cambios.

## Shotgun Surgery
### Síntomas

Hacer un cambio supone modificar varias clases.

### Qué hacer

* Identifica la clase que debería contener el grupo de cambios. Puede ser una clase existente o que tengas que crearla con *Extract Class*.
* Usa *Move Field* y *Move Method* para llevar la funcionalidad a la clase elegida. Una vez que las clases restantes sean lo suficientemente simples, puedes usar *Inline Class* para eliminarlas.

### Recompensas

* Reduce la duplicidad.
* Mejora la comunicación.
* Mejora la mantenibilidad (los próximos cambios estarán más localizados).

## Parallel Inheritance Hierarchies
### Síntomas

* Crear una nueva subclase en una jerarquía te supone crear una clase relacionada en otra jerarquía.
* Encuentras dos jerarquías donde las superclases tienen los mismos prefijos (los nombres reflejan el requisito para coordinarlas). Este es un caso especial de *Shotgun Surgery*.

### Qué hacer

Usa *Move Field/Method* para redistribuir las características de una forma en que puedas eliminar una de las jerarquías.

### Recompensas

* Reduce la duplicidad.
* Mejora la comunicación.
* Puede reducir el tamaño.

## Combinatorial Explosion
### Síntomas

* Introducir una nueva clase supone introducir múltiples clases en varios sitios de una jerarquía.
* Cada capa de la jerarquía usa un conjunto común de palabras (informa de estilo, mutabilidad, etc.).

### Qué hacer

* Si las cosas no han ido demasiado lejos, puedes usar *Replace Inheritance with Delegation* (al crear una misma interfaz para las variaciones, puedes usar el patrón *Decorator*.
* Si la situación se ha vuelto demasiado compleja, se requieren grandes refactorizaciones como *Tease Apart Inheritance*.

### Recompensas

* Reduce la duplicidad.
* Reduce el tamaño.