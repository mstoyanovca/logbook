- Scala 2.12, sbt, ScalaTest, Play, Slick
- Node.js 12.13.0, npm, Angular CLI, Angular 8, TypeScript 3.7, Bootsrtap, Jasmine

Run configuration in dev mode:
-Xms512M
-Xmx1024M
-Xss1M
-XX:+CMSClassUnloadingEnabled
-XX:MaxPermSize=256M
-Dlogger.resource=logback-dev.xml

TODOs:
- add an edit QSO modal in the logbook component
- add tests
- deploy to AWS
- implement a service to email a password reset link with a token from the AWS account 
- implement a guarded by the AuthenticationAction route to validate the token, and open a new password form
