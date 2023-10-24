---
title: "Malos olores: Olores leves"
pubDate: 2019-03-19T20:42:59Z
tags: ['bad-smells']
---
Los malos olores leves que podemos encontrar dentro de una clase son:

* [Comments](#comments) (comentarios)
* [Long Method](#long-method) (método largo)
* [Large Class](#large-class) (clase larga)
* [Long Parameter List](#long-parameter-list) (lista de parámetros larga)

## Comments
### Qué hacer

* Cuando un comentario explica un bloque de código, utiliza *Extract Method* para encapsular dicho bloque de código y aportar semántica. El comentario suele sugerir un nombre para el método.
* Cuando un comentario explica qué hace un método mejor que el propio nombre del método, utiliza *Rename Method* y aprovecha la base del comentario para darle un mejor nombre.
* Cuando un comentario explica condiciones previas, considera utilizar *Introduce Assertion* para reemplazar el comentario con código.

### Recompensas

* Mejora la comunicación.
* Puede exponer duplicidad.

### Contraindicaciones

No elimines comentarios que explican la razón de por qué algo es hecho de una manera determinada.

## Long Method
### Qué hacer

* Utiliza *Extract Method* para romper el método en porciones más pequeñas. Busca comentarios y espacios en blanco que separen bloques interesantes. Extrae métodos que tengan significado semántico, no sólo una porción de código al azar.
* Puedes encontrar otras refactorizaciones (que limpien líneas, condicionales y usos de variables) que sean útiles antes de comenzar a separar el método.

### Recompensas

* Mejora la comunicación.
* Puede exponer duplicidad.
* Suele ayudar a la aparición de nuevas clases y abstracciones.

### Contraindicaciones

En ocasiones puede que un método largo sea la mejor manera de expresar algo.

## Large Class
### Qué hacer

* Utiliza *Extract Class* si puedes identificar una nueva clase que tiene parte de las responsabilidades de la clase actual.
* Utiliza *Extract Subclass* si puedes dividir las responsabilidades entre la clase y una nueva subclase.
* Utiliza *Extract Interface* si puedes identificar un subconjunto de características utilizadas por los clientes de la clase.

### Recompensas

* Mejora la comunicación.
* Puede exponer duplicidad.

## Long Parameter List
### Qué hacer

* Si el valor del parámetro puede ser sustituído desde otro objeto que ya lo conoce, utiliza *Replace Parameter with Method*.
* Si el parámetro viene de un único objeto, prueba *Preserve Whole Object*.
* Si los datos no vienen de un objeto lógico, quizá te interese agruparlos mediante *Introduce Parameter Object*.

### Recompensas

* Mejora la comunicación.
* Puede exponer duplicidad.
* Suele reducir el tamaño.

### Contraindicaciones

* En ocasiones quieres evitar una dependencia entre dos clases.
* A veces los parámetros no tienen un significado conjunto.