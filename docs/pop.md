#### How should I write tests?

##### 1. Use the Page Object Pattern

  > Within your web app's UI there are areas that your tests interact with. A Page Object simply models these as objects within the test code. This reduces the amount of duplicated code and means that if the UI changes, the fix need only be applied in one place.

  ```javascript
    module.exports = LoginPage;

    function LoginPage(browser){
      this.browser = browser;
      // Check that we're on the right page.
      if ("Login" !== browser.getTitle()) {
        // Alternatively, we could navigate to the login page, perhaps logging out first
        throw new IllegalStateException("This is not the login page");
      }
    }

    LoginPage.prototype.url = "";
    // The login page contains several HTML elements that will be represented as WebElements.
    // The locators for these elements should only be defined once.
    LoginPage.prototype.usernameLocator = by.css(".username");
    LoginPage.prototype.passwordLocator = by.css(".passwd");
    LoginPage.prototype.loginButtonLocator = by.css(".login");

    //methods - should return promises whenever possible to allow for chaining

    LoginPage.prototype.visit = function(){
      return this.browser.get(this.url);
    }

    // The login page allows the user to type their username into the username field
    LoginPage.prototype.typeUsername = function(username){
      // This is the only place that "knows" how to enter a username
      return this.browser.findElement(this.usernameLocator).sendKeys(username);
    }

    LoginPage.prototype.typePassword = function(password){
      return this.browser.findElement(this.passwordLocator).sendKeys(password);
    }

    LoginPage.prototype.submitLogin = function(){
      return this.browser.findElement(this.loginButtonLocator).click();
    }

    // Conceptually, the login page offers the user the service of being able to "log into"
    // the application using a user name and password.
    LoginPage.prototype.loginAs = function(username, password) {
      // The PageObject methods that enter username, password & submit login have already defined and should not be repeated here.
      this.typeUsername(username);
      this.typePassword(password);
      return this.submitLogin();
    }
  ```

  > Summary
  > - The public methods represent the services that the page offers
  > - Try not to expose the internals of the page
  > - Don't make assertions
  > - Methods return promises, possibly other page objects
  > - Need not represent an entire page


##### 2. CSS should be your default *location strategy*. If CSS is not working in a specific case, you should make your html simpler and more semantic. Selectors that are not css will be highly scrutinized in reviews.
