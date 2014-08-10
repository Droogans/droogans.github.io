---
layout: post
title: Occam's Razor as a Debugging Tool
categories: Work
tags: [tech, tricks-and-tips]
---

On Friday, I had finished my tasks for the day a little early and decided to check up on the co-workers around me, just to see if any of them had anything blocking them, or anything interesting they'd like to show off to me. It turns out one had been stuck on an issue for the last 45 minutes. He had at least fifteen tabs open, sighed a lot, and was visibly exhausted. Basically, he was sending about a clear a signal as one can that they're debugging some odd behavior. The issue at hand revolved around a really pleasant function, as far as troubleshooting goes.

```js
var transformUser = function (users) {
    return _.omit(users, '_links');
};
```

Suddenly, this function had started returning a near empty (but successful) response on staging. Nobody was sure why, and seeing how his team had promoted a build to staging earlier that day, he had been digging deep into his code base, and its dependencies, trying to find the culprit.

I immediately asked him to show me what the correct response should look like. He made a call directly to the upstream api using [Postman](http://www.getpostman.com/features), and returned a list of users that would be passed into this function. This was the exact same call his app was making. So, we copied the JSON payload, ssh'd into staging, and used the `node` command under the project's directory, ensuring the dependencies were an exact match. Sure enough, we found that lodash's `omit` function still worked just fine. But what was the next step?

I said, "*change the function to this*".

```js
var transformUser = function (users) {
    return users;
    // return _.omit(users, '_links');
};
```

He looked at me like I had just asked him to double check if his computer was still connected to the internet. At first he ignored me, saying he just showed me the users call in Postman, and introduced a couple other leads that he'd been looking into now that we'd ruled out lodash. But I insisted, telling him it'd only take a couple of seconds. He did, and ran the broken call again. To his surprise, and my amusement, something like this came back.

```
"\"{\"users\":{\"_links\":{\"data\":{...}}},{\"parents\":\"[...]\"}}\""
```

Apparently, in an attempt to be more RESTful, the api returning the `users` response had added [custom content types](http://restcookbook.com/Resources/using-custom-content-types/) that his Postman client either didn't need or had been configured to use, but had not been updated in the application, which (I suppose) had stricter requirements for using the correct content-type when requesting resources. A few hours later, the upstream api did him a favor and allowed a request to specify `application/json` as it's desired content-type and still receive a valid response, fixing the root issue with no code change needed.

Occam's Razor has many interpretations. Just as you can use it for developing new features (or in this case, api tests!), you can also use it for debugging. Start by validating the most trivial, essential assumptions surrounding the issue before venturing into trickier territory. As much fun as it is to track down and isolate odd behavior in bizarre places (and brag about it after the fact), the reality is that most bugs are far more likely to be pedestrian ones like this.
