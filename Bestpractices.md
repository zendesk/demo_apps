## Introduction

All Zendesk Apps should follow a set of best practices. These best practices can help on various levels, and make it easier for you to ensure your App will not impact your Zendesk's performance or deteriorate the Agent's experience. Additionally, following these best practices will help you migrate framework versions much faster and smoother, breaking changes can potentially be avoided by following some of these guidelines.

All public Apps have to go through an approval process. This document is also aimed at helping you pass the approval process with flying colors from the first submission.

Whether you are building an App for your own company or for all of Zendesk customers we strongly encourage you to follow these guidelines and best practices.

If you aren't sure about any of the points below, if you have questions about the approval process or if you would like to receive guidance or help building your first Zendesk App, please feel free to get in touch at support@zendesk.com.

## Best Practices

* Use the [CDN framework version](https://developer.zendesk.com/apps/docs/developer-guide/using_sdk#getting-the-sdk).

* Use [Zendesk Garden](https://developer.zendesk.com/apps/docs/developer-guide/setup#using-zendesk-garden) from NPM.

* [Don't Repeat Yourself](https://en.wikipedia.org/wiki/Don't_repeat_yourself). Be critical of your own app, if you see that you've repeatedly done the same thing in your code then look to simplify by making helper functions that can be used in more than one place.

* Cleanup. Use life-cycle events `app.deactivated` and `app.willDestroy` to tidy up your app's state.  The intent for these events, and a general best practice, is to cleanup anything that your app might have set up that is no longer needed and might impact on performance of the product it is running in.  A prime candidate for cleanup would be intervals you've created via `setInterval` or `setTimeout`. App developers should always store a reference to an ID returned from either of the above methods so as to be able to call `clearInterval` or `clearTimeout`.

* Use promises to handle asynchronous instructions. See [JavaScript Promises: an Introduction](https://developers.google.com/web/fundamentals/getting-started/primers/promises) on Google's developer portal for a great introduction to JavaScript promises.

* Cache the result of promises and API requests when the data doesn't change often.

* Use [secure settings](https://developer.zendesk.com/apps/docs/apps-v2/using_sdk#using-secure-settings) for any sensitive setting, like API tokens and/or passwords.

* Use a [`domainWhitelist`](https://developer.zendesk.com/apps/docs/developer-guide/using_sdk#example) when using secure settings.

* Don't attempt to read secure settings, it won't work. Secure settings can only be used as placeholders that get replaced by the server.

* When making Ajax requests to the Zendesk API, avoid requesting all pages in a loop. If you must get all the data, make sure to add a delay between calls to avoid rate limiting.

* Check out our [changelog](https://developer.zendesk.com/apps/docs/apps-v2/changelog) frequently to keep up to date with the latest framework updates.

* Make sure you define an app version. An app version will help you, and anyone else using the app keep track of what is installed. This can be particularly helpful if a bug is found and you need to provide a newer version of an app.

* When [creating a ticket in telephony apps](https://support.zendesk.com/entries/24539263#topic_o32_xv1_sk), be sure that you're setting the via_id to 44 (voicemail), 45 (inbound call), or 46 (outbound call) depending on the type of call. This ensures that Zendesk admins and agents are able to properly report on these tickets within Zendesk.

* Prefer [bulk calls](https://developer.zendesk.com/apps/docs/apps-v2/using_sdk#bulk-calls) over single calls whenever possible.

* Specify `autoLoad: false` for locations where you don't need to display a user interface and use the `background` location with the Instances API to interact with those locations. This reduces the number of iframes that need to be created for your app, thus saving Memory and CPU. See [Instances API Sample App](https://github.com/zendesk/demo_apps/tree/master/v2/support/instances_sample_app) for an example of this technique.

* Use the [App Scaffold](https://github.com/zendesk/app_scaffold/tree/from-scratch)'s from-scratch branch when starting development of any non-trivial app. The App Scaffold includes many features to help you maintain and scale your app.

* Use [signed urls](https://developer.zendesk.com/apps/docs/apps-v2/using_sdk#authenticating-requests-with-signed-urls) to verify the request is legitimate when developing server-side apps.

* Clean up console.log and debugger statements before submitting your app.
