(function() {

  var Util = require('utilities.js');

  return {
    // Please note that paths are relative from the ./lib directory
    events:   require('events.js'),
    requests: require('requests.js'),

    requestBookmarks: function() {
      console.log('CommonJS Sample app loaded');
      this.ajax('fetchBookmarks');
    },

    fetchBookmarksDone: function(data) {
      var message = Util.string.interpolate('%@ bookmark(s) loaded', data.count);
      console.log(message);
      console.log(data);
    }
  };

}());
