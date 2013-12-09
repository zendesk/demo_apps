(function(){

  return {
    defaultState: 'loading',

    requests: {
      fetchQuote: {
        url: 'http://www.iheartquotes.com/api/v1/random',
        type: 'GET',
        data: {
          format: 'json'
        }
      }
    },

    events: {
      'app.activated': 'init',
      'fetchQuote.done': 'showQuote',
      'fetchQuote.fail': 'fetchFail'
    },

    init: function() {
      this.requestQuote();
    },

    requestQuote: function() {
      this.ajax('fetchQuote');
    },

    showQuote: function(data) {
      /*
      * data
      * .json_class -> String
      * .tags       -> Array of String
      * .quote      -> String  (the quote)
      * .link       -> String  (url)
      * .source     -> String
      */
      this.switchTo('app', data);
    },

    fetchFail: function() {
      this.switchTo('fetch_fail');
    }

  };

}());