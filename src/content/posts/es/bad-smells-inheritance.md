---
title: "Malos olores: Herencia"
pubDate: 2019-03-20T12:47:12Z
tags: ['bad-smells']
---
La relación entre una clase y su subclase suele comenzar siendo simple pero se va volviendo más complicada con el paso del tiempo. Una subclase a menudo depende de su generalización más estrechamente que una clase ajena, pero esto puede ser demasiado.

La clave es decidir entre lo que una clase es y lo que una clase tiene. La estructura de una clase suele comenzar con herencia y con el paso del tiempo se mueve más hacia la composición.

Los malos olores emergentes por un mal uso de la herencia son:

* [Refused Bequest](#refused-bequest)
* [Inappropiate Intimacy (Subclass Form)](#inappropiate-intimacy-subclass-form)
* [Lazy Class](#lazy-class)

## Refused Bequest
### Síntomas

* Una clase hereda de una generalización, pero lanza una excepción en lugar de dar soporte a un método (*honest refusal*).
* Una clase hereda de una generalización, pero un método heredado no funciona cuando es llamado en dicha clase (*implicit refusal*).
* Los clientes tienden a acceder a la clase más que manejar la generalización.
* La herencia no tiene sentido. La subclase no es un ejemplo de la generalización.

### Qué hacer

* Dejarlo tal y como está, si no es confuso.
* Si no hay motivos para compartir una relación de clases, utiliza *Replace Inheritance with Delegation*.
* Si la relación generalización-subclase no tiene sentido, puedes crear una nueva subclase con *Extract Subclass*, *Push Down Field* y *Push Down Method*. Deja que esta nueva clase tenga el comportamiento no rechazado y cambia los clientes de la generalización que sean clientes de esta nueva clase. Con ello, la generalización no necesita mencionar dicho comportamiento y podrás eliminarlo de ella y de la subclase inicial. La generalización inicial pasa a ser una subclase de la nueva clase.

### Recompensas

* Mejora la comunicación.
* Mejora la testeabilidad.

### Contraindicaciones

A veces un caso de *Refused Bequest* es usado para prevenir una explosión de nuevos tipos.

## Inappropiate Intimacy (Subclass Form)
### Síntomas

Una clase accede a partes internas que deberían ser privadas de su generalización. Si esto ocurre entre clases separadas, se conoce como *General Form*.

### Qué hacer

* Si la subclase está accediendo a campos de la generalización de una forma incontrolada, utiliza *Self Encapsulate Field*.
* Si la generalización puede definir un algoritmo general que pueda ser introducido por la subclase, entonces utiliza *Form Template Method*.
* Si la generalización y la subclase necesitan estar aún más desacopladas, entonces utiliza *Replace Inheritance with Delegation*.

### Recompensas

* Reduce la duplicidad.
* Suele mejorar la comunicación.
* Puede reducir el tamaño.

## Lazy Class
### Síntomas

Una clase apenas tiene comportamiento. Sus generalizaciones, subclases o clientes realizan todo el trabajo aparentemente asociado y no hay suficiente comportamiento en la clase que justifique su existencia.

### Qué hacer

* Si sus generalizaciones o subclases parecen el lugar adecuado para albergar el comportamiento de dicha clase, almacénalo dentro de una de ellas con *Colapse Hierarchy*.
* En caso contrario, encapsula su comportamiento dentro de su cliente con *Inline Class*.

### Recompensas

* Reduce el tamaño.
* Mejora la comunicación.
* Mejora la simplicidad.

### Contraindicaciones

A veces una *Lazy Class* existe para comunicar una intención. Debes buscar el equilibrio entre comunicación y simplicidad.