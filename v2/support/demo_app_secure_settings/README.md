# Test Secure Setting Feature

A simple app that creates two secure settings and calls a remote web page with those settings.

### Steps

1. Download repository
2. Run 'zat package' in app directory
3. Install the app package from Admin/Apps > Manage > Upload private app
 * There are default values for 'token' and 'subdomain' -- feel free to change them. For demo purposes, keep them 5 characters or less.
4. Because it's a ticket_sidebar app, bring up a ticket and click app's 'Call Remote Server' 

You should see your the values you entered for 'token' and 'subdomain' appear in the app window.

### Notes

* If you go to the app's settings page (under Admin/Apps > Manage > {app name} > Change settings [from dropdown] > App configuration tab), you will see that the secure settings originally entered do not appear.
  This is because once secure setting values are entered, they are not redisplayed. This is for security reasons.

* The remote server used is https://httpbin.org, which reflects the response of what was passed on the request. The site does a bunch of other things, too, so check it out.

* For your own remote server, include the subdomain in the domainWhitelist value of your manifest.json


## References
* [Using Secure Settings](https://developer.zendesk.com/apps/docs/developer-guide/using_sdk#using-secure-settings)
