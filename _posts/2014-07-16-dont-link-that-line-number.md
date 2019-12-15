---
layout: post
title: Don't Link that Line Number!
categories: Work
tags: [tech, tips-and-tricks, git]
---

Today I saw a co-worker take a link from a specific line number in our team's github repository and place it in the comments section of a user story. This is very helpful for those who need to see a quick reference to the code that could be causing a defect, but it's *wrong*. Here's what you need to do instead.

First, the original setup had a link that looked like this.

<sub><sub><sub>https://github.com/Droogans/.emacs.d/blob/mac/init.el#L135-L138</sub></sub></sub>

<table>
 <tr>
  <td align="center">
   <img src="https://i.imgur.com/RcNvi1C.png" alt="A snippet from a current github file."></img>
  </td>
 </tr>
</table>

Looks great, right? Here's that same link a few weeks later.

<table>
 <tr>
  <td align="center">
   <img src="https://i.imgur.com/DkKkwJV.png" alt="A snippet from an out of date github file."></img>
  </td>
 </tr>
</table>

The problem with linking to line numbers is that if someone were to add some new code above line number 135, your link will still point there, regardless if the new code makes any sense. It's not *anchored* to the code, just to the line numbers in the file.

Here's what you do instead. First, highlight the code that you want to link to, just like in the examples above. Then, tap the "y" key to jump to the last commit found for that region.

That's it! You've now anchored the code in question to an immutable reference in github's history of your project. No matter what happens, this commit will remain unique forever, and you won't have to worry about having to work out what that old reference *used* to point to.
