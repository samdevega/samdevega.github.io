---
title: "Malos olores: Responsabilidad"
pubDate: 2019-03-20T15:02:42Z
tags: ['bad-smells']
---
El equilibrio en la responsabilidad entre objetos es difícil de conseguir. Una de las virtudes de la refactorización es que nos permite experimentar con diferentes ideas de una forma segura y nos permite cambiar de idea.

Hay herramientas que nos ayudan a decidir como trabajan los objetos entre sí, como los *patrones de diseño* o las *cartas CRC*.

Las refactorizaciones suelen ser reversibles y pueden compensar dos opciones.

Los malos olores que pueden aparecer por una mala separación de las responsabilidades son:

* [Feature Envy](#feature-envy)
* [Innapropiate Intimacy (General Form)](#innapropiate-intimacy-general-form)
* [Message Chains](#message-chains)
* [Middle Man](#middle-man)

## Feature Envy
### Síntomas

Un método parece más enfocado a manipular los datos de otra clase más que los suyos. Esto suele generar duplicidad ya que varios clientes realizan las mismas acciones sobre los datos de otro objeto o este es tocado varias veces en una misma fila.

### Qué hacer

Utiliza *Move Method* para poner las acciones en la clase correcta. Es probable que tengas que utilizar primero *Extract Method* para aislar la parte de código que te interesa mover.

### Recompensas

* Reduce la duplicidad.
* Suele mejorar la comunicación.
* Puede exponer posteriores oportunidades de refactorización.

### Contraindicaciones

En ocasiones el comportamiento está puesto intencionadamente en la clase «incorrecta». Por ejemplo, algunos patrones de diseño, como el *Strategy* o *Visitor* ponen el comportamiento en una clase separada y así poder realizar cambios de forma independiente. Si utilizas *Move Method* para ponerlo de vuelta, puedes acabar uniendo cosas que deberían cambiar de forma independiente.

## Innapropiate Intimacy (General Form)
### Síntomas

Una clase accede a las partes internas de otra clase independiente.

### Qué hacer

* Si dos clases independientes están enrredadas, usa *Move Method* y *Move Field* para poner cada cosa en su lugar.
* Si las partes enrredadas parecen ser una clase perdida, utiliza *Extract Class* y *Hide Delegate* para introducir la nueva clase.
* Si ambas clases se apuntan mutuamente, usa *Change Bidirectional Reference to Unidirectional* para crear una dependencia unidireccional.
* Si una subclase está demasiado acoplada a su generalización:
  * Si está accediendo a los campos de la generalización de forma incontrolada, usa *Self Encapsulate Field*.
  * Si la generalización puede definir un algoritmo general que pueda ser usado por la subclase, usa *Form Template Method*.
  * Si la generalización y la subclase necesitan estar aún más desacopladas, usa *Replace Inheritance with Delegation*.

### Recompensas

* Reduce la duplicidad.
* Suele mejorar la comunicación.
* Puede reducir el tamaño.

## Message Chains
### Qué hacer

Si las manipulaciones pertenecen al objeto que las recibe, utiliza *Extract Method* y *Move Method* para llevarlas a él.

Usa *Hide Delegate* para hacer que el método dependa de un único objeto. Esto puede implicar que se repita la delegación a lo largo de los objetos relacionados.

### Recompensas

Puede reducir o exponer duplicidad.

### Contraindicaciones

Esta refactorización es un equilibrio. Si aplicas demasiado *Hide Delegate*, puedes acabar encontrando en que todas las clases están tan ocupadas delegando que ninguna parece estar realizando el trabajo. A veces es menos confuso mantener una cadena de mensajes.

## Middle Man
### Qué hacer

* En general, aplica *Remove Middle Man* haciendo que el cliente llame a la clase delegada directamente.
* Si la clase delegada es contenida por el *Middle Man* o es inmutable, el *Middle Man* no tiene comportamiento a añadir y puede ser visto como un ejemplo de la delegación, usa *Replace Delegation with Inheritance*.

### Recompensas

* Reduce el tamaño.
* Puede mejorar la comunicación.

### Contraindicaciones

* Algunos patrones (por ejemplo *Proxy* o *Decorador*) crean delegados intencionadamente. No elimines un *Middle Man* que existe por un motivo.
* *Middle Man* y *Message Chain* se equilibran entre sí.
* Los delegados proveen una especie de fachada, dejando al cliente permanecer ignorante a los detalles de los mensajes y las estructuras. Eliminar un *Middle Man* puede exponer a los clientes demasiada información.