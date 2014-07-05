---
layout: post
title: Git Off My Lawn
categories: Work
tags: [tech, git]
---

After working through a tricky situation in an intern's git repository (her co-worker had literally squashed everything on master into one commit), I was asked how I did it. This led to some passing remarks from others participating in the conversation that almost everything I was showing her involved "bad, destructive commands", and I immediately agreed. My git work flow is centered around many commands that online resources will tell you, [quite bluntly](http://paul.stadig.name/2010/12/thou-shalt-not-lie-git-rebase-ammend.html), to never use. But many of those commands offer the most flexibility, granted you follow a couple of precautionary steps first.

### Step One: Fork Every Project You Ever Work On.

This is just a good habit to get into. If I could, [I would fork this blog](https://github.com/Droogans/droogans.github.io), but since I'm both the owner and the only contributor, I can't. Once you've forked a repository, add it as a remote.

```
$> git clone projectYouForked && cd projectYouForked
...
$> git remote show origin
* remote origin
  Fetch URL: git@github.com:Droogans/projectYouForked.git
  Push  URL: git@github.com:Droogans/projectYouForked.git
  HEAD branch: master
...
$> git remote add upstream git@github.com:Org/projectYouForked.git
```

Once you have this set up, you can use [my wonderful `git update` command](https://github.com/Droogans/dotfiles/blob/7c7f50ba65900b032c1c6dada93e25f30a69f32b/.gitconfig#L41), which requires that you have both an origin and upstream remote set up.

```
$> git update --help
```

`git update` is aliased to

```
git fetch --all --prune &&
git cleanup
git pull --rebase upstream master &&
git push origin master &&
```

What this command does is:

 1. Grab all new updates from every remote repository.
 0. Also, delete anything that has been deleted on their end, too
 0. Delete any branches on our remote that have been merged into master.
 0. Pull any new changes underneath our existing ones.
 0. Push our new copy of the project to our repository.

The command `git cleanup` is alised to:

```
git branch --merged | grep  -v '\*master' | xargs -n 1 git branch -d
```

This deletes the branches that have already been merged into master.

At this point, maintaining a fork becomes as easy as checking out master and running `git update` periodically. I actually have some projects with four remotes, and this works just fine in those instances, too.

### Step Two: Make Branches for Everything.

This is a far less controversial suggestion than rewriting history. But, when combined with step one, you are pretty much assured that the number of people who will be relying on your history to be stable are limited to just you. I keep a pretty open policy with how I manage my teammates' remotes and their branches: your remote, your branch, your history. Obviously, anyone who is going to alter the deeper history they inherited from the master branch is being *very* inconsiderate of the rest of the team.

### Step Three: Rebase, Amend, and More

In the above example, we had an unusual situation. The intern I was helping had a pull request open against a master branch, that, earlier that day, had been squashed into one commit. Since this was a new project with less than twenty commits, I was understanding of this move, but not amused. Her pull request was no longer mergable. Github was telling her to checkout her branch, update it against master, and push it back to get it mergable again.

Her branch had about six commits on it, and another 8 beneath in, which came from an outdated version of the master branch. Those eight commits were now one. So first things first, I immediately saved what she had, and got her master branch in sync with github's version of master.

```
$> git commit -am "New Feature WIP."
$> git checkout master
$> git reset --hard origin/master
```

Many people see `git reset --hard` and panic, and [for good reason](http://stackoverflow.com/a/9530204/881224). You can possibly lose everything you've worked on, given it's currently being tracked by git. But in this case, I wanted to "match" everything that was in the master branch on github, regardless of what's in my local master branch.

```
$> git checkout feature-branch
$> git rebase master
```

When I ran this, I discovered that there were a lot of small commits on her `feature-branch`, for trivial fixes that were created while discovering what was going to work, and what wasn't. This sort of pattern leads to great [commit discipline](http://www.databasically.com/2011/03/14/git-commit-early-commit-often/), but awful rebasing. Every commit will likely reintroduce the same conflicts each time you approach the most recent commit, which is frustrating.

An easy way around this is to squash everything you've worked on into one commit. That way, rebasing only has to run through one set of conflicts.

```
$> git rebase -i HEAD~8
pick 0c55f9e added the main file.
pick 5cf9d40 new helper file added.
pick 1be507c fixed unit test.
pick 5b1edae fix complaints from lint checker
pick 7661672 update readme
pick 93648a7 add new method
pick 67f1dfb fix new method, ready for pull request
pick fc2f6e5 New Feature WIP.
```

I wanted to keep the first commit, but make the commit sound better. Then, I'd need to move all of those tiny fixes into it, and lastly, keep the *"New Feature"* commit separate for later.

```
$> git rebase -i HEAD~8
reword 0c55f9e added the main file.
squash 5cf9d40 new helper file added.
squash 1be507c fixed unit test.
squash 5b1edae fix complaints from lint checker
squash 7661672 update readme
squash 93648a7 add new method
squash 67f1dfb fix new method, ready for pull request
pick fc2f6e5 New Feature WIP.
```

The end result is a history that now looks like this:

```
$> git lg -3
fc2f6e5 - New Feature WIP. (2 minutes ago) <Intern>
4fa0854 - Main Feature. (2 minutes ago) <Intern>
bcdb780 - Squash master. (7 hours ago) <Co-worker>
91feb23 - Initial Commit. (4 days ago) <Co-worker>
```

Next, I needed to get that *"New Feature WIP"* commit on a separate branch, where it belonged:

```
$> git reset ^HEAD
$> git status -sb
## feature-branch
 M next_big_thing.py
```

A big mental hurdle that the intern had to get over was that, by creating a new branch here, I lose absolutely nothing in the history we'd been working towards building (or rebuilding) the entire time.

```
$> git checkout -b new-feature
$> git commit -am "New Feature WIP."
$> git lg -4
d710b6d - New Feature WIP. (1 minute ago) <Intern>
4fa0854 - Main Feature. (4 minutes ago) <Intern>
bcdb780 - Squash master. (7 hours ago) <Co-worker>
91feb23 - Initial Commit. (4 days ago) <Co-worker>
```

And then we go to the old branch.

```
$> git checkout feature-branch
$> git lg -3
4fa0854 - Main Feature. (4 minutes ago) <Intern>
bcdb780 - Squash master. (7 hours ago) <Co-worker>
91feb23 - Initial Commit. (4 days ago) <Co-worker>
```

I now only have three commits in this branch: the initial commit, the squashed master commit, and the clean, ready to merge version of the feature. Checking out the `new-feature` branch will have all those same commits, plus the one new commit I had made for her just now. Very clean!

The next step is to get this up to github, where it can be reviewed and merged by her co-worker.

```
$> git push origin -f
```

The `-f` flag is the dreaded [force push](https://groups.google.com/forum/#!msg/jenkinsci-dev/-myjRIPcVwU/t4nkXONp8qgJ), possibly [the most famous](http://cdn.memegenerator.net/instances/400x/24736889.jpg) of all git operations in programming circles. It says, "my version of this branch is now the official version of this branch, for everyone". Obviously, doing this to the master branch is a really easy way to get a bad performance review at work, but in our *own fork, in our own branch*, there should be exactly zero other people depending on your version of history as a source of truth. Finally, we can have our co-worker merge this branch into master. Afterwards, we continue working like nothing happened.

```
$> git checkout master
$> git update
Fetching origin
Fetching upstream
...
From github.com:Org/projectYouForked.git
 x [deleted]  (none)     -> upstream/co-workers-other-feature
 x [deleted]  feature-branch -> origin/feature-branch
From github.com:Org/projectYouForked
 * branch     master     -> FETCH_HEAD
First, rewinding head to replay your work on top of it...
Fast-forwarded master to be64c9f71dcb7dea22e8828bd93de6b9daeb1d6c.
...
To git@github.com:Coworker/projectYouForked.git
   5c009ee..be64c9f  master -> master
```

Now, we simply jump back into the `new-feature` branch that we set up earlier, and get back to work.

```
$> git checkout new-feature
$> git rebase master
```

We are now completely up to date, even though the foundation of the entire project was destroyed without our consent.

### Why You Should at Least Know this Stuff

I will admit, this is a really dangerous workflow, and not many people would be comfortable using it. That's fine. But if all you know is how to merge the new master into your current branch, you'd have never made it out of this situation, since merging would never resolve the disparate histories of your branch and the new master branch. The pull request would have never become mergable.

You'd have to clone the repo again in a new directory, and copy-paste your work from the one set of files to the other. Or, perhaps you know how to create a patch file, and you did it that way. Maybe you know how to `reset --hard`, and you instead created a `feature-retry` branch, using `git cherry pick` to grab each of the six commits you made in the first iteration of the `feature-branch`. All of these ways are slower, more error prone, and realistically, not an option in a larger project where dozens (or hundreds) of commits separate you and the new master branch. Most options outside of rewriting history are harder than just using the options git provides you.
