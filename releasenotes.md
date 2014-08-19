Version 0.8.0
-----------------

- fiveby hooks run at the appropriate time
- no more "prepping tests"
- file names in reporters are now correct
- no more global "semaphore", simpler chain of promises
- no more default config, error message instead
- single control flow


Version 0.7.0
-----------------

- introduction of [properties](/docs/properties.md)

Version 0.6.5
-----------------

- compensating for mocha bug with filenames

Version 0.6.4
-----------------

- bug fixes
- improved docs

Version 0.6.2/0.6.3
-----------------

- slightly improved error handling, working on it

Version 0.6.1
-----------------

- reluctantly giving up on single process parallel testing, mocha and selenium only play nice if the drivers are created within the tests. Will take a stab in future again.. or try Jasmine, or multiprocess
- surfacing webdriver.promise as promise globally
- local and global config are now merged
- added selenium server back and now all requests are routed through it (before chrome was not)
- bug fixes


Version 0.6.0
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

Version 0.5.0
-----------------

- first draft
