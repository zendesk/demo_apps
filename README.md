:warning: *Use of this software is subject to important terms and conditions as set forth in the License file* :warning:

## Zendesk Sample Apps

This repository provides you with sample Apps to help learn how to use the Zendesk Apps framework and APIs.

We hope you'll find those sample Apps useful and encourage you to re-use some of this code in your own Apps. If you have any questions please email support@zendesk.com or find us on [Twitter](https://twitter.com/zendeskdevteam). Please submit bug reports to [Zendesk](https://support.zendesk.com/requests/new). Pull requests are welcome.


### [Basic User Sample App](./basic_user_sample)

This app displays on the User Profile and pulls information from the currently opened user.

Interesting features:

* Use of the user location
* Zendesk-style tags and colors
* Zendesk user profile APIs

### [Zendesk REST API Sample App](./zendesk_rest_api_sample)

This app shows you how to utilize the Zendesk API from a Zendesk App. It uses the Apps API as an example.

Interesting features:

* Use of the Apps API (installations, creations, updates)
* Use of the Zendesk API from an App
* Zendesk REST API

### [Basic Ticket Sample App](./basic_ticket_sample)

This app presents info about the current ticket, agent and account.

Interesting features:

* Ajax requests and handling
* Zendesk-style menus
* Zendesk APIs

### [iFrame Sample App](./iframe_sample_app_zendesk_apps)

This app demonstrates how to iframe a webpage in an app.

Interesting features:

* iframe resizing
* Zendesk Apps locations

### [Modal Sample App](./modal_sample_app)

This app demonstrates how to toggle a modal via data attributes.

Interesting features:

* Location: ticket sidebar and new ticket sidebar.
* Use of I18n
* Use of the 'hidden' modal event
* Toggle modal via data attribute (data-toggle)
* Hide modal via data attribute (data-dismiss)

### [Interface API Sample](./interface_api_sample)

This app reads information from and controls the display of ticket fields.

Interesting features:

* Observer and event handler for changes to the ticket
* Change which interface elements are visible
* Manipulating ticket fields from within an app

### [Save Hook Sample App](./save_hook_sample)

This app demonstrates how to use save hook.

Interesting features:

* How to pass / reject submissions
* How to reject a submission with an error message
* How to use promise within save hook
* How to use AJAX within save hook
* Both of promise and AJAX can pass / reject submission after the job is done.

### [Advanced Modal Sample App](./modal_js_sample_app)

This Sample App demonstrates how to invoke a modal in JavaScript

Interesting features:

* location: ticket sidebar and new ticket sidebar
* show modal via javascript
* illustrate usage of modal specific event - show.
* print a message on modal.

### [Top Bar Sample App](./top_bar_sample_app)

This Sample App illustrates how to use the notify.json App API and popover() on top bar location Apps.

Interesting features:

* location: top_bar
* resize popover
* pane.activated

### [Settings Sample App](./settings_sample_app)

This Sample App shows how to use App settings, also called App parameters. These will be used to define user specific values in your Apps such as a subdomain, a token, a password or even user preferences.

Interesting features:

* Default values
* Existing settings.
* Update App settings via curl command.
