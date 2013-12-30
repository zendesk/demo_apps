:warning: *Use of this software is subject to important terms and conditions as set forth in the License file* :warning:

# Save Hook Sample App

Hooks are a special kind of event that you can create event handlers for in your app. Different to other kinds of events, Hooks give the ability to respond to the event from within your handler in a way that can affect the outcome of the action that triggered the event. e.g. you can reject a submission if a particular field of the ticket is not specified

This app renders in the `ticket_sidebar` and `new_ticket_sidebar` and shows how you can use the `ticket.save` save hook.

[The hook reference page](http://developer.zendesk.com/documentation/apps/reference/hooks.html)

### The following information is displayed:

#### How to

* simply accept/reject a ticket submission
* reject a ticket submission with an error message
* accept/reject a ticket submission with a delay, using promise
* accept/reject a ticket submission after doing an ajax request

Please submit bug reports to [Zendesk](https://support.zendesk.com/requests/new). Pull requests are welcome.

### Screenshot(s):
![Screen shot](https://f.cloud.github.com/assets/1329716/1820485/57a3cfe8-70ec-11e3-9695-ec2e4cb9d4c1.png)
