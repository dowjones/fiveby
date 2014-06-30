I know what promises are but mine look terrible, is there a better way?

  Good practices for promises http://solutionoptimist.com/2013/12/27/javascript-promise-chains-2/

What is implicit wait and do my tests use it?

  Implicit wait is default 5 seconds in fiveby. This means that any time you do a findElement(s) the framework will automatically wait 5 seconds before failing. You can edit this in fiveby-config.json

Can I change the timeout on individual Mocha tests?

  Test timeout is 30 seconds, this is per "it". This can be edited via gulpfile.js

How can I check on the state of things while my tests run?

helpful to debug selectors (making sure you have what you think you have):

    ```javascript
    webElement.getInnerHtml().then(function (html) {
      console.info(html);
    });
    ```
    
if you want to debug the actual code just run 

    mocha debug *yourfile* //runs the cli debugger or
    mocha --debug *yourfile //runs the debugger on a port for attach

Can I run or exclude specific tests?    

    describe.only it.only describe.skip it.skip for excluding and including tests, see http://visionmedia.github.io/mocha/
  
Help, I keep getting NoSuchElementError 
  
  Make selectors very specific to avoid too many elements or NoSuchElementError (also use isElementPresent, isDisplayed). You should not run into NoSuchElement errors in the course of testing, only look up things you expect to find. You rarely perform negative testing in this space and if you do you look for elements (like a modal) that are telling the user they failed or are unauthorized.

My code is always changing how do I maintain multiple suite to match different versions of code:

  Branch for versions of tests that only will run against specific versions of code. Fiveby will be enhanced shortly to include environment variables (much like tesla property service)
