---
layout: post
title: Use Zero for Every Numbered List in Markdown
categories: Work
tags: [tips-and-tricks, tech]
---

Here's a simple habit that can make working with numbered lists in markdown much simpler, especially if you're still mentally figuring out the order of the list as you're typing it.

Typically, numbered lists in markdown are demonstrated in a simple, straightforward fashion.

```
1. A list
2. Where order
3. Matters greatly
4. And could change
5. In the future
```

Now, should I need to add a step that I forgot, I'd have some unneccessary editing to do.

```
1. A list
2. Of important things
2. Where order
3. Matters greatly
4. And could change
5. In the future
```

The second two becomes a three, the second three becomes a four, and so on. It's a subconcious thing -- I believe that most writers have a desire to number their lists appropriately, and will want to see them fixed right away. It hinders thinking if the list is numbered incorrectly (at least it does for me). Once the list looks pretty again, thinking resumes. And now, another entry is placed between numbers two and three, and the cycle continues.

Here's a better way.

```
0. A list
0. Of important things
0. Where order
0. Matters greatly
0. And could change
0. Very easily
0. In the future
```

This will render as the same numbered list, and appears as a neutral "increment" value of zero. Of course, inserting or rearranging this list is trivial.
