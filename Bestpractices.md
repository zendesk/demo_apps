## Introduction

All Zendesk Apps should follow a set of best practices. These best practices can help on various levels, and make it easier for you to ensure your App will not impact your Zendesk's performance or deteriorate the Agent's experience. Additionally, following these best practices will help you migrate framework versions much faster and smoother, breaking changes can potentially be avoided by following some of these guidelines.

All public Apps have to go through an approval process. This document is also aimed at helping you pass the approval process with flying colors from the first submission.

Whether you are building an App for your own company or for all of Zendesk customers we strongly encourage you to follow these guidelines and best practices.

If you aren't sure about any of the points below, if you have questions about the approval process or if you would like to receive guidance or help building your first Zendesk App, please feel free to get in touch at support@zendesk.com.

## Zendesk Apps: Must avoid

:no_entry: In this section you'll find practices you absolutely need to avoid if you want your App to pass the approval process :no_entry:

* Do not try to create your own [Handlebars helper](http://handlebarsjs.com/), it is not possible at this stage.

* Do not use an out-dated framework version

* Do not declare a function outside the main returned object, ever.

```js
(function() {
  var FooClass = function() {}; // Never do this 
  FooClass.bar = function() {}; // Or this
  
  var foobar = "raboof";  // This is fine

  return {
  };
}());
```

* Never try to access the `window` object that may interfere with the new Zendesk or other Apps (even via an external library)

* Never load any external libraries using AJAX, for example:

```
  this.ajax('getScript', 'mylibrary.js'),
```


## Zendesk Apps: Best Practices

* Make sure you define an App version. An App version will help you, and anyone else using the App keep track of what is installed. This can be particularly helpful if a bug is found and you need to provide a newer version of an App.

* Define CSS in `app.css`, instead of leaving them in the templates.

* Identify your page elements by class rather than by ID. Zendesk will replace your IDs, so if they are referenced in `app.js` they won't work. Giving elements unique classes is a workaround.

* Wrap a function around AJAX request especially when you are going to be passing in some options with your AJAX call.

* Display a spinner while your app is waiting for something, e.g. an AJAX call

* Clean up console.log and debugger statements before submitting your App.

* Use Underscore helpers to process `Arrays`, and `Objects`. App developers deal with a huge amount of work involving `Array` and `Object` processing. Underscore is a utility library that simplifies common operations you might perform on either an `Array` or an `Object`. A good example might be `_.map`, `_.filter`, `_.each` or `_.find`.

* When sending `POST` / `PUT` requests Use `JSON.stringify()` to dump your json data object into a string when only json format is accepted at the API end point.

> Instead of

```js
this.ajax('sampleRequest', requestData)
  .done(function(data) {
    // render the JSON data
  });
```
> try to break it down to listen to `sampleRequest.done` event.

```js

events: {
  'sampleRequest.done': 'renderJSONData'
},

renderJSONData: function(data) {
  // render the JSON data
}
```

> Now we can just simply call `this.ajax('sampleRequest', requestData);`

* Use app.created to check if the App is loaded for the first time. e.g.:

```js
'app.created': function(data) {
  // do something
}
```

* Use handlebars helpers instead of a `forEach` loop in `app.js`: `{{#each items}}<span>{{item}}</span>{{/items}}`.

* However, you cannot use something like `{{#if 1 < 2}}` in your Handlebars template. Pre-process the conditions in `app.js`: `this.switchTo('myTemplate', { condition: 1 < 2 })` and put `{{#if condition}}` in the template.

* Use Bootstrap elements instead of defining your own styles in `app.css`.

* Make sure the helpers you are calling are properly supported. At the time this document is created, Zendesk Apps Framework supports `jQuery 1.10.2`, `Underscore 1.3.3` and `Handlebars 1.0.0 beta 6`. Supported libraries are documented [here](http://developer.zendesk.com/documentation/apps/reference/supported_libraries.html).

* Use jQuery style selector for DOM Traversal and Manipulation.

* Add `$` prefix to jQuery object variables, e.g:

```js
var $div = this.$('div');
```

* Use promises to handle asynchronous instructions.

* Be careful when defining an object in the main returned object: they are shared across instances of the app, so can lead to unexpected behavior when misused. Below is an example:

```js
  return {
    foo: {}, // This will be shared across all instances of this App.

    appActivated: function() {
      this.bar = {}; // This will not.
    }
  }
```

* When [creating a ticket in telephony apps](https://support.zendesk.com/entries/24539263#topic_o32_xv1_sk), be sure that you're setting the via_id to 44 (voicemail), 45 (inbound call), or 46 (outbound call) depending on the type of call. This ensures that Zendesk admins and agents are able to properly report on these tickets within Zendesk.

* Cleanup. We have life-cycle events for App deactivation and removal, `app.deactivate` and `app.willDestroy` respectively.  The intent for these events, and a general best practice, is to cleanup anything that your App might have set up that is no longer needed and might impact on performance of Lotus/other Apps.  A prime candidate for cleanup would be intervals you've created via `setInterval` or `setTimeout` (worth noting that App Developers should always store a reference to an ID returned from either of the above methods so as to be able to call `clearInterval` or `clearTimeout`.

* DRY. Be critical of your own App, if you see that you've repeatedly done the same thing in your code then look to simplify by making helper functions that can be used in more than one place.
