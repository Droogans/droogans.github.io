---
layout: post
title: Silence Noisy Selenium Server Ouput in Travis CI
categories: Work
tags: [tech, tips-and-tricks]
---

If you use [Travis CI](https://travis-ci.org/) to run your end to end tests, you may want to start with something simple and run a local selenium server to communicate with the browser. Although [SauceLabs is a really powerful tool](https://saucelabs.com/home) for mature, cross-browser projects with solid testing procedures, it can be a bit of a burden to sign up for, pay for, and configure it for Travis CI runs. For something like the project I'm working on, we only care about testing against a modern install of Firefox, and doing this is as simple as adding the following lines to your project's `.travis.yml` file.

~~~
language: node_js
node_js:
- '0.10'
before_install: npm install -g protractor@1.0.0 mocha@1.18.2
install:
- npm install
- webdriver-manager update --standalone
before_script:
- export DISPLAY=:99.0
- sh -e /etc/init.d/xvfb start
- webdriver-manager start &
script:
- protractor protractor.conf.js
~~~

This is a bare-bones setup for running (free) end to end tests using only the Travis VM, and on first glance appears normal. And you'd be right thinking this. Although that last command does start a background selenium server, it has an awful side effect of polluting the logs with output containing javascript that runs against the browser during the test run.

For example, here is *just one* of the many tests that run on every pull request of [the encore-ui project](https://rackerlabs.github.io/encore-ui/#/overview) I've been contributing to lately.

~~~
  rxDiskSize
17:01:46.133 INFO - Executing: [get: data:text/html,<html></html>])
17:01:46.168 INFO - Done: [get: data:text/html,<html></html>]
17:01:46.175 INFO - Executing: [execute script: window.name = "NG_DEFER_BOOTSTRAP!" + window.name;window.location.replace("https://localhost:9001/#/component/rxDiskSize");, []])
17:01:46.231 INFO - Done: [execute script: window.name = "NG_DEFER_BOOTSTRAP!" + window.name;window.location.replace("https://localhost:9001/#/component/rxDiskSize");, []]
17:01:46.261 INFO - Executing: [execute script: return window.location.href;, []])
17:01:46.520 INFO - Done: [execute script: return window.location.href;, []]
17:01:46.555 INFO - Executing: [execute async script: try { return (function (attempts, asyncCallback) {
  var callback = function(args) {
    setTimeout(function() {
      asyncCallback(args);
    }, 0);
  };
  var check = function(n) {
    try {
      if (window.angular && window.angular.resumeBootstrap) {
        callback([true, null]);
      } else if (n < 1) {
        if (window.angular) {
          callback([false, 'angular never provided resumeBootstrap']);
        } else {
          callback([false, 'retries looking for angular exceeded']);
        }
      } else {
        window.setTimeout(function() {check(n - 1);}, 1000);
      }
    } catch (e) {
      callback([false, e]);
    }
  };
  check(attempts);
}).apply(this, arguments); }
catch(e) { throw (e instanceof Error) ? e : new Error(e); }, [10]])
17:01:46.567 INFO - Done: [execute async script: try { return (function (attempts, asyncCallback) {
  var callback = function(args) {
    setTimeout(function() {
      asyncCallback(args);
    }, 0);
  };
  var check = function(n) {
    try {
      if (window.angular && window.angular.resumeBootstrap) {
        callback([true, null]);
      } else if (n < 1) {
        if (window.angular) {
          callback([false, 'angular never provided resumeBootstrap']);
        } else {
          callback([false, 'retries looking for angular exceeded']);
        }
      } else {
        window.setTimeout(function() {check(n - 1);}, 1000);
      }
    } catch (e) {
      callback([false, e]);
    }
  };
  check(attempts);
}).apply(this, arguments); }
catch(e) { throw (e instanceof Error) ? e : new Error(e); }, [10]]
17:01:46.580 INFO - Executing: [execute script: angular.resumeBootstrap(arguments[0]);, [[]]])
17:01:46.990 INFO - Done: [execute script: angular.resumeBootstrap(arguments[0]);, [[]]]
17:01:47.022 INFO - Executing: [execute async script: try { return (function (selector, callback) {
  var el = document.querySelector(selector);
  try {
    angular.element(el).injector().get('$browser').
        notifyWhenNoOutstandingRequests(callback);
  } catch (e) {
    callback(e);
  }
}).apply(this, arguments); }
catch(e) { throw (e instanceof Error) ? e : new Error(e); }, [body]])
17:01:47.032 INFO - Done: [execute async script: try { return (function (selector, callback) {
  var el = document.querySelector(selector);
  try {
    angular.element(el).injector().get('$browser').
        notifyWhenNoOutstandingRequests(callback);
  } catch (e) {
    callback(e);
  }
}).apply(this, arguments); }
catch(e) { throw (e instanceof Error) ? e : new Error(e); }, [body]]
17:01:47.059 INFO - Executing: [find elements: By.selector: .component-demo ul li])
17:01:47.071 INFO - Done: [find elements: By.selector: .component-demo ul li]
17:01:47.101 INFO - Executing: [get text: 36 [[FirefoxDriver: firefox on LINUX (54c8e519-0211-45d5-a1f2-64bb2526e652)] -> css selector: .component-demo ul li]])
17:01:47.114 INFO - Done: [get text: 36 [[FirefoxDriver: firefox on LINUX (54c8e519-0211-45d5-a1f2-64bb2526e652)] -> css selector: .component-demo ul li]]
  ✓ should still have 420 GB as test data on the page
~~~

Even though I feel it goes without saying, this kind of output is not something I look forward to seeing, especially when my end to end tests are breaking the build. In fact, many of the pull request test runs wind up [maxing out the logs at 10000 lines](https://travis-ci.org/rackerlabs/encore-ui/builds/33919596#L10000), potentially killing all ability to debug a broken test. This issue can compound when faced with a bug that isn't reproducible on my machine, but appears to break in the CI environment.

Fortunately, you can [literally change one line in your project's `.travis.yml` file](https://github.com/rackerlabs/encore-ui/commit/a568a2e8c33ed76eb6dafce25888bd9d45ffec82) to prevent this sort of behavior.

~~~
before_script:
- export DISPLAY=:99.0
- sh -e /etc/init.d/xvfb start
# Immune to logouts, but not VM deprovisions!
- nohup bash -c "webdriver-manager start 2>&1 &"
~~~

The end result is a clean, informative test run report that looks just the one you saw on your development machine before you pushed up your branch (at least, *hopefully* you ran the end to end tests before you pushed up your branch).

~~~
$ protractor protractor.conf.js

Using the selenium server at https://localhost:4444/wd/hub
  rxDiskSize
  ✓ should still have 420 GB as test data on the page
  ✓ should convert 420 GB back to gigabytes
  ✓ should still have 125 TB as test data on the page
  ✓ should convert 125 TB back to gigabytes
  ✓ should still have 171.337 PB as test data on the page
  ✓ should convert 171.337 PB back to gigabytes
  ✓ should still have 420 GB as test data on the page
  ✓ should convert 420 GB back to gigabytes
  ✓ should still have 125 TB as test data on the page
  ✓ should convert 125 TB back to gigabytes
  ✓ should still have 171.337 PB as test data on the page
  ✓ should convert 171.337 PB back to gigabytes

  12 passing (3s)

The command "protractor protractor.conf.js" exited with 0.
~~~

<sub><sub>**Full disclosure**: I found this helpful tip while browsing [codeship.io's excellent documentation](https://www.codeship.io/documentation/continuous-integration/run-a-command-in-the-background/), which provides a service similar to Travis CI, and is also my personal preference for my side projects. However, this article was written for those who, like myself, find themselves encountering Travis CI in a project that they don't control.</sub></sub>
