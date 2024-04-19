---
title: 'Refactoring: Cambios seguros'
pubDate: 2019-03-17T19:55:05Z
tags: ['refactoring']
---
## Los pasos en la refactorización

Las diferentes técnicas que conforman la refactorización tienen un mismo denominador común. Todas se dividen en pequeños pasos en los que se debe tener siempre presente que el cambio realizado en el código no debería dar como resultado un error del mismo a nivel de compilación o interpretación, salvo que esto sea intencionado. Esto puede extraerse de la segunda definición de refactoring citada en mi anterior artículo. En ella, se hace hincapié en el hecho de que los cambios deben realizarse de forma segura.

## Un ejemplo de refactoring

Para ilustrar este aspecto, utilizo los pasos que observé en un tutorial online sobre refactoring en el que se realiza la técnica conocida como *Replace Temp with Query*, la cual se basa en sustituir la declaración y asignación de valor de una variable local por una llamada a otro método que nos retorne dicho valor. Si bien esta práctica puede suponer una ínfima disminución del rendimiento de la aplicación al tener que computar en cada llamada la lógica contenida en el método, aporta mayor claridad a la hora de leer y refleja mejor nuestras intenciones. Partiendo del siguiente código, realizaremos los pasos para sustituir la variable local discountFactor por una llamada a un método accesor con el mismo nombre.

```java
class Product {
  private double itemPrice;
 
  public Product(double itemPrice) {
    this.itemPrice = itemPrice;
  }
 
  public double getPrice() {
    double discountFactor;
    if (basePrice() > 500) {
      discountFactor = 0.95;
    } else {
      discountFactor = 0.9;
    }
    return basePrice() * discountFactor;
  }
 
  private double basePrice() {
    return quantity * itemPrice;
  }
}
```

El primer paso me pareció un truco muy interesante. Se trata de añadir el modificador *final* a la variable *discountFactor* para indicar que no queremos que su valor sea sustituido en un punto posterior del método, lo cual es clave para sacarle partido a *Replace Temp with Query*. De esta forma, nuestro IDE se encargará de notificarnos que hay un error en la compilación (intencionado por nuestra parte) si el valor de la variable es modificado en un punto posterior.

```java
class Product {
  private double itemPrice;
 
  public Product(double itemPrice) {
    this.itemPrice = itemPrice;
  }
 
  public double getPrice() {
    final double discountFactor;
    if (basePrice() > 500) {
      discountFactor = 0.95;
    } else {
      discountFactor = 0.9;
    }
    return basePrice() * discountFactor;
  }
 
  private double basePrice() {
    return quantity * itemPrice;
  }
}
```

Una vez identificada la porción de código a refactorizar, la extraemos a un nuevo método con el mismo nombre que la variable en cuestión. Podemos ayudarnos del atajo *Refactor > Extract method* de nuestro IDE.
En el caso de no contar con uno, primero copiamos la lógica a extraer al nuevo método, asignamos la llamada al método como valor de la variable y borramos la porción de código extraído.

```java
class Product {
  private double itemPrice;
 
  public Product(double itemPrice) {
    this.itemPrice = itemPrice;
  }
 
  public double getPrice() {
    double discountFactor = discountFactor();
    return basePrice() * discountFactor;
  }
 
  private double basePrice() {
    return quantity * itemPrice;
  }
 
  private double discountFactor() {
    if (basePrice() > 500)
      return = 0.95;
    return = 0.9;
  }
}
```

Finalmente, utilizamos para el cálculo la llamada al nuevo método en lugar de la variable y la eliminamos.

```java
class Product {
  private double itemPrice;
 
  public Product(double itemPrice) {
    this.itemPrice = itemPrice;
  }
 
  public double getPrice() {
    return basePrice() * discountFactor();
  }
 
  private double basePrice() {
    return quantity * itemPrice;
  }
 
  private double discountFactor() {
    if (basePrice() > 500)
      return = 0.95;
    return = 0.9;
  }
}
```

El código se ha mantenido estable durante todo el proceso de refactorización, a excepción del uso de *final* en la variable. Esta sería la forma correcta de proceder siempre que refactorizamos.

Curiosamente, en el tutorial en el que se explicaba esta técnica, el código quedaba roto por un momento en el último paso descrito anteriormente. Al realizar manualmente la extracción de la lógica a un nuevo método, el autor eliminaba la declaración de la variable antes de sustituir su uso en el cálculo por la llamada al nuevo método. Si se intentase compilar el programa en ese punto, obtendríamos un error al no estar declarada la variable *discountFactor*.

```java
class Product {
  private double itemPrice;
 
  public Product(double itemPrice) {
    this.itemPrice = itemPrice;
  } 
 
  public double getPrice() {
    return basePrice() * discountFactor; // <- discountFactor is undefined
  }
 
  private double basePrice() {
    return quantity * itemPrice;
  }
 
  private double discountFactor() {
    if (basePrice() > 500)
      return = 0.95;
    return = 0.9;
  }
}
```

## Conclusión

Durante el refactoring no debemos olvidar que la aplicación, salvo que así lo queramos, nunca debe conducir a un fallo tras un paso en la modificación del código.

Este es un factor realmente importante, más aún cuando el proceso de refactorización que estemos realizando alcance un mayor nivel de abstracción. Es decir, que conlleve cambios externos a una clase, relacionados con la forma en que estas se comunican entre sí.