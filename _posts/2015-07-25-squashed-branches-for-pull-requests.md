---
layout: post
title: Squashed Branches for Pull Requests
categories: Work
tags: [tips-and-tricks, tech, git]
---

[Squashing pull requests](https://stackoverflow.com/questions/5189560/squash-my-last-x-commits-together-using-git) is a common theme in many software projects that use git for version control. I won't go over the reasons why in depth, but rather focus on a workflow that can help address a lot of the controversy around squashing pull requests into a single commit.

Let's say I'm creating a new feature on a branch, and like many developers, I choose to [commit early and often](https://stackoverflow.com/questions/107264/how-often-to-commit-changes-to-source-control). Every new chunk of a feature triggers a commit and a push to my branch, including unrelated commits that clean up documentation and comments. By the time I'm finished, I may see something like this.

~~~
09:05:24 (cool-new-feature) ~/code/js/project-name
$: git lg 6
ee11b36 - style(grunt): Sort tasks alphabetically (2 minutes ago) <Droogans>
aeef141 - feat(search): Autofocus on search box (8 minutes ago) <Droogans>
63c7f63 - refact(search): Clean up some unused code (34 minutes ago) <Droogans>
7282f5f - chore(tags): Alter tags (1 hour ago) <Droogans>
077e361 - feat(search): Outline WIP (2 hours ago) <Droogans>
42354f2 - Merge pull request #45 from Droogans/old-feature (1 day ago) <Droogans>
~~~

Although this represents a clean commit history, the inclusion of the phrase `"WIP"` in commit `077e361` definitely suggests that some cleaning up is in order. However, lumping all of this work into a single commit might strike others as heavy handed since there are unrelated fixes to documentation and some build automation.

## Making `-squashed` Branches

> <sub>[A visual summary](https://i.imgur.com/EVvh9Mv.jpg).</sub>

A simple way around this is to include a branch for both the original pull request (warts and all), and another branch that officially gets merged. Here's the same example from above continued in this way.

First, I push up the `cool-new-feature` branch.

~~~
09:21:10 (cool-new-feature) ~/code/js/project-name
$: git push origin cool-new-feature
~~~

From there I open a new pull request and ask for a review. Once it gets signed off, the maintainer asks me to push up the squashed version for merging.

~~~
14:48:52 (cool-new-feature) ~/code/js/project-name
$: git checkout -b cool-new-feature-squashed
Switched to a new branch 'cool-new-feature-squashed'
14:48:56 (cool-new-feature-squashed) ~/code/js/project-name
$: git rebase -i 42354f2 # this is the merge commit from latest master
Waiting for $EDITOR...
~~~

From there, my editor would display the list of five commits I've made in this branch. I would tag probably do something like this for my summarized pull request.

~~~
pick ee11b36 - style(grunt): Sort tasks alphabetically
pick aeef141 - feat(search): Autofocus on search box
squash 63c7f63 - refact(search): Clean up some unused code
squash 077e361 - feat(search): Outline WIP
pick 7282f5f - chore(tags): Alter tags

# Rebase 42354f2..ee11b36 onto 42354f2 (       5 TODO item(s))
#
# Commands:
# p, pick = use commit
# r, reword = use commit, but edit the commit message
# e, edit = use commit, but stop for amending
# s, squash = use commit, but meld into previous commit
# f, fixup = like "squash", but discard this commit's log message
# x, exec = run command (the rest of the line) using shell
#
# These lines can be re-ordered; they are executed from top to bottom.
#
# If you remove a line here THAT COMMIT WILL BE LOST.
#
# However, if you remove everything, the rebase will be aborted.
#
# Note that empty commits are commented out

~~~

This reorders the commits so that some necessary (but still unrelated to the feature directly) is done first, then places any and all code related to the feature (including refactoring) into a single commit. Finally, a useful but unrelated commit is included at the end.

The commit in the middle prompts me to make some decisions about how I'm going to name these commits. I change the commit message for the ugly "WIP" outline commit that I made at first, and replace it with something well-formed and succinct that summarizes the entire feature. Below that, I leave the squashed commits as a foot note for maintainers to read, using the opportunity to highlight what is going on in detail should they need to know later.

~~~
# This is a combination of 3 commits.
# The first commit's message is:
feat(search): Cleaner search results

This addresses some issues with search results not displaying the
most important information first. Stop showing so many details about
the search result web site and focus on highlighting the content
instead to give users a better idea of what the result contains.

# This is the 2nd commit message:

refact(search): Clean up some unused code

`search-result.html` is better included inside of the main search
table directive, as they seem to be doing a lot of the same work
in two different places. This also presented an opportunity to
introduce a new service for search results, instead of doing
everything in the search controller.

# This is the 3rd commit message:

feat(search): Autofocus on search box

You had to click the search box to start searching, now you just type.

# Please enter the commit message for your changes. Lines starting
# with '#' will be ignored, and an empty message aborts the commit.
#
# Date:      Sat Jul 18 14:49:01 2015 +0300
#
# rebase in progress; onto 42354f2
#
# Changes to be committed:
#	modified:   app/src/search/controller.js
#	modified:   app/src/search/controller.spec.js
#	deleted:    app/src/search/search-result.html
#   modified:   app/src/search/search-table.html
#	new file:   app/src/search/service.js
#   new file:   app/src/search/service.spec.js
#
~~~

This is really useful because it accomplishes a lot of good things at the same time.

0. There is a verbose log in `<branch-name>`
0. There is a clean, merge-friendly log in `<branch-name>-squashed`
0. Commits made early and often can be sloppy, cryptic, and frequent
0. Commits squashed together in the squashed branch are documented at squash time, allowing developers the flexibility of doing all clean up work at once, when they know the feature is good and ready for merging
0. You allow the developer to focus on one thing at a time — getting the feature working first, and then later, getting the feature well documented for others to look back on in the future. It can be distracting to constantly switch between those two mindsets

Once I'm finished, I do a quick sanity check to make sure everything looks alright.

~~~
14:51:33 (cool-new-feature-squashed) ~/code/js/project-name
$: git lg 4
68bd51e - style(grunt): Sort tasks alphabetically (1 minute ago) <Droogans>
8bd8771 - feat(search): Outline WIP (1 minute ago) <Droogans>
f61bbe2 - chore(tags): Alter tags (1 minute ago) <Droogans>
42354f2 - Merge pull request #45 from Droogans/old-feature (1 day ago) <Droogans>
14:51:38 (cool-new-feature-squashed) ~/code/js/project-name
$: git push origin cool-new-feature-squashed
~~~

I open a new pull request, close the first one, and merge it.

Keep in mind you'll want the project documentation to contain information to contributors that any branch that has been merged can have `-squashed` removed from the end of it to reveal a verbose change log from the developers rough draft of the feature.
