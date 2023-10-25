---
title: "Bad Smells: Data"
pubDate: 2019-03-20T08:09:48Z
tags: ['bad-smells']
---
DTOs are an opportunity. If the data forms a good set, we can usually find a behavior that belongs to the class.

Bad smells resulting from misuse of data structures are:

* [Primitive Obsession](#primitive-obsession)
* [Data Class](#data-class)
* [Data Clump](#data-clump)

## Primitive Obsession
### Symptoms

* Use of primitives or almost primitives (*int*, *float*, *String*, etc.).
* Constants and enumerations representing small integers.
* Constants of type *String* representing field names.

### To do

For *Missing Class*:

* Check *Data Clump*, because the primitive is usually encapsulated to locate the problem.
* Applies *Replace Data Value with Object* to create first-class data values.

For *Simulated Types*:

* If there is no behavior that is conditional, then it is more of an enumerator, so use *Replace Type Code with Class*.
* If it changes or the class is already subclassed, use *Replace Type Code with State/Strategy*.

For *Simulated Field Accessors*:

If the primitive is used to treat certain array elements, apply *Replace Array with Object*.

### Rewards

* Improves communication.
* May expose duplicity.
* Improves flexibility.
* Usually exposes the need for other refactorings.

### Contraindications

* There are usually performance or dependency problems that stop you from locating it.
* Sometimes a *Map* is used instead of an object with fixed fields, using the field names as indexes. This can reduce the coupling of a simple object structure, but at a cost in performance, type safety, and clarity.

## Data Class
### Symptoms

The class consists only of public data, or *getters* and *setters*. This makes the client dependent on the mutability and representation of the class.

### To do

1. Apply *Encapsulate Field* to the block to only allow access to the fields through *getters* and *setters*.
2. Apply *Remove Setting Methods* to as many methods as you can.
3. Use *Encapsulate Collection* to remove direct access to any of the collection type fields.
4. Look at each client of the object. You will probably find that clients are accessing fields and manipulating results, when the class itself should be doing so.
5. After analyzing it you will see that you have many similar methods in the class. Then use refactorings such as *Rename Method*, *Extract Method*, *Add Parameter* or *Remove Parameter* to harmonize signatures and eliminate duplication.
6. No more accesses to the fields should be needed because the moved methods cover their actual use. Use *Hide Method* to remove access to *getters* and *setters*.

### Rewards

* Improves communication.
* May expose duplicity.

### Contraindications

* Sometimes encapsulating fields can have a performance cost.
* Some persistence mechanisms are based on *getters/setters* methods to define which fields will obtain the data to load or save. (See *Mementos, Gamma’s Design Patterns*). You can also encapsulate this class in another container.

## Data Clump
### Symptoms

* The same two or three elements frequently appear together in classes and parameter lists.
* The code declares groups of fields and methods together within the class.
* Groups or field names start or end similarly.

### To do

* If the elements are fields in a class, use *Extract Class* to take them to a new class.
* If the values are together in a method signature, use *Enter Parameter Object* to extract the new object.
* Look at the calls that pass elements from the new object to see if you can apply *Preserve Whole Object* to them.
* Look at the uses of items. There are often opportunities to use *Move Method* and other refactorings to move those uses to the new object, identifying *Data Class*.

### Rewards

* Improves communication.
* May expose duplicity.
* Usually reduces the size.

### Contraindications

* Occasionally passing an entire object can introduce a dependency. In this case, only pass the pieces you need.
* May negatively impact performance.