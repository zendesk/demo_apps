(function(){

  return {
    defaultState: 'loading',

    requests: {
      fetchSentence: {
        url: 'http://www.iheartquotes.com/api/v1/random',
        type: 'GET',
        data: {
          format: 'json'
        }
      }
    },

    events: {
      'app.activated': 'init',
      'fetchSentence.done': 'showSentence',
      'fetchSentence.fail': 'fetchFail'
    },

    init: function() {
      this.requestSentence();
    },

    requestSentence: function() {
      this.ajax('fetchSentence');
    },

    showSentence: function(data) {
      this.switchTo('app', { quote: data.quote });
    },

    fetchFail: function() {
      this.switchTo('fetch_fail');
    }

  };

}());