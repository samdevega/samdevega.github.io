---
title: "Bad Smells: Hosting the change"
pubDate: 2019-03-20T17:31:25Z
tags: ['bad-smells']
---
Some problems become more apparent when you try to change the code. Ideally, a change decision affects only a single location. When this does not happen, it is a sign of code duplication. Detecting these problems usually has other benefits such as facilitating the testability of the code.

Bad smells related to forced simultaneous switching between classes are:

* [Divergent Change](#divergent-change)
* [Shotgun Surgery](#shotgun-surgery)
* [Parallel Inheritance Hierarchies](#parallel-inheritance-hierarchies)
* [Combinatorial Explosion](#combinatorial-explosion)

## Divergent Change
### Symptoms

The same class needs to change for different reasons.

### To do

* If the class finds an object and does something with it, let the client find the object and pass it to it or let the class return a value that the client uses.
* Use *Extract Class* to create separate classes for each decision.
* If several classes are sharing the same type of decisions, you can unify them into a new class with *Extract Superclass* or *Extract Subclass*. If necessary, these classes can form a layer.

### Rewards

* Improves communication (by better expressing the intention).
* Improve the structure for future changes.

## Shotgun Surgery
### Symptoms

Making a change involves modifying several classes.

### To do

* Identify the class that should contain the change group. It can be an existing class or you have to create it with *Extract Class*.
* Use *Move Field* and *Move Method* to bring the functionality to the chosen class. Once the remaining classes are simple enough, you can use *Inline Class* to remove them.

### Rewards

* Reduces duplication.
* Improves communication.
* Improves maintainability (next changes will be more localized).

## Parallel Inheritance Hierarchies
### Symptoms

* Creating a new subclass in a hierarchy means creating a related class in another hierarchy.
* You find two hierarchies where the superclasses have the same prefixes (the names reflect the requirement to coordinate them). This is a special case of *Shotgun Surgery*.

### To do

Use *Move Field/Method* to redistribute the features in a way that you can eliminate one of the hierarchies.

### Rewards

* Reduces duplication.
* Improves communication.
* You can reduce the size.

## Combinatorial Explosion
### Symptoms

* Introducing a new class means introducing multiple classes in various places in a hierarchy.
* Each layer of the hierarchy uses a common set of words (informs style, mutability, etc.).

### To do

* If things haven't gone too far, you can use *Replace Inheritance with Delegation* (when creating the same interface for variations, you can use the *Decorator* pattern.
* If the situation has become too complex, major refactorings such as *Tease Apart Inheritance* are required.

### Rewards

* Reduces duplication.
* Reduces the size.