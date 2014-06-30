#### Things to consider about your application before testing:

1. Performance, if you applications performance is inconsitant your tests will be brittle or long running. You will either set short timeout and fail often, or set long timeouts and take forever. This is not a problem with Automated testing, if your experience is that inconsistant it's going to be a problem with your customers!
2. Be able to setup and teardown everything related to a test programically. You should have apis to create and delete users as well as populate/delete user data in bulk. These will make tests faster and more stable. They will also be more reliable as the state is pristine and therefore 100% known.
3. ARM limits! Most institutional transactions have limits to prevent a single user from damaging the experience of others by hogging the system resources. Your testing WILL trigger these limits. Plan accordingly 
