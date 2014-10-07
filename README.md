# grunt-circleci [![Circle CI](https://circleci.com/gh/VividCortex/grunt-circleci.png?style=badge)](https://circleci.com/gh/VividCortex/grunt-circleci)


This plugin allows to check the status of a CircleCI build associated to a commit. Useful for apps that need to check for a successful status before running a critical task, like the app deploy.


## Getting started

This plugin requires Grunt `~0.4.0`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```js
npm install grunt-circleci --save-dev
```


Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-circleci');
```


## Configuration

In order to configure the plugin, you need to add a new section `circleci` to the object in `grunt.initConfig()`.


```js
grunt.initConfig({
  circleci: {
    token:    'MySuperSecretTokenGeneratedOnCircleCI'
    username: 'VividCortex',
    project:  'grunt-circleci',
    commit:   'TheHashOfTheCommit'
  }
});
```

### Available options


The following options allow to customize the behaviour of the status check:

#### options.branch

Type `String`
Default: `master`

The name of the branch by which to filter the builds.

#### options.retryOnRunning

Type `Boolean`
Default: `false`

Whether the check should retry or not if the build is currently running.

#### options.retryAfter

Type `Number`
Default: `20000` (20 seconds)

The time in milliseconds the check should wait to retry if _retryOnRunning_ is enabled.

#### options.timeout

Type `Number`
Default: `600000` (10 minutes)

The time in milliseconds after which the check should fail if the build is still running and _retryOnRunning_ is enabled.


### Full example

```js
grunt.initConfig({
  circleci: {
    token:    'MySuperSecretTokenGeneratedOnCircleCI'
    username: 'VividCortex',
    project:  'grunt-circleci',
    commit:   'TheHashOfTheCommit',
    options: {
      branch:         'master',
      retryOnRunning: false,
      retryAfter:     2e4,
      timeout:        6e5
    }
  }
});
```

## Usage

The basic usage requires you to execute the following simple command:

```
grunt circleci
```

If grunt is configured properly, you can use custom values for the commit hash, for instance:

```js
grunt.initConfig({
  circleci: {
    token:    'MySuperSecretTokenGeneratedOnCircleCI'
    username: 'VividCortex',
    project:  'grunt-circleci',
    commit:   grunt.option('commit')
  }
});
```

and run the command as:

```
grunt circleci --commit=TheHashOfTheCommit
```

### Getting the commit hash

[grunt-gitinfo](https://www.npmjs.org/package/grunt-gitinfo) is a very useful plugin for grunt that allows to fetch some information about your GIT repository. By using it, you will be able to check the status for the latest commit.

```js
grunt.initConfig({
  // ...
  gitinfo: {},

  circleci: {
    // ...
    // Use the commit hash
    commit:   '<%= gitinfo.local.branch.current.SHA %>'
  }  
});


// Get the repo information before checking the status
grunt.registerTask('check-build', ['gitinfo', 'circleci']);
```

And then, run the following command to check the status:

```
grunt check-build
```

## License
Copyright (c) 2014 VividCortex. Licensed under the MIT license.
