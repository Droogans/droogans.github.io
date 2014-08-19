---
layout: post
title: Github Pull Request Statuses with drone.io
categories: Work
tags: [tech, git, tips-and-tricks]
---

The free CICD site [drone.io](http://drone.io) is a really useful, lightweight replacement for Jenkins for free, open source repositories. Being purpose built for just one thing means setting up a new project takes literally a tenth of the time compared to Jenkins.

But one thing it is lacking is the ability to run CICD tests against new pull requests that have been merged into master first, and updating the status in the pull request while it's doing it. Most google searches for help will uncover forum posts with users requesting this feature, followed by promises from the drone.io team to get around to adding this functionality in "six to eight weeks".

Fortunately, you can roll these things out yourself. Just follow these steps:

- Create an [OAuth Token](https://help.github.com/articles/creating-an-access-token-for-command-line-use) from your github user profile.
 - You only need to enable the `public_repo` and `repo:status` scopes.
- In your drone.io settings page, paste the token you got from github into the "Environment Variables" textbox.

For example:

<table>
 <tr>
  <td align="center">
   <img src="http://i.imgur.com/QXQE74f.png" alt="drone.io project settings page."></img>
  </td>
 </tr>
</table>

- Next, add some code that will allow you to replicate the behavior that is available in other CICD providers, such as TravisCI.

```bash
function postStatus {
  curl -so /dev/null -X POST -H "Authorization: token $OAUTH_TOKEN" -d "{\"state\": \"$1\", \"target_url\": \"$DRONE_BUILD_URL\", \"description\": \"Built and tested on drone.io\", \"context\": \"Built and tested on drone.io\"}" https://api.github.com/repos/:YOUR_NAME:/:YOUR_REPO:/statuses/$DRONE_COMMIT;
}

postStatus pending
git merge master $DRONE_BRANCH
if [ $? -ne "0" ]; then
  echo "Unable to merge master..."
  postStatus error
  exit 1
fi

```

Finally, add code for your specific project to actually do some testing. Here's a simple example that you might use for a node app.

```bash
npm install --loglevel=warn
if [ $? -ne "0" ]; then
  postStatus error
  exit 1
fi

npm test
if [ $? -eq "0" ]; then
  postStatus success
else
  postStatus failure
fi
```

That's it! Once your vanilla setup with drone.io is set up, everything else should just work.
