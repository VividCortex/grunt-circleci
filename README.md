# grunt-circleci


This plugin allows to check the status of a CircleCI build associated to a commit. Useful for apps the need to check for a successful status before running a critical task, like the deploy.


## Getting started

First, you need to add the dependency and install it into your project.

```js
npm install grunt-circleci --save-dev
```


Once intalled, it can be loaded in your _Gruntfile_ with the follwing line:
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

* __branch:__ The branch to filter builds by. _Default:_ `master`
* __retryOnRunning:__ Whether the check should retry or not if the build is currently running. _Default:_ `false`
* __retryAfter:__ The time in milliseconds the check should wait to retry if _retryOnRunning_ is enabled. _Default:_ `20000` (20 seconds)
* __timeout:__ The time in milliseconds the check should fail if the build is still running and _retryOnRunning_ is enabled. _Default:_ `600000` (10 minutes)

#### Full example

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

## License
Copyright (c) 2014 VividCortex. Licensed under the MIT license.
