---
title: "Bad Smells: Conditional logic"
pubDate: 2019-03-19T21:46:06Z
tags: ['bad-smells']
---
## Introduction

* It is difficult to reason since we have to consider multiple paths through the code.
* It is tempting to add special use cases instead of developing a general use case.
* Sometimes used as a poor substitute for object-oriented mechanisms.

The bad smells derived from misuse of conditional logic are:

* [Null Check](#null-check)
* [Complicated Boolean Expression](#complicated-boolean-expression)
* [Special Case](#special-case)
* [Simulated Inheritance (Switch Statement)](#simulated-inheritance-switch-statement)

## Null Check
### To do

* If there is a reasonable default value, use it.
* Otherwise, enter a *Null Object* to create a default value that you can use.

### Rewards

* Reduces duplication.
* Reduces logical errors and exceptions.

### Contraindications

* If the *null* occurs in a single place, it is not worth isolating it in a *Null Object*.
* Null Object*s need to have safe behavior for the methods they contribute. If you can't ensure it, don't use them.
* Be careful with cases where *null* means more than one thing in different contexts. You may want to replace them with more than one type of *Null Object*.

## Complicated Boolean Expression
### To do

DeMorgan's law applies.

### Rewards

Improve communication.

### Contraindications

You may find other ways to simplify the expression, or rewrite it to communicate more with less code.

## Special Case
### Symptoms

* Complex *if* statements.
* Checking particular values before doing something (especially comparisons with constants or enums).

### To do

* If conditionals are replacing a polymorphism, use *Replace Conditional with Polymorphism*.
* If the *if* and *then* are similar, you may want to rewrite them so that the same piece of code can generate the appropriate results for each case and eliminate the conditional.

### Rewards

* Improves communication.
* May expose duplicity.

### Contraindications

* You cannot remove the base case from a recursive expression.
* Sometimes an *if* is simply the best way to do something.

## Simulated Inheritance (Switch Statement)
### Symptoms

* The code uses a *switch* (especially in a *type field*).
* The code has a series of *if* on one line (especially if they compare against the same value).
* The code uses *instanceof* (or equivalent) to decide which type it is working with.

### To do

Don't pretend inheritance. It uses native mechanisms of the language itself.

If a *switch* for the same condition appears in different places, it is usually using a *type code*. Replace it with polymorphism:

1. Extract the code for each branch with *Extract Method*.
2. Move the code to the correct class with *Move Method*.
3. Configure the inheritance structure with *Replace Type Code with Subclass* or *Replace Type Code with State/Strategy*.
4. Remove conditionals with *Replace Conditional with Polymorphism*.

If the conditions occur within a single class, you can replace the conditional logic with *Replace Parameter with Explicit Method* or *Enter Null Object*.

### Rewards

* Improves communication.
* May expose duplicity.

### Contraindications

* Sometimes a *switch* is the simplest way to express logic. If you're doing something simple in a single place, you don't need to isolate it in a separate class. This usually occurs at points in the system that communicate with non-object-oriented parts, known as *Data Access/Transfer Objects* (DAO/DTO).
* A single *switch* can be used in a *Factory* or *Abstract Factory* pattern.
* A *switch* can be used in several related places to control a state machine. Decide then if it makes more sense to use the *switch* or the *State* pattern.