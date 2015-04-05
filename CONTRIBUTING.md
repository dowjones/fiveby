# Contributing

We love pull requests. Here's a quick guide.

Fork, then clone the repo:
```shell
    git clone https://github.com/your-username/fiveby.git
    cd fiveby
```
Install dependencies:
```shell
    npm install
    npm install -g gulp
```    
Make sure the tests pass (note coverage numbers):
```shell
    gulp test
```
Make your change. **Add tests for your change.** Make the tests pass and coverage >= previous:
```shell
    gulp test
```       
Have an issue running tests?
```shell
    gulp debug #run tests with no instrumentation which makes debugging tests MUCH easier
    gulp style #this will run just the "style" checks
```    
Here are the rules for jshint and jscs:

https://github.com/dowjones/fiveby/blob/master/.jshintrc

https://github.com/dowjones/fiveby/blob/master/.jscsrc

Push to your fork and [submit a pull request][pr].

[pr]: https://github.com/dowjones/fiveby/compare/

We usually respond to pull requests within two business days (and typically, one business day). 
We may suggest some changes, improvements, or alternatives.

If the above requirements are met and communications are clear (good comments, dialog, and [commit messages][commit]) your PR will likely be accepted.

[commit]: http://git-scm.com/book/en/v2/Distributed-Git-Contributing-to-a-Project#Commit-Guidelines
