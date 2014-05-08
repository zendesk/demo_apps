(function() {

  return {
    // Please note that paths are relative from the ./lib directory
    events:   require('events.js'),
    requests: require('requests.js'),

    requestBookmarks: function() {
      console.log('CommonJS Sample app loaded');
      this.ajax('fetchBookmarks');
    },

    fetchBookmarksDone: function(data) {
      console.log('Loaded bookmarks!');
      console.log(data);
    }
  };

}());
