---
title: "Object-oriented: Law of Demeter"
pubDate: 2019-03-17T20:20:50Z
tags: ['object-oriented']
---
## About the Law of Demeter

The *Law of Demeter* or LoD, also known as *Principle of Least Knowledge* aims to reduce coupling and increase cohesion.

States the following:

* Each unit must have limited knowledge about other units and only know those units closely related to the current unit.
* Each unit must talk only to their friends and not talk to strangers.
*Only talk to your immediate friends.

## Translating the Law of Demeter into code

To comply with these premises at the code level, it is assumed that a method should only use other methods of:

* The class itself to which it belongs.
* An object created by the method itself.
* An object passed as an input parameter to the method itself.
* An object stored as a variable at the level of the class itself (property).

A method should never use another method of an object returned by its collaborators.

Let's now see how these refactoring techniques help us comply with this law.

## Hide Delegate

It is a technique used to move features between classes. It is used when we encounter the problem in which a *Client* object makes a call to a method of a *Delegate* object, which in turn is a property or object returned by a *Server* object, of another class. A breach of the *Law of Demeter* would be occurring.

![La Ley de Demeter 1](/images/law-of-demeter-1.jpg)

The correct way to proceed is to create your own method in *Server* that internally calls and returns the behavior that *Client* needs from *Delegate*. In this way, *Client* is not aware at any time of the existence of *Delegate* and we thus eliminate the dependency between these two classes, reducing the coupling in our application. *Server* becomes what is known as *Middle Man*. An object of an intermediate class that is responsible for communicating requests from one class to another, which is the behavior we are looking for to develop the desired logic.

![La Ley de Demeter 2](/images/law-of-demeter-2.jpg)

The con of this refactoring technique is that for each behavior that *Client* needs from *Delegate*, we will have to create a method in *Server* that is responsible for the communication between the two.

Let's now look at the opposite technique to *Hide Delegate*.

## Remove Middle Man

Starting from the previous example in *Hide Delegate*, *Client* requires logic that is in *Delegate* and *Server* acts as *Middle Man* between them.

Now, whether we are at an early stage of the application design or after a period of evolution through different refactoring phases, we may find that a *Middle Man* lacks its own behavior and is only responsible for to delegate work to other classes. At this point, we must consider whether we really want this intermediate class to exist or whether we eliminate it to reduce unnecessary complexity in the design of our application.

To eliminate *Middle Man*, we must replace its dependency with that of *Delegate* in the *Client* class, changing all references to its false behavior with references to the corresponding final behavior in *Delegate*.

Some cases in which we may want to maintain the existence of a *Middle Man* class are:

* If you avoid an interdependence between classes (reduce coupling)
* It serves the implementation of a design pattern, such as *Proxy* or *Decorator*.

## Conclusion

The use of *Hide Delegate* and *Middle Man* allows us to comply with the *Law of Demeter* and ensure that our design maintains high cohesion and less coupling, although excessive use of this technique can result in excessive growth or perhaps unnecessary complexity of our application, which we can reverse using *Remove Middle Man*.

The way to ensure that the implementation of both techniques is the best solution for each particular case, as well as the rest of the architecture resulting in our design, is none other than to dedicate a few hours per week to review the analysis of our project, with its corresponding refactoring if considered necessary.

Regular code rewriting will not only help the design to be or come as close as possible to being the ideal solution at the time the code is written, but it will also help it evolve along with our business logic and will maximize the longevity of the project.