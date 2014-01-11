# Expert Sample App

This sample App comes packaging promises, save hook events, the new Zendesk's bootstrap page pagination element and progress bar element, jQuery, JavaScript asynchronous methods such as setInterval, simple use of the powerful Zendesk search API, as well as the Zendesk App Interface.

This App displayss a user all tickets that are open and assigned to himself/herself in pages. Also, the App helps to make sure that the comment body is not empty when a user tries to submit a ticket he/she is working on. A fake submission progress bar fires before the ticket is saved to show you how promises manage asynchronous methods.

A user can specify the number of tickets displayed per page in the App settings.

### The following information is displayed:

* A fake progress bar at ticket submission (use of promise, setInterval, and modal, I18n)
* Prevent a submission on the condition that the comment body is empty (use of promise, modal, I18n, comment interface)
* Display all ticket hyperlinks that are open and assigned to current user.
* Dispplay tickets in pages using the bootstrap pagination.
* Use App Setting
* Use App resources

Please submit bug reports to [Zendesk](support@zendesk.com). Pull requests are welcome.

### Note:

* jQuery version 1.7
* BootStrap 2.3
* underscore version 1.3.3

### Screenshot(s):
![Ticket View](http://cl.ly/image/0e2I0A0A3k3q)
![Save Hook](http://cl.ly/image/3q1H14130O1h)
