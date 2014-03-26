:warning: *Use of this software is subject to important terms and conditions as set forth in the License file* :warning:

## Zendesk Sample Apps

This repository provides you with sample Apps to help learn how to use the Zendesk Apps framework and APIs.

We hope you'll find those sample Apps useful and encourage you to re-use some of this code in your own Apps. If you have any questions please email support@zendesk.com or find us on [Twitter](https://twitter.com/zendeskdevteam). Please submit bug reports to [Zendesk](https://support.zendesk.com/requests/new). Pull requests are welcome.

### [Hello World Sample App](./hello_world_sample_app)

The simplest App ever built! Aimed for demonstration or training purposes this very basic Hello World App will show you in a couple of minutes how is our framework built and works.

Interesting features:

* Prints the current logged in agent name on a template

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


### [External REST API Sample App](./external_api_sample_app)

This sample app shows to the developers how to make external API requests in App by taking iheartquotes.com/api and teachmyapi.com as examples.

You will need to register an account on teachmyapi.com for your API URL, username and password that are needed when installing this App.

You can also checkout our [Zendesk REST API Sample App](./zendesk_rest_api_sample).

Interesting features:

* Make external API request to iheartquotes (GET only; no Auth).
* Make external API request to teachmyapi.com (GET, POST, PUT; Simple HTTP authentication).
* Demonstrate how to use settings.
* Demonstrate how to use bootstrap modal.
* Demonstrate how to use services.notify() App API
* Zendesk translation format.

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
* pane.activated event

### [Settings Sample App](./settings_sample_app)

This Sample App shows how to use App settings, also called App parameters. These will be used to define user specific values in your Apps such as a subdomain, a token, a password or even user preferences.

Interesting features:

* Default values
* Existing settings.
* Update App settings via curl command.

### [Expert Sample App](./expert_sample_app)

This App contains overall most features available in the Zendesk Apps framework. It's more complex and is more geared towards helping an experienced Javascript engineer understand Zendesk Apps. If you're just beginning make sure to check out our other sample Apps before diving into this one!

This App displays to a user all tickets that are open and assigned to himself/herself in pages. Also, the App helps to make sure that the comment body is not empty when a user tries to submit a ticket he/she is working on. A fake submission progress bar fires before the ticket is saved to show a user how promises manage asynchronous methods.

Interesting features:

* A fake progress bar at ticket submission (use of promise, setInterval, and modal, I18n)
* Prevent a submission on the condition that the comment body is empty (use of promise, modal, I18n, comment interface)
* Display all ticket hyperlinks that are open and assigned to current user.
* Display tickets in pages using the bootstrap pagination.
* Use App Setting
* Use App resources
* Use scss style in app.css
