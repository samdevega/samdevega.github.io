---
title: "Bad Smells: Inheritance"
pubDate: 2019-03-20T12:47:12Z
tags: ['bad-smells']
---
The relationship between a class and its subclass usually starts out simple but becomes more complicated over time. A subclass often depends on its generalization more closely than an extraneous class, but this may be too much.

The key is to decide between what a class is and what a class has. The structure of a class usually begins with inheritance and moves more toward composition over time.

Bad smells emerging from misuse of inheritance are:

* [Refused Bequest](#refused-bequest)
* [Inappropiate Intimacy (Subclass Form)](#inappropiate-intimacy-subclass-form)
* [Lazy Class](#lazy-class)

## Refused Bequest
### Symptoms

* A class inherits from a generalization, but throws an exception instead of supporting a method (*honest refusal*).
* A class inherits from a generalization, but an inherited method does not work when called in that class (*implicit refusal*).
* Customers tend to access class rather than handle generalization.
* Inheritance is meaningless. The subclass is not an example of the generalization.

### To do

*Leave it as it is, if it's not confusing.
* If there is no reason to share a class relationship, use *Replace Inheritance with Delegation*.
* If the generalization-subclass relationship doesn't make sense, you can create a new subclass with *Extract Subclass*, *Push Down Field* and *Push Down Method*. Let this new class have the non-rejected behavior and change the clients of the generalization to be clients of this new class. With this, the generalization does not need to mention this behavior and you can eliminate it from it and from the initial subclass. The initial generalization becomes a subclass of the new class.

### Rewards

* Improves communication.
* Improves testability.

### Contraindications

Sometimes a case of *Refused Bequest* is used to prevent an explosion of new types.

## Inappropiate Intimacy (Subclass Form)
### Symptoms

A class accesses internal parts that should be private from their generalization. If this occurs between separate classes, it is known as *General Form*.

### To do

* If the subclass is accessing fields of the generalization in an uncontrolled way, use *Self Encapsulate Field*.
* If the generalization can define a general algorithm that can be introduced by the subclass, then it uses *Form Template Method*.
* If the generalization and subclass need to be even more decoupled, then use *Replace Inheritance with Delegation*.

### Rewards

* Reduces duplication.
* Usually improves communication.
* You can reduce the size.

## Lazy Class
### Symptoms

A class barely has any behavior. Its generalizations, subclasses, or clients do all the work apparently associated with it, and there is not enough behavior in the class to justify its existence.

### To do

* If your generalizations or subclasses seem like the right place to house the behavior of that class, store it inside one of them with *Collapse Hierarchy*.
* Otherwise, it encapsulates its behavior within its client with *Inline Class*.

### Rewards

* Reduce the size.
* Improves communication.
* Improve simplicity.

### Contraindications

Sometimes a *Lazy Class* exists to communicate an intention. You must find the balance between communication and simplicity.