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
