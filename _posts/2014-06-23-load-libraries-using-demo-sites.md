---
layout: post
title: Test Driving Javascript Libraries in the Browser
categories: Work
tags: [tech, tips-and-tricks]
---

Last week, one of my co-workers showed me a really nice trick you can use if you find yourself needing to validate some snippet that features a javascript library.

Here, I was about to test whether or not I could sort the results of a `map` call in lodash by going through the typical ceremony of using `require` in the node interpreter environment.

<span class="image-section">
![Testing javascript functionality through node.](https://i.imgur.com/Kl7WxyZ.png)
</span>

Fortunately, said co-worker was working with me when he saw me doing this, and stopped me.

Next time you're tempted to drop down into an interactive environment to test out an idea like this, instead, just go to that library's live demo or documentation website. In this case, it was [https://lodash.com/docs](https://lodash.com/docs). Next, open a command-line console in the browser's developer tools. Using Chrome on a Mac, that would be `⌘ ⌥` `j`, or `ctrl shift` `j` for Windows/Linux. For Firefox, replace `j` with `i`.

From there, you're good to go! Just start using the library, as it's already been brought into the page via the demo anyhow.

<span class="image-section">
![Getting instant access to the Lodash library on the lodash site.](https://i.imgur.com/AOVniZC.png)
</span>
