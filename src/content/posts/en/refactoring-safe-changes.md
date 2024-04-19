---
title: 'Refactoring: Safe changes'
pubDate: 2019-03-17T19:55:05Z
tags: ['refactoring']
---
## The steps in refactoring

The different techniques that make up refactoring have the same common denominator. They are all divided into small steps in which you must always keep in mind that the change made to the code should not result in an error at the compilation or interpretation level, unless this is intentional. This can be extracted from the second definition of refactoring cited in my previous article. It emphasizes the fact that changes must be made safely.

## An example of refactoring

To illustrate this aspect, I use the steps that I observed in an online tutorial on refactoring in which the technique known as *Replace Temp with Query* is performed, which is based on replacing the declaration and value assignment of a local variable with a call another method that returns said value. Although this practice may represent a slight decrease in the performance of the application by having to compute the logic contained in the method in each call, it provides greater clarity when reading and better reflects our intentions. Starting from the following code, we will carry out the steps to replace the local variable discountFactor with a call to an accessor method with the same name.

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

The first step seemed like a very interesting trick to me. This involves adding the *final* modifier to the *discountFactor* variable to indicate that we do not want its value to be replaced at a later point in the method, which is key to taking advantage of *Replace Temp with Query*. In this way, our IDE will notify us that there is an error in the compilation (intentional on our part) if the value of the variable is modified at a later point.

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

Once the portion of code to be refactored has been identified, we extract it to a new method with the same name as the variable in question. We can help ourselves with the shortcut *Refactor > Extract method* of our IDE.
If we do not have one, we first copy the logic to be extracted to the new method, assign the call to the method as the value of the variable and delete the portion of extracted code.

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

Finally, we use the call to the new method instead of the variable for the calculation and eliminate it.

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

The code has remained stable throughout the refactoring process, except for the use of *final* in the variable. This would be the correct way to proceed whenever we refactor.

Curiously, in the tutorial that explained this technique, the code was broken for a moment in the last step described above. When manually extracting logic to a new method, the author removed the variable declaration before replacing its use in the calculation with the call to the new method. If we tried to compile the program at that point, we would get an error because the *discountFactor* variable was not declared.

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

## Conclusion

During refactoring we must not forget that the application, unless we want it to, should never lead to a failure after a step in modifying the code.

This is a really important factor, even more so when the refactoring process we are carrying out reaches a higher level of abstraction. That is, it entails external changes to a class, related to the way in which they communicate with each other.