---
title: "Bad Smells: Unnecessary complexity"
pubDate: 2019-03-19T21:14:35Z
tags: ['bad-smells']
---
>"Everything should be made as simple as possible. But not simpler."
>
>-- <cite>Albert Einstein</cite>

Unnecessary code complexity can present itself in the following bad smells:

* [Dead Code](#dead-code)
* [Speculative Generality](#speculative-generality)

Follow the principle *YAGNI* (You Aren't Gonna Need It).

## Dead Code
### To do

Remove unused code and associated tests.

### Rewards

* Reduce the size.
* Improves communication.
* Improve simplicity.

### Contraindications

Do not delete code that can be used to support clients even if it is not used within your framework.

## Speculative Generality
### To do

* For unnecessary classes:
  * If parents or children in the class seem like the right place for the behavior, put it inside one of them with *Collapse Hierarchy*.
  * Otherwise, put it inside the *caller* with *Inline Class*.
* For unnecessary methods, use *Inline Method* or *Remove Method*.
* For an unnecessary field, make sure there are no references to it and delete it.
* For an unnecessary parameter, use *Remove Parameter*.

### Rewards

* Reduce the size.
* Improves communication.
* Improve simplicity.

### Contraindications

* Do not delete code that can be used to support clients even if it is not used within your framework.
* If some elements are used by the tests and give them privileged information about the class, it may be an indication that you are not taking into account an abstraction that you can test independently.