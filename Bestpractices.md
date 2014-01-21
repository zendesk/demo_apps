:warning: *Use of this software is subject to important terms and conditions as set forth in the License file* :warning:

## Zendesk Apps: Best Practices

* Move CSS styles to app.css
* Put constants in the resources property. e.g.: add FOO: 'bar' to `resources`, can you can refer to it by calling `this.resources.FOO`.
  Note that this will fail if you try to get the content of `FOO` in a JSON object style request. Hence it is best to use function style request that will be covered later in this list.
* Wrap a function around ajax request especially when you are going to be passing in some options with your AJAX call.
* Use services.notify() instead of console.log() if you are going to print some messages in string format.
* Use underscore helpers to process arrays, and objects.
* Use JSON.stringify() to parse your json data object to an json message string when only json format is accepted at the API end point.
* Instead of `this.ajax('sampleRequest', requestData)
                  .done(function(data) {
                    // render the JSON data
                  });`
  try to break it down to listen to `sampleRequest.done` event. e.g.:
  In `events`, add `'sampleRequest.done': 'renderJSONData'`.
  Then create a helper `renderJSONData: function(data) {
                          // render the JSON data
                        }`
  Now we can just simply call `this.ajax('sampleRequest', requestData);`
* Use `firstLoad` property to check if the app is loaded first time. e.g.:
  `'app.activated': function(data) {
    if(data.firstLoad) {
      // do something
    }
  }`
* Translate your settings parameters and add hint text.
* Use handlebars helpers `{{#items}}<span>{{item}}</span>{{/item}}`, instead of a foreach loop in app.js
* Use bootstrap elements instead of defining your own styles in app.css.
* Apply I18n when necessary.
* Make sure the helpers you are calling is properly supported. At the time this document is created, Zendesk Apps Framework supports jQuery 1.7, Underscore 1.3.3 and Handlebars 1.0.0 beta 5.
* Do not try to create your own Handlebarsjs, it is not possible at this stage.
* Use jQuery style selector for DOM Traversal and Manipulation.
* Add `$` prefix to jQuery objects
* Use promises to handle asynchronous instructions.
