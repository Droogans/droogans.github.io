---
layout: post
title: Colorizing Output from the cat Command
categories: Work
tags: [tech, tips-and-tricks]
---

I have a special function called [pcat](https://github.com/Droogans/dotfiles/commit/6d1929aed66094851091705c9d5a11a590b53385), which stands for "pretty catenate", saved in my dotfiles repository on github. I really wish this style of cat would be the default on modern machines.

Here it is, sans link:

```sh
function pcat() {
  pygmentize -f terminal256 -O style=native -g $1 | less;
}
alias cat=pcat
```

I've omitted the part where you get [`pip`](https://pip.pypa.io/en/latest/installing.html) installed on your machine first, and install the `pygments` module for [colorizing output based on a detected language](https://pygments.org/demo/374513/). This is required.

Here's an example of what the output looks like on my machine:

<table>
 <tr>
  <td>
    <code>$> cat src/openstack/identity.clj</code>
  </td>
 </tr>
 <tr>
  <td align="center">
   <img src="https://i.imgur.com/RVOMxZj.png" alt="Pretty cat output for a clojure file"></img>
  </td>
 </tr>
</table>

Even though it seems like overkill (you could just as easily open the file in your editor), it's small, unobtrusive, and strangely, not the default.
