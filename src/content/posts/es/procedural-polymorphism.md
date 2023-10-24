---
title: "Orientado a objetos: Polimorfismo procedural"
pubDate: 2021-03-12T09:00:44Z
tags: ['object-oriented']
---
## Sobre el polimorfismo en el diseño orientado a objetos

Cuando hablamos de polimorfismo, nos referimos a que objetos de distintas clases sean capaces de responder a mensajes sintácticamente iguales (misma firma) independientemente de su comportamiento interno. Dependiendo del lenguaje en el que nos encontremos el polimorfismo se implementará de una forma determinada, como puede ser mediante interfaces.

Un ejemplo sencillo puede ser la respuesta a preguntar por su área a objetos cuyas clases representan las figuras geométricas de un círculo, un cuadrado y un triángulo:

```java
interface Figure {
  float area();
}
```

```java
class Circle implements Figure {
  ...
  float area() {
    return Math.PI * Math.pow(this.radius, 2);
  }
}
```

```java
class Square() implements Figure {
  ...
  float area() {
    return Math.pow(this.side, 2);
  }
}
```
```java
class Triangle() implements Figure {
  ...
  float area() {
    return this.base * this.high / 2;
  }
}
```

De esta forma, los objetos que se comuniquen con los generados por estas clases sólo necesitaran saber que están hablando con figuras geométricas, promoviendo así un diseño más cohesivo.

## El polimorfismo procedural

Podemos entender el polimorfismo procedural como la carencia en nuestro diseño de un polimorfismo orientado a objetos donde existe una clara oportunidad de aplicarlo.

En ocasiones podemos encontrarnos con un conjunto de datos en los que uno de ellos indica un *tipo*. Esto puede ocurrir por diversos motivos como:
* Los datos vienen de la capa de persistencia o desde fuera del sistema, dado que su origen puede no trabajar con el paradigma orientado a objetos.
* El diseño ha ido evolucionando y esa oportunidad de polimorfismo ha pasado inadvertida.
* El proyecto estaba en una fase prematura y en ese momento no teníamos la certeza suficiente de que el polimorfismo fuese la herramienta correcta a aplicar. Recordemos que cada vez que introducimos una nueva abstracción estamos añadiendo complejidad al diseño, por ello dicha abstracción necesita cumplir un propósito de mejora (comunicar, evitar duplicidad de intención, etc) que justifique su uso.

El siguiente caso es un claro ejemplo de polimorfismo procedural.

### Ejemplo

Tenemos un juego de rol y en nuestro diseño inicial sólo existían dos tipos de personaje: guerrero y arquero. No sabíamos como evolucionaría el juego y por ello no habíamos aplicado polimorfismo orientado a objetos aún, quedandonos un código como este:

```java
class Character {
  private string type;
  ...
  float power() {
    return (this.type.equals("warrior"))
      ? this.level * this.strength
      : this.level * this.speed;
  }
}
```

Claramente estamos supeditando el comportamiento de cada instancia de nuestra clase `Character` en función del valor de su propiedad `type`.

Ahora imaginemos que ha aparecido un nuevo requerimiento y necesitamos evolucionar el diseño para admitir un conjunto nuevo de tipos de personaje. Llegados a este punto vemos claramente que esa condición en nuestro código está reemplazando un polimorfismo orientado a objetos.

Los pasos para reemplazar el polimorfismo procedural son:

1. Lleva cada posible resultado de la condición actual a una nueva clase con un método de la misma firma, haciendo innecesaria la existencia de la propiedad `type`.

```java
class Warrior {
  ...
  float power() {
    return this.level * this.strength;
  }
}
```

```java
class Archer {
  ...
  float power() {
    return this.level * this.speed;
  }
}
```

2. Introduce tus nuevas clases con su comportamiento según el requerimiento:

```java
class Mage {
  ...
  float power() {
    return this.level * this.intellect;
  }
}
...
```

3. (Opcional) Si tu lenguaje lo requiere, crea una interfaz común para las clases consiguiendo así limitar el impacto del cambio en el resto del diseño. Probablemente puedas reutilizar el nombre de la clase original:

```java
interface Character {
  ...
  float power();
}
```

```java
class Warrior implements Character {
  ...
}
...
```

Si además combinamos este cambio con otras técnicas como el patrón <a href="https://es.wikipedia.org/wiki/Factory_Method_(patr%C3%B3n_de_dise%C3%B1o)" target="_blank">Factory Method</a>, conseguiremos aislar en un único punto de nuestro diseño la construcción de cada objeto de una clase específica y el resto de objetos interactuará con ellos conociendo únicamete su interfaz, cumpliendo así el principio <a href="https://es.wikipedia.org/wiki/Principio_de_abierto/cerrado" target="_blank">Open/Closed</a>.

## Conclusión
Siempre que nos encontremos ante una propiedad de cuyo valor dependa el comportamiento de la clase, estamos ante un caso de polimorfismo procedural. Nombres de propiedad como `type`, `kind`, `_Type`, `_Class`, etc., son claros candidatos que deberían hacer saltar nuestras alarmas para detectar esta carencia en el diseño, ser conscientes de ella y analizar si estamos en un punto en el que compense y esté justificado realizar la refactorización.