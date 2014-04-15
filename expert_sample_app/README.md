:warning: *Use of this software is subject to important terms and conditions as set forth in the License file* :warning:

# Expert Sample App

This sample App implements promises, save hooks, bootstrap pagination and progress bar element, jQuery selectors, JavaScript asynchronous methods such as setInterval, simple use of the powerful Zendesk search API, as well as the Zendesk App Interface.

This App displays to a user all tickets that are open and assigned to himself/herself in pages. Also, the App helps to make sure that the comment body is not empty when a user tries to submit a ticket he/she is working on. A fake submission progress bar fires before the ticket is saved to show a user how promises manage asynchronous methods.

A user can specify the number of tickets displayed per page in the App settings.

### The following information is displayed:

* A fake progress bar at ticket submission (use of promise, setInterval, and modal, I18n)
* Prevent a submission on the condition that the comment body is empty (use of promise, modal, I18n, comment interface)
* Display all ticket hyperlinks that are open and assigned to current user.
* Display tickets in pages using the bootstrap pagination.
* Use App Setting
* Use App resources
* Use scss style in app.css

Please submit bug reports to [Zendesk](support@zendesk.com). Pull requests are welcome.

### Note:

* jQuery version 1.7
* BootStrap 2.3
* underscore version 1.3.3

### Screenshot(s):
[Ticket View](http://cl.ly/image/0L0n2N0E2r44)

[Save Hook](http://cl.ly/image/3q1H14130O1h)
