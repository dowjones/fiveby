Version 1.0.0
-----------------

- removed dependency on tesla.lib.cache
- major doc overhaul
- updated versions

Version 0.9.1 - *Staedt'd*
-----------------

- environment properties are now merged into file properties as you would expect, previously XOR

Version 0.9.0 - *Dacosta'd*
-----------------

- fiveby now has a disableBrowsers option that will disable selenium completely and remove the need for browser config. This is for folks that have no need of browsers but love fiveby
- the presence of the browser argument in the fiveby callback will determine if a browser is spawn regardless of the disableBrowsers flag. This feature is for those that want to mix browser and non-browser testing in the same project
- lots more unit tests and CI goodness
- index split into index and lib/fiveby
- upgraded to selenium 2.44.0
- small bug fixes

Version 0.8.0 - *Daypartying*
-----------------

- fiveby hooks run at the appropriate time
- no more "prepping tests"
- file names in reporters are now correct
- no more global "semaphore", simpler chain of promises
- no more default config, error message instead
- single control flow
- webdriver.error now accessible as bot
- better error handling

Version 0.7.1 - *Italiano'd*
-----------------

- extensions are now disabled for the chrome browser

Version 0.7.0 - *Nemtsov'd*
-----------------

- introduction of [properties](/docs/properties.md)

Version 0.6.5 - *Gruber'd*
-----------------

- compensating for mocha bug with filenames

Version 0.6.4 - *Derp*
-----------------

- bug fixes
- improved docs

Version 0.6.2/0.6.3 - *Blunders*
-----------------

- slightly improved error handling, working on it

Version 0.6.1 - *Threads*
-----------------

- reluctantly giving up on single process parallel testing, mocha and selenium only play nice if the drivers are created within the tests. Will take a stab in future again.. or try Jasmine, or multiprocess
- surfacing webdriver.promise as promise globally
- local and global config are now merged
- added selenium server back and now all requests are routed through it (before chrome was not)
- bug fixes


Version 0.6.0 - *Flip-Flop*
-----------------

- added ability to use any selenium supported browser
- added global config file (fiveby-config.json)
- browser is closed automatically, tests no longer need to do this
- developers need to return the suite/describe to fiveby, see README.md
- simplified API, just pass your test suite to a new fiveby instance, also see README.md
- better error handling
- significantly improved performance and error handling, especially with selenium grid
- better logging / test output
- java / selenium jar no longer default. Easier to just setup chrome/phantom/ie driver stand alone. If ff is really required use hubUrl to point to local server.

Version 0.5.0 - *Crucible*
-----------------

- first draft
