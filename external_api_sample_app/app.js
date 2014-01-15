(function() {

  return {

    defaultState: 'start_page',

    resources: {

    },

    requests: {
      fetchHeartyQuotes: function() {
        console.log('I am called');
        return {
          url: 'http://www.iheartquotes.com/api/v1/random?max_characters=140&source=macintosh+math+south_park+codehappy+starwars&format=json',
          type: 'GET',
          dataType: 'json'
        };
      }
    },

    events: {
      'click .get_no_auth': 'getNoAuth',
      'fetchHeartyQuotes.done': 'renderHeartyQuote',
      'fetchHeartyQuotes.fail': 'sayFail',
      'click .back_to_start': 'renderStartPage'
    },

    renderStartPage: function() {
      this.switchTo('start_page');
    },

    getNoAuth: function(event) {
      // Prevent what would normally happen when a user clicks
      event.preventDefault();
      this.ajax('fetchHeartyQuotes');
      this.switchTo('loading_screen');
    },

    renderHeartyQuote: function(data) {
      // Map tags array to tags object {tag: 'tag_content'}
      var tags = _.map(data.tags, function(tag){ return { tag: tag }; });
      console.log('do tags');
      console.log(tags);
      this.switchTo('quote_page', {
        tags: tags,
        quote: data.quote
      });
    }
  };

}());
