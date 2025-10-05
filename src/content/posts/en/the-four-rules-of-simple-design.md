---
title: 'The four rules of simple design'
pubDate: 2025-08-11T16:30:00Z
tags: ['software-design']
image:
  url: "/images/four-rules.jpg"
  alt: "The four rules of simple design written in a notebook"
---
Simplicity in software design results in cleaner code, easier maintenance, and more intuitive applications.

The four rules of simple design, proposed by Kent Beck, creator of the _Extreme Programming_ (XP) methodology, are designed to help developers focus on what's most important and avoid unnecessary complexity in their code. That is, designing software with a focus on the _Keep It Simple, Stupid!_ (KISS) principle. These four rules, in order of priority, are as follows:

## 1. Passes all tests

Simplicity means functionality. If the code doesn't work as expected, other aspects like elegance or minimalism don't matter. Therefore, a design is only simple if it passes all tests.

This rule also emphasizes the importance of the _Test-Driven Development_ (TDD) methodology, where writing tests before writing code ensures that only what is necessary for the software to work is written.

Its benefits are:

* **Ensures quality**. Passing tests ensures that the software works correctly.
* **Avoids overengineering**. When tests dictate the design, developers are less likely to add unnecessary complexity to meet undefined requirements.

## 2. Reveals intention

A simple design is one in which the code communicates the developer's intent. When reading the code, it should be immediately clear what it does and why. Code that expresses intent avoids tricks, complex constructs, or obscure patterns in favor of straightforward, understandable logic. Any developer who hasn't written the code should be able to read and understand it as if it were a story in a book. For this reason, the use of some features, such as reflection, should only be employed when it is by far the best option.

This rule emphasizes that code is written to be read by humans, not just executed by machines. If a piece of code is difficult to understand or requires extensive documentation to explain its purpose, then it is not simple. Clear and concise code allows others to understand the logic with minimal effort, reducing cognitive load.

When it comes to comments, their goal should not be to explain what the code does; it should be self-explanatory. Comments should be reserved for specific cases where you want to clarify the motivations behind a business decision, not the behavior or state of the code.

Its benefits are:

* **Better collaboration**. When code clearly expresses its intent, cross-team collaboration is easier, as developers can quickly understand the purpose of different parts of the source code. This facilitates knowledge transfer and allows for team member rotation without unduly impacting productivity.
* **Faster debugging and refactoring**. Understanding the intent of the code makes it easier to fix bugs or refactor the system without introducing errors.

## 3. No duplicated logic

This is none other than the well-known software design principle, _Don't Repeat Yourself_ (DRY). Duplication in code creates redundancy, higher maintenance costs, and a greater likelihood of errors. Simple design seeks to eliminate unnecessary duplication by abstracting common functionality into shared components or functions. This rule promotes modularity and reuse, two crucial aspects of clean, maintainable software.

When a feature or behavior is duplicated across multiple parts of the system, it creates the potential for inconsistencies. Fixing a bug or changing behavior in one place may not fix it everywhere, leading to confusion and errors. Conversely, when the system is designed to minimize duplication, changes are easier to manage, and the software remains flexible to future changes.

This rule is to behavior what _Single Source of Truth_ (SSOT) or _Single Point of Truth_ (SPOT) is to state.

Its benefits are:

* **Easier maintenance**. Changes only need to be made once, reducing the risk of errors.
* **Improved readability**. Code is clearer and easier to follow when there is no unnecessary repetition.

## 4. Fewest possible elements

The tendency to add unnecessary features or functionality that do not contribute to the software's primary goals should be avoided. Each function or component of a system should have a clear purpose: to satisfy a need and provide value. Otherwise, it should be removed.

This rule encourages developers to focus on what matters. It challenges them to prioritize the most essential parts of the system and avoid being distracted by non-essential features or excessive architecture. The goal is to implement only what is necessary to solve the problem at hand and nothing more.

When this rule is applied to feature development, it translates into the _You Aren't Gonna Need It_ (YAGNI) principle.

Its benefits are:

* **Reduced complexity**. Eliminating unnecessary features keeps the design agile and focused.
* **Reduced cost**. Fewer features mean less time spent developing and maintaining them.

## Conclusion

These four rules, like the goal they pursue, are simple. They are easy to apply, remember, and internalize. Following them ensures that the resulting code will meet the design simplicity necessary to be maintainable and scalable over time. They are an indispensable resource that every developer should have in their toolbox.

More about:
* <a href="https://en.wikipedia.org/wiki/Kent_Beck" target="_blank">Kent Beck</a>
* <a href="https://en.wikipedia.org/wiki/Extreme_programming" target="_blank">Extreme Programming (XP)</a>
* <a href="https://en.wikipedia.org/wiki/KISS_principle" target="_blank">Keep It Simple, Stupid! (KISS)</a>
* <a href="https://en.wikipedia.org/wiki/Test-driven_development" target="_blank">Test-Driven Development (TDD)</a>
* <a href="https://en.wikipedia.org/wiki/Don%27t_repeat_yourself" target="_blank">Don't Repeat Yourself (DRY)</a>
* <a href="https://en.wikipedia.org/wiki/Single_source_of_truth" target="_blank">Single Source of Truth (SSOT) / Single Point Of Truth (SPOT)</a>
* <a href="https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it" target="_blank">You Aren't Gonna Need It (YAGNI)</a>