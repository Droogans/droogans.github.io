---
layout: post
title: Use your Editor for Pull Request Reviews
categories: Work
tags: [tech, git]
---

When reviewing pull requests, I've noticed it's way too easy to scan through the green and red lines, compare them quickly in your mind, and make hasty decisions about what's changed in the code.

Here's a secret: when code changes, it changes in more places than what's shown in the diff. It sounds strange, but it's true. You look at the diff of a two line change, scan the green line, the red line, and think, "This is doing the same thing, just a little differently. And it fixes a bug. Looks good to me". You merge it, and later that week, end up looking at the file on an unrelated task while following a stack trace. Suddenly, you see the method in the context of the file: the usage of this other class' method is borderline abusive. What's it doing here? It wasn't meant to be used in these types of situations! Who did this? You run `git blame`, and trace it back to a pull request that you merged just a few days ago.

If this hasn't happened to you, it will eventually, given your team and codebase grow to such a size as to make it impossible for one person to have mastery over all of it. So in an effort to reduce the [silo effect](https://en.wikipedia.org/wiki/Information_silo), you may participate in code reviews. The number one way to do this is in the web interface provided by github.


<span class="image-section">
![A sample of github's web based diff view.](https://i.imgur.com/sDbQ01N.png)
</span>

Although convenient, it lacks several things:

 1. Your keyboard is useless in this view.
 0. Your color scheme is probably not the same.
 0. Your font is likely different than what you're used to.
 0. The context of the surrounding code is weak at best.

And most importantly, reading diffs is hard. I imagine a developer spends at best a tiny fraction of their time looking at code through the lens of a diff file. The overwhelming majority of the time is spent reading code in the context of wielding it, via an editor of some kind. Looking at code in an editor forces you to stop *reading* the code and start *comprehending* it instead.

Reading diffs is like shopping for clothes online. You can get a good idea of what you think it's like, but until it arrives in a more tangible form, you won't know how it fits and feels overall. So from now on, consider adding an extra 30 seconds to your code review process, and fetch that branch, check it out, and take it for a spin. I guarantee you'll notice a difference in your review process right away. You don't write your code using the [hilariously inadequate github web interface](https://i.imgur.com/GbYxTRE.png), so why should you settle for reading it in a similarly crippled fashion?

I would go as far to say that github should expose an option for me to completely *disable* diff previews for pull requests, and their respective commits on my team. Instead, it would only tell you what files changed, and where. It's up to you to see what those changes were.

There should only be one way to look at code: in the same circumstances that it was written in, and in the same environment it will be interacted with from now on.
