---
title: Object-Oriented Programming
slug: object-oriented-programming
summary: Inheritance, Polymorphism
tags: [fundamentals, javascript]
links:
  - title: MDN — Object-oriented JavaScript for beginners
    url: "https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Object-oriented_programming"
    kind: resource
  - title: Wikipedia — Object-oriented programming
    url: "https://en.wikipedia.org/wiki/Object-oriented_programming"
    kind: resource
---
## In one sentence

**Object-oriented programming (OOP)** is a way of organizing code around "objects" that bundle data and the behavior that acts on that data together, instead of keeping data and functions completely separate.

## Why it matters

As programs grow, keeping related data and logic scattered across the codebase makes changes risky and hard to reason about. OOP gives you a way to model real-world things (a user, an order, a car) as self-contained units, so you can change how something works internally without breaking every piece of code that uses it.

## The idea

A **class** is a blueprint — it describes what properties and methods every object built from it will have, without being an actual object itself. An **object** (or instance) is a specific thing created from that blueprint, with its own values. If `Car` is the class, `myRedCar` is an object made from it.

**Encapsulation** means keeping an object's internal details private and only exposing what other code needs, through defined methods — like a car's dashboard hiding the engine's mechanics behind a simple set of controls. This protects data from being changed in unexpected ways.

**Inheritance** lets one class build on another, reusing its properties and methods instead of rewriting them. A `SportsCar` class could inherit from `Car` and get everything a car has, adding its own extra behavior like a turbo boost.

**Polymorphism** means different classes can respond to the same method call in their own way. If both `Car` and `Motorcycle` have a `move()` method, you can call `.move()` on either without caring which one it is — each handles it according to its own logic. This is what lets you write code that works with a whole family of related objects without a big pile of if-else checks for each type.

## In practice

```js
class Animal {
  constructor(name) {
    this.name = name; // encapsulated on the object
  }
  speak() {
    return `${this.name} makes a sound`;
  }
}

class Dog extends Animal { // inheritance: Dog reuses Animal's setup
  speak() {                // polymorphism: Dog overrides speak()
    return `${this.name} barks`;
  }
}

const animals = [new Animal('Generic'), new Dog('Rex')];
animals.forEach(a => console.log(a.speak())); // each calls its own speak()
```

The loop calls `.speak()` the same way on every object, but `Dog` and `Animal` each answer differently — that's polymorphism in action.

## Quick reference

| Pillar | What it means | Everyday analogy |
|---|---|---|
| Encapsulation | Hide internal details, expose a clean interface | A car's dashboard hides its engine |
| Inheritance | Reuse another class's behavior | A sports car is still a car |
| Polymorphism | Same method call, different behavior per type | Both dogs and cats "speak" differently |
| Abstraction | Model only the relevant details | A car interface ignores engine internals |

## What interviewers ask

- **What is the difference between a class and an object?** — A class is a blueprint defining structure and behavior; an object is a concrete instance created from that blueprint with actual values, and you can create many objects from one class.
- **What is polymorphism, and why is it useful?** — It's the ability for different classes to implement the same method differently, letting you write code that works generically across related types without checking which specific type you have.
- **When would you favor composition over inheritance?** — When the "is-a" relationship doesn't genuinely hold, or when inheritance chains get deep and fragile; composition (building objects out of smaller reusable pieces) tends to be more flexible than forcing everything into a rigid class hierarchy.

## Common mistakes

- Using inheritance just to share code, even when the relationship isn't truly "is-a" — this leads to fragile hierarchies; prefer composition (an object *has* a helper) when the relationship isn't a genuine subtype.
- Making every property public "just in case" — this defeats encapsulation and lets other code depend on internal details that should be free to change later.
