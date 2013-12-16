(function(){

  return {
    defaultState: 'loading',

    requests: {
      fetchQuote: {
        url: 'http://www.iheartquotes.com/api/v1/random',
        type: 'GET',
        /**
         * GET (actually all methods) parameters should be here
         * instead of hard coded in the url
         *
         * For http://forexample.com/path?format=json&blah=foo
         * you should do the following:
         *
         * data: {
         *   format: 'json',
         *   blah: 'foo'
         * }
         */
        data: {
          format: 'json'
        }
      }
    },

    events: {
      'app.activated': 'init',
      'fetchQuote.done': 'showQuote',
      'fetchQuote.fail': 'fetchFail',
      'click #refresh': 'refresh'
    },

    init: function() {
      this.requestQuote();
    },

    refresh: function() {
      this.$("#refresh").text("Wait...").attr("disabled", true);
      this.init();
    },

    requestQuote: function() {
      this.ajax('fetchQuote');
    },

    showQuote: function(data) {
      /**
       * data
       * .json_class -> String
       * .tags       -> Array of String
       * .quote      -> String  (the quote)
       * .link       -> String  (url)
       * .source     -> String
       */
      this.switchTo('app', data);
      this.$("#refresh").text("Get Another").attr("disabled", false);
    },

    fetchFail: function() {
      this.switchTo('fetch_fail');
    }

  };

}());