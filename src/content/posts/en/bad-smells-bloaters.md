---
title: "Bad Smells: Bloaters"
pubDate: 2019-03-19T20:42:59Z
tags: ['bad-smells']
---
The bloaters that we can find within a class are:

* [Comments](#comments)
* [Long Method](#long-method)
* [Large Class](#large-class)
* [Long Parameter List](#long-parameter-list)

## Comments
### To do

* When a comment explains a block of code, it uses *Extract Method* to encapsulate said block of code and provide semantics. The comment usually suggests a name for the method.
* When a comment explains what a method does better than the method name itself, use *Rename Method* and use the base of the comment to give it a better name.
* When a comment explains preconditions, consider using *Enter Assertion* to replace the comment with code.

### Rewards

* Improves communication.
* May expose duplicity.

### Contraindications

Don't delete comments that explain why something is done a certain way.

## Long Method
### To do

* Use *Extract Method* to break the method into smaller portions. Look for comments and white space that separate interesting blocks. Extract methods that have semantic meaning, not just a random chunk of code.
* You may find other refactorings (cleaning up lines, conditionals, and variable usage) that are useful before you start separating the method.

### Rewards

* Improves communication.
* May expose duplicity.
* It usually helps the emergence of new classes and abstractions.

### Contraindications

Sometimes a long method may be the best way to express something.

## Large Class
### To do

* Use *Extract Class* if you can identify a new class that has some of the responsibilities of the current class.
* Use *Extract Subclass* if you can split responsibilities between the class and a new subclass.
* Use *Extract Interface* if you can identify a subset of features used by clients of the class.

### Rewards

* Improves communication.
* May expose duplicity.

## Long Parameter List
### To do

* If the parameter value can be replaced from another object that already knows it, use *Replace Parameter with Method*.
* If the parameter comes from a single object, try *Preserve Whole Object*.
* If the data does not come from a logical object, you may want to group it using *Enter Parameter Object*.

### Rewards

* Improves communication.
* May expose duplicity.
* Usually reduces the size.

### Contraindications

* Sometimes you want to avoid a dependency between two classes.
* Sometimes parameters do not have a common meaning.