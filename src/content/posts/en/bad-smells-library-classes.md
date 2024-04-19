---
title: "Bad Smells: Library classes"
pubDate: 2019-03-20T18:44:47Z
tags: ['bad-smells']
---
A modern application will use library classes. Sometimes these put us in a dilemma. We want the bookstore to be different, but we don't want to change it. Even when it is possible to change libraries, it carries risks: It affects other clients and this implies redoing our changes for future versions of the library.

## Incomplete Library Class
### Symptoms

You are using a library and there is a feature you would like it to have.

### To do

* Contact the creator to see if they can incorporate the feature.
* If it's just a couple of methods, use *Enter Foreign Method* in the library client class. This generates *Feature Envy* but it is insurmountable.
* If there are enough methods, use *Introduce Local Extension* (creating a subclass of the library to create new pseudo-libraries). Use the new extended class to advance.
* You can decide to introduce a layer to wrap the bookcase.

### Rewards

Reduces duplication (when you can reuse library code instead of implementing it completely from scratch).

### Contraindications

If several projects incorporate a library in incompatible ways, it may involve extra work to adapt to future changes to it.