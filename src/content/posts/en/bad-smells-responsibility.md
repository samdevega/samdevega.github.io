---
title: "Bad Smells: Responsibility"
pubDate: 2019-03-20T15:02:42Z
tags: ['bad-smells']
---
## Introduction

Balancing responsibility between objects is difficult to achieve. One of the virtues of refactoring is that it allows us to experiment with different ideas in a safe way and allows us to change our minds.

There are tools that help us decide how objects work with each other, such as *design patterns* or *CRC charts*.

Refactorings are usually reversible and can make up two options.

The bad odors that can appear due to a poor separation of responsibilities are:

* [Feature Envy](#feature-envy)
* [Innapropiate Intimacy (General Form)](#innapropiate-intimacy-general-form)
* [Message Chains](#message-chains)
* [Middle Man](#middle-man)

## Feature Envy
### Symptoms

A method seems more focused on manipulating another class's data rather than its own. This usually generates duplication since several clients perform the same actions on the data of another object or it is touched several times in the same row.

### To do

Use *Move Method* to put the actions in the correct class. You may need to first use *Extract Method* to isolate the part of code you are interested in moving.

### Rewards

* Reduces duplication.
* Usually improves communication.
* May expose subsequent refactoring opportunities.

### Contraindications

Sometimes the behavior is intentionally put in the "wrong" class. For example, some design patterns, such as *Strategy* or *Visitor*, put the behavior in a separate class so that changes can be made independently. If you use *Move Method* to put it back, you can end up joining things that should change independently.

## Innapropiate Intimacy (General Form)
### Symptoms

A class accesses the internals of another independent class.

### To do

* If two independent classes are tangled, use *Move Method* and *Move Field* to put everything in its place.
* If the tangled parts appear to be a missing class, use *Extract Class* and *Hide Delegate* to introduce the new class.
* If both classes point to each other, use *Change Bidirectional Reference to Unidirectional* to create a unidirectional dependency.
* If a subclass is too coupled with its generalization:
  * If you are accessing the generalization fields in an uncontrolled way, use *Self Encapsulate Field*.
  * If the generalization can define a general algorithm that can be used by the subclass, use *Form Template Method*.
  * If the generalization and subclass need to be even more decoupled, use *Replace Inheritance with Delegation*.

### Rewards

* Reduces duplication.
* Usually improves communication.
* You can reduce the size.

## Message Chains
### To do

If the manipulations belong to the receiving object, use *Extract Method* and *Move Method* to move them to it.

Use *Hide Delegate* to make the method depend on a single object. This may involve repeating the delegation across related objects.

### Rewards

It can reduce or expose duplicity.

### Contraindications

This refactoring is a balance. If you apply *Hide Delegate* too much, you may end up finding that all classes are so busy delegating that none of them seem to be doing the work. Sometimes it's less confusing to maintain a chain of messages.

## Middle Man
### To do

* In general, apply *Remove Middle Man* by having the client call the delegate class directly.
* If the delegate class is contained by the *Middle Man* or is immutable, the *Middle Man* has no behavior to add and can be seen as an example of delegation, use *Replace Delegation with Inheritance*.

### Rewards

* Reduce the size.
* Can improve communication.

### Contraindications

* Some patterns (for example *Proxy* or *Decorator*) intentionally create delegates. Don't delete a *Middle Man* that exists for a reason.
* *Middle Man* and *Message Chain* balance each other.
* Delegates provide a kind of façade, leaving the client to remain unaware of the details of the messages and structures. Removing a *Middle Man* can expose customers to too much information.