#### Things to consider about your application before testing:

1. **Performance.** If your application's performance is inconsistent, your tests will be brittle or long running. You will either set short timeouts and fail often, or set long timeouts and take forever. This is not a problem with Automated Testing. If your experience is that inconsistent, it's going to be a problem with your customers!
2. **Setup / Teardown.** You should be able to programmatically set up and tear down everything related to a test. You should have APIs to create and delete users as well as populate and delete user data in bulk. These will make tests faster and more stable. They will also be more reliable as the state is pristine and therefore 100% known.
3. **ARM limits!** Most institutional transactions have limits to prevent a single user from damaging the experience of others by hogging the system resources. Your testing WILL trigger these limits. Plan accordingly.
