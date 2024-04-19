---
title: "Bad Smells: Duplication"
pubDate: 2019-03-19T21:29:35Z
tags: ['bad-smells']
---
Duplication causes the following problems:

* There is more code to maintain.
* The parts that vary are buried under the parts that remain fixed.
* Variations in code often hide deeper similarities.
* There is a tendency to fix a bug in one place and leave identical ones unrepaired in another place.

Code duplication is usually a symptom of several bad smells, such as:

* [Magic Number](#magic-number)
* [Duplicate Code](#duplicated-code)
* [Alternative Classes with Different Interfaces](#alternative-classes-with-different-interfaces)

## Magic Number
### To do

Use *Replace Magic Number with Symbolic Constant* for the specific value.
If the values are *strings*, you may want to isolate them in some structure (class *wrapper*, *maps*, etc.)

### Rewards

* Reduces duplication.
* Improves communication.

### Contraindications

Tests are usually more readable when they simply use variables.

## Duplicated Code
### Symptoms

* **Easy to see**: Two code fragments are practically identical.
* **Hard to see**: Two pieces of code have practically the same effect.

### To do

If the duplication is within one or two methods of the same class, use *Extract Method* to move the common part to a separate method.

If the duplication is between two twin classes, use *Extract Method* to create a single routine and then use *Pull Up Field/Method* to pull the common parts together. You can then use *Form Template Method* to create a common algorithm in the parent and unique steps in the children.

If the duplication is in two unrelated classes, extract the common part into a new class with *Extract Class*, or identify if the smell is *Feature Envy* and therefore the duplicate code belongs only to one of the two classes.

If the code in both places is not identical but has the same effect, decide which is better and use *Substitute Algorithm* to keep a single copy.

### Rewards

* Reduces duplication.
* Reduce the size.
* Can lead to better abstraction and greater flexibility.

### Contraindications

* In rare cases you may conclude that mirroring is better for communicating intent and maintaining it.
* You may have duplication that is mere coincidence and reducing it may confuse whoever reads it.

## Alternative Classes with Different Interfaces
### Symptoms

Two classes appear to be doing the same job but have different method names.

### To do

1. Use *Rename Method* to make them similar.
2. Use *Move Method*, *Add Parameter* and *Parameterize Method* to make the protocols (signatures and approaches) similar.
3. If both classes are similar but not identical, use *Extract Superclass* once they are both in agreement.
4. Eliminate the extra class if possible.

### Rewards

* Reduces duplication.
* You can reduce the size.
* Can improve communication.

### Contraindications

Sometimes the two classes cannot be changed (if they are in different libraries, for example). Each bookstore may have its own vision for the same concept, but you may find yourself without a good way to unify them.