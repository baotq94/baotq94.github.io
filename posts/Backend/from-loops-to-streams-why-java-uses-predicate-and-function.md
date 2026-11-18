---
title: "From Loops to Streams: Why Java Uses Predicate and Function"
date: 2026-11-18
status: post
category: Backend Engineering
excerpt: "How filtering and transforming collections connect familiar loops to Predicate, Function, and the Java Stream API."
lang: en
---

I was comfortable with a `for` loop. Then I met Java Streams, and suddenly filtering a list came with words like `Predicate` and `Function`. I only wanted some names. Apparently, there was vocabulary homework.

What helped me was starting with the loop I already understood.

## 1. Start with a loop

Let's take a list of names, keep those with at least four characters, and turn them into uppercase.

**Input:** `["An", "Bao", "Linh", "Minh"]`

**Output:** `["LINH", "MINH"]`

Using `List` and `ArrayList` from `java.util`:

```java
List<String> names = List.of("An", "Bao", "Linh", "Minh");
List<String> result = new ArrayList<>();

for (String name : names) {
    if (name.length() >= 4) {
        result.add(name.toUpperCase(Locale.ROOT));
    }
}

System.out.println(result); // [LINH, MINH]
```

`Locale.ROOT` comes from `java.util.Locale`. It keeps this example's uppercase conversion independent of the machine's default language settings.

The loop does two small jobs:

- **Check:** Should this name stay?
- **Transform:** What should this name become?

Java has interfaces for both of these jobs: `Predicate` and `Function`.

## 2. Predicate asks; Function transforms

Both are **functional interfaces**: interfaces with one abstract method. That gives a lambda a clear contract to implement.

| Interface        | Method              | Job                        | Example             |
| ---------------- | ------------------- | -------------------------- | ------------------- |
| `Predicate<T>`   | `boolean test(T t)` | Check a value              | `"Linh"` → `true`   |
| `Function<T, R>` | `R apply(T t)`      | Turn a value into a result | `"Linh"` → `"LINH"` |

`T` is the input type. `R` is the result type, which can be different from `T`.

We can pull those two jobs out of the loop and give them names. These interfaces come from `java.util.function`:

```java
Predicate<String> hasAtLeastFourCharacters = name -> name.length() >= 4;
Function<String, String> toUppercase = name -> name.toUpperCase(Locale.ROOT);

System.out.println(hasAtLeastFourCharacters.test("An"));   // false
System.out.println(hasAtLeastFourCharacters.test("Linh")); // true
System.out.println(toUppercase.apply("Linh"));             // LINH
```

The `name -> ...` expression is a **lambda**, which lets us define behavior without writing a separate class. On the left of `->` is the input; on the right is what to do with it.

One asks a yes-or-no question. The other gives back a result. That's all we need from these two interfaces for this example.

## 3. Hand those jobs to a stream

Now the stream version can reuse that behavior:

```java
List<String> streamedResult = names.stream()
    .filter(hasAtLeastFourCharacters)
    .map(toUppercase)
    .toList();

System.out.println(streamedResult); // [LINH, MINH]
```

Read it from top to bottom:

1. `stream()` starts a pipeline over the names.
2. `filter(...)` keeps names whose predicate returns `true`.
3. `map(...)` transforms each remaining name using the function.
4. `toList()` runs the pipeline and gathers the results.

`filter` and `map` are lazy: building this pipeline does not process the names yet. The terminal operation, `toList()`, triggers the work. It requires Java 16 or later and returns an unmodifiable list.

For `"An"`, the check returns `false`, so it goes no further. For `"Linh"`, the check returns `true`, then the transformation produces `"LINH"`.

We can also write the lambdas directly:

```java
List<String> inlineResult = names.stream()
    .filter(name -> name.length() >= 4)
    .map(name -> name.toUpperCase(Locale.ROOT))
    .toList();
```

Java infers the lambda types from what `filter` and `map` expect. We don't have to write `Predicate` or `Function` every time, but their contracts are still doing the work.

## 4. Why does Java need these interfaces?

Java needs a way to represent behavior as a type. `Predicate<T>` tells the compiler to expect a boolean result, while `Function<T, R>` describes a transformation from one type to another. When we pass a lambda to `filter` or `map`, the compiler uses the expected functional interface to check that the lambda has the right inputs and return type.

That also explains why this fails:

```java
// Does not compile: filter needs a boolean result, not a String.
names.stream().filter(name -> name.toUpperCase(Locale.ROOT));
```

The compiler catches this because `filter()` expects a predicate that returns a boolean. Uppercasing belongs in `map()`.

## 5. Keep the loop when it reads better

For a short “filter, transform, collect” task, I like the stream version because it reads like the steps I have in mind.

For complicated branching, early exits, or code I need to debug line by line, I often prefer a loop. Streams are another way to express the work; they don't automatically make it faster.

The two names I keep in my head: **Predicate asks “keep it?”; Function answers “turn it into what?”**
