---
title: "Bad Smells: Naming"
pubDate: 2019-03-19T21:02:05Z
tags: ['bad-smells']
---
Some tools to choose names can be:

* Project dictionaries.
* Domain vocabularies, ontologies and languages.
* Metaphors of *Xtreme Programming*.

Good names serve several functions:

* They provide a vocabulary to discuss our domain.
* They communicate intention.
* They provide expectations about how the system works.
* They support each other in a naming system.

To choose good names, use the following guides:

* Use verbs for *mutators* (modify state) and nouns or adjectives for *accessors* (return state).
* Use the same word to express similar concepts and different words to express different concepts.
*Prefers one-word names.
* Value communication more.

Among the bad odors that we can find within a class, those of moderate severity are those related to names:

* [Type Embedded in Name](#type-embedded-in-name)
* [Uncommunicative Name](#uncommunicative-name)
* [Inconsistent Names](#inconsistent-names)

## Type Embedded in Name
### To do

Use *Rename Method/Field/Constant* on a name to communicate intent without being so tied to a type.

### Rewards

* Improves communication.
* It can facilitate the identification of duplicity.

### Contraindications

* Keep the type in the name when you have the same operation class for different related types.
* Don't delete the type if you work under a standard used by the team.

## Uncommunicative Name
### To do

Use *Rename Method/Field/Constant* to give it a better name.

### Rewards

Improve communication.

### Contraindications

* Using names like *i/k/j* for iterator indexes or *c* for characters are not very confusing if the scope is small.
* Sometimes you may find that the variables listed communicate better.

## Inconsistent Names
### To do

Choose the best name and use *Rename Method/Field/Constant* to give the same name to the same concept. Once done, you will see that the classes look more similar than before. Then look for code duplication smells and eliminate them.

### Rewards

* Improves communication.
* May expose duplicity.