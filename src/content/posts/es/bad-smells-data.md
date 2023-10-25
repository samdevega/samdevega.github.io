---
title: "Malos olores: Datos"
pubDate: 2019-03-20T08:09:48Z
tags: ['bad-smells']
---
Los DTOs son una oportunidad. Si los datos forman un buen conjunto, normalmente podemos encontrar un comportamiento que pertenezca a la clase.

Los malos olores resultantes de un mal uso de las estructuras de datos son:

* [Primitive Obsession](#primitive-obsession)
* [Data Class](#data-class)
* [Data Clump](#data-clump)

## Primitive Obsession
### Síntomas

* Uso de primitivos o casi primitivos (*int*, *float*, *String*, etc.).
* Constantes y enumeraciones representando pequeños enteros.
* Constantes de tipo *String* representando nombres de campos.

### Qué hacer

Para *Missing Class*:

* Revisar *Data Clump*, porque el primitivo suele ser encapsulado para localizar el problema.
* Aplica *Replace Data Value with Object* para crear valores de datos de primera clase.

Para *Simulated Types*:

* Si no hay comportamiento que sea condicional, entonces es más un enumerador, así que utiliza *Replace Type Code with Class*.
* Si cambia o la clase ya tiene subclase, utiliza *Replace Type Code with State/Strategy*.

Para *Simulated Field Accessors*:

Si el primitivo es usado para tratar ciertos elementos array, aplica *Replace Array with Object*.

### Recompensas

* Mejora la comunicación.
* Puede exponer duplicidad.
* Mejora la flexibilidad.
* Suele exponer la necesidad de otras refactorizaciones.

### Contraindicaciones

* Suele haber problemas de rendimiento o dependencia que te detengan en localizarlo.
* En ocasiones un *Map* suele ser utilizado en lugar de un objeto con campos fijos, utilizando los nombres de los campos como índices. Esto puede reducir el acoplamiento de la estructura de un objeto simple, pero con un coste en el rendimiento, la seguridad del tipado y la claridad.

## Data Class
### Síntomas

La clase consiste únicamente en datos públicos, o *getters* y *setters*. Esto hace al cliente depender de la mutabilidad y representación de la clase.

### Qué hacer

1. Aplica *Encapsulate Field* al bloque para sólo permitir el acceso a los campos mediante *getters* y *setters*.
2. Aplica *Remove Setting Methods* a todos los métodos que puedas.
3. Utiliza *Encapsulate Collection* para eliminar el acceso directo a alguno de los campos de tipo colección.
4. Mira en cada cliente del objeto. Probablemente encontrarás que los clientes acceden a los campos y manipulan los resultados, cuando lo debería estar haciendo la propia clase.
5. Tras analizarlo verás que tienes muchos métodos similares en la clase. Utiliza entonces refactorizaciones como *Rename Method*, *Extract Method*, *Add Parameter* o *Remove Parameter* para armonizar las firmas y eliminar la duplicidad.
6. No deberían de necesitarse más accesos a los campos porque los métodos movidos cubren su uso real. Utiliza *Hide Method* para eliminar el acceso a los *getters* y *setters*.

### Recompensas

* Mejora la comunicación.
* Puede exponer duplicidad.

### Contraindicaciones

* En ocasiones el encapsulamiento de campos puede tener un coste en el rendimiento.
* Algunos mecanismos de persistencia se basan en los métodos *getters/setters* para definir cuales serán los campos de los que obtendrán los datos a cargar o guardar. (Ver *Mementos, Gamma’s Design Patterns*). También se puede encapsular esta clase en otra contenedora.

## Data Clump
### Síntomas

* Los mismos dos o tres elementos aparecen juntos frecuentemente en clases y listas de parámetros.
* El código declara grupos de campos y métodos juntos dentro de la clase.
* Los grupos o nombres de campos empiezan o terminan de forma similar.

### Qué hacer

* Si los elementos son campos en una clase, utiliza *Extract Class* para llevarlos a una nueva clase.
* Si los valores están juntos en la firma de un método, utiliza *Introduce Parameter Object* para extraer el nuevo objeto.
* Mira las llamadas que pasan los elementos desde el nuevo objeto para ver si puedes aplicarles *Preserve Whole Object*.
* Mira los usos de los elementos. Suelen haber oportunidades de utilizar *Move Method* y otras refactorizaciones para mover esos usos al nuevo objeto, identificando *Data Class*.

### Recompensas

* Mejora la comunicación.
* Puede exponer duplicidad.
* Suele reducir el tamaño.

### Contraindicaciones

* Ocasionalmente, pasar un objeto completo puede introducir una dependencia. En este caso pasa únicamente las piezas que necesites.
* Puede repercutir negativamente en el rendimiento.