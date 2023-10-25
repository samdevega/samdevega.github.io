---
title: "Malos olores: Lógica condicional"
pubDate: 2019-03-19T21:46:06Z
tags: ['bad-smells']
---
Es difícil de razonar ya que tenemos que considerar múltiples caminos a través del código.
Es tentador añadir casos de uso especiales en lugar de desarrollar un caso de uso general.
A veces es usada como un mal sustituto de mecanismos orientados a objetos.

Los malos olores derivados de un mal uso de la lógica condicional son:

* [Null Check](#null-check)
* [Complicated Boolean Expression](#complicated-boolean-expression)
* [Special Case](#special-case)
* [Simulated Inheritance (Switch Statement)](#simulated-inheritance-switch-statement)

## Null Check
### Qué hacer

* Si hay un valor por defecto razonable, utilizalo.
* Sino, introduce un *Null Object* para crear un valor por defecto que puedas usar.

### Recompensas

* Reduce la duplicación.
* Reduce los errores lógicos y excepciones.

### Contraindicaciones

* Si el *null* ocurre en un único lugar, no vale la pena aislarlo en un *Null Object*.
* Los *Null Object*s necesitan tener un comportamiento seguro para los métodos que aportan. Si no puedes asegurarlo, no los utilices.
* Ten cuidado con los casos donde *null* significa más de una cosa en contextos diferentes. Puedes querer reemplazarlos por más de un tipo de *Null Object*.

## Complicated Boolean Expression
### Qué hacer

Aplica la ley de DeMorgan.

### Recompensas

Mejora la comunicación.

### Contraindicaciones

Puede que encuentres otras formas de simplificar la expresión o que al reescribirla comuniques más con menos código.

## Special Case
### Síntomas

* Declaraciones complejas de *if*.
* Comprobación de valores particulares antes de hacer algo (especialmente comparaciones con constantes o enumeraciones).

### Qué hacer

* Si los condicionales están reemplazando un polimorfismo, utiliza *Replace Conditional with Polymorphism*.
* Si el *if* y el *then* son similares, quizá quieras reescribirlos para que el mismo fragmento de código pueda generar los resultados adecuados para cada caso y eliminar el condicional.

### Recompensas

* Mejora la comunicación.
* Puede exponer duplicidad.

### Contraindicaciones

* No puedes eliminar el caso base de una expresión recursiva.
* A veces un *if* es simplemente la mejor forma de hacer algo.

## Simulated Inheritance (Switch Statement)
### Síntomas

* El código utiliza un *switch* (especialmente en un *type field*).
* El código tiene una serie de *if* en una línea (especialmente si comparan contra el mismo valor).
* El código usa *instanceof* (o equivalente) para decidir con qué tipo está trabajando.

### Qué hacer

No simules herencia. Utiliza mecanismos nativos del propio lenguaje.

Si un *switch* para la misma condición aparece en diferentes sitios, normalmente está utilizando un *type code*. Reemplázalo con polimorfismo:

1. Saca fuera el código para cada rama con *Extract Method*.
2. Mueve el código a la clase correcta con *Move Method*.
3. Configura la estructura de herencia con *Replace Type Code with Subclass* o *Replace Type Code with State/Strategy*.
4. Elimina los condicionales con *Replace Conditional with Polymorphism*.

Si las condiciones ocurren dentro de una única clase, puedes reemplazar la lógica condicional con *Replace Parameter with Explicit Method* o *Introduce Null Object*.

### Recompensas

* Mejora la comunicación.
* Puede exponer duplicidad.

### Contraindicaciones

* A veces un *switch* es la forma más simple de expresar una lógica. Si está haciendo algo simple en un único sitio, no hace falta que lo aisles en una clase a parte. Esto suele ocurrir en puntos del sistema que se comuniquen con partes no orientadas a objetos, conocidas como *Data Access/Transfer Objects* (DAO/DTO).
* Un único *switch* puede ser utilizado en un patrón *Factory* o *Abstract Factory*.
* Un *switch* puede ser utilizado en varios lugares relacionados para controlar una máquina de estados. Decide entonces si tiene más sentido utilizar el *switch* o el patrón *State*.