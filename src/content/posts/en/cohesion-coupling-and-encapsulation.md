---
title: "Object-oriented: Cohesion, coupling and encapsulation"
pubDate: 2019-06-23T09:51:33Z
tags: ['object-oriented']
---
## Cohesion

In object-oriented design, cohesion is understood as the degree to which the different elements of a module remain attached to said module. That is, those elements that can be understood as part of a concept that encompasses them should be within it and not dispersed in other modules.

<figure>
<img src="/images/cohesion-coupling-and-encapsulation-1.png" alt="cohesion">
<figcaption>The elements converge towards their own module. They are known and used only by this one.</figcaption>
</figure>

## Coupling

On the other hand, coupling refers to the degree to which the different modules of a system are independent of each other. When a module directly accesses an element of another module to define its behavior, both modules are said to be coupled.

<figure>
<img src="/images/cohesion-coupling-and-encapsulation-2.png" alt="coupling">
<figcaption>The elements go out to other modules. They are known and used by them.</figcaption>
</figure>

Both cohesion and coupling can be understood as opposing gravitational forces, since the need to relate between modules will result in their appearance.

Thus, the greater cohesion a system has, the less coupling it will have and vice versa.

## Encapsulation

Encapsulation is one of the guidelines of object-oriented design that states that the state (set of property values) of an object should never be exposed, so that it only changes due to its own behavior (its methods).

We can realize that this concept promotes cohesion over coupling. This is something we must look for in the design of our systems. From the most basic level, the class level, to the most abstract, the interaction between groups of classes (understood as *packages* in some languages such as *Java*) or even in the interaction of our system with others.