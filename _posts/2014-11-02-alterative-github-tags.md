---
layout: post
title: Alternative Github Tags
categories: Work
tags: [tech, git, tips-and-tricks]
---

Most github users are aware of tagging issues and pull requests to organize them better. Some also know that it's a good idea to create your own tags to suit your team's individual needs. Our team uses some tags that help deal with communication in larger projects with many collaborators. They're not the usual permanent issue labels, but rather, stateful indicators that alert teammates what the status of a pull request is at a glance.

The Background
--------------

Like many experienced git users, I make branches for nearly everything. And as an experienced git user in a team-based environment, I tend to stagger those branches to introduce large changes in the following order.

1. Outline the impact, typically by changing the directory structure.
0. Submit blank tests that serve as a rough contract of the change.
0. Write code that would allow the tests to pass.
0. Write tests.

The advantages of this approach are huge. Pull requests generally hover around ~200 lines added or removed at any given time. Each phase of the full change never breaks any build automation, and if it does, there's an opportunity to discuss the value, the approach, or the technique used at that point, or at any point before it. You can also get a good idea of what needs to happen in subsequent pull requests as you go along. For me, having 700 or 900 lines of code changes in a single pull request is unacceptable (unless you're checking in machine generated data).

The downsides are pretty obvious too &mdash; both myself and the reviewer are in charge of juggling possibly four or more pull requests all at once. If there's a typo in the second pull request, I'll have to introduce it there, and rebase all following branches on it again. This can lead to excessive force-pushing, and extra communication with any reviewers who like to [check out the code locally as they review]({% post_url 2014-07-12-github-reviews-use-your-editor %}).

The Summary
-----------

One of the main issues I had with this workflow involved the previously mentioned communication overhead. I'd see three or four of my own pull requests open, and four comments split up over two of them. I'd need to constantly remind myself which branch needed what changes, especially for routine tasks like rebasing against master. We discussed the idea of having tags that don't represent the essence of an *entire issue*, but rather, the current state of an open pull request.

Eventually we agreed to add the following tags. They've been very helpful for us, and you should consider adding them to your project as well.

- Pull Request Reviewed with Comments

> A persistent "you've got mail" for the pull request. Once cleared, this means the submitter has responded to comments.

- Pull Request Merge on CI/CD Passes

> Helpful for when you want to let everyone know that the pull request is good, and no other actions need to be taken once the automation runs with a clean exit. I've had a great time merging two or three pull requests I knew nothing about this way.

- Pull Request Needs Rebase

> For when a pull request stays open too long and another pull request has been merged ahead of it that makes a conflict.

- Pull Request Needs Squash

> Lets the pull request owner know that they've addressed reviewer feedback successfully, and need to tidy up the commit log by melding all commits into one.

Once any of the above tasks are completed, the submitter removes the tag.

More Traditional Issue Tags
------------------------

Aside from those temporary tags, here are other handy "traditional" tags to add to your github pull requests.

- Needs Discussion

> A signal for other reviewers to weigh in on a possible disruptive change to the codebase.

- Large/Small Pull Request

> Subjectively applied to pull requests that will likely be prioritized due to its size. It's nice to know which pull requests will take 5 minutes to review, and which will take 5 hours.

- 3rd Party Version Change

> Makes it more apparent to those who review your code locally to refresh their third party dependencies before trying to vet the changes.

- Breaking Change

> Introduces a backwards-incompatible change to anyone depending on the code featured in the pull request.
