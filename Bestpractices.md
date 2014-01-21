## Zendesk Apps: Best Practices

#### [Read introduction before getting started](http://developer.zendesk.com/documentation/apps/introduction.html)

* Define CSS in `app.css`, instead of leaving them in the templates

* Put constants in an object (e.g. resource) like the following. 

```js
resources: {
  FOO: 123,
},

request: {
  // this will not work
  get: {
    url: 'http://example.com',
    data: this.resources.FOO 
  },
  
  // do this
  get: function() {
    return {
      url: 'http://example.com',
      data: this.resources.FOO
    };
  }
}
```

> You can then refer to it by calling `this.resources.FOO`.

**Note that this will fail if you try to get the content of `FOO` in a JSON object style request. Hence it is best to use function style request that will be covered later in this list.**
  

* Wrap a function around ajax request especially when you are going to be passing in some options with your AJAX call.

* Use services.notify() instead of console.log() if you are going to print some messages in string format.

* Use underscore helpers to process arrays, and objects.

* Use JSON.stringify() to dump your json data object into a string when only json format is accepted at the API end point.

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

* Use `firstLoad` property to check if the App is loaded first time. e.g.:

```js
'app.activated': function(data) {
  if(data.firstLoad) {
    // do something
  }
}
```

* Translate your settings parameters and add hint text.

* Use handlebars helpers, instead of a foreach loop in `app.js`: `{{#items}}<span>{{item}}</span>{{/items}}`

* However, you cannot use something like `{{#if 1 < 2}}` in your handlebars template, do pre-process the conditions in `app.js` `{ condition: 1 < 2 }` and do `{{#if condition}}` in the template

* Use bootstrap elements instead of defining your own styles in `app.css`.

* Make sure the helpers you are calling is properly supported. At the time this document is created, Zendesk Apps Framework supports `jQuery 1.7`, `Underscore 1.3.3` and `Handlebars 1.0.0 beta 5`.

* Do not try to create your own Handlebarsjs helper, it is not possible at this stage.

* Use jQuery style selector for DOM Traversal and Manipulation.

* Add `$` prefix to jQuery object variables, e.g.
```js
var $div = this.$('div');
```

* Use promises to handle asynchronous instructions.
