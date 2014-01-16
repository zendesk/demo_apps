(function() {

  return {

    defaultState: 'start_page',

    resources: {
      USERNAME: 'myuser@example.com',
      PASSWORD: 'notasecret',
      END_POINT: 'https://www.teachmyapi.com/api/d8ed54064bd8c00918d62316c3ede108'
    },

    requests: {
      fetchHeartyQuotes: { // This is a simple object style.
          url: 'http://www.iheartquotes.com/api/v1/random?max_characters=140&source=macintosh+math+south_park+codehappy+starwars&format=json',
          type: 'GET',
          dataType: 'json'
      },

      fetchTeachMyAPIUsers: function() { // This is a function style. It is necessary to use this style when you have to access this.resources or you want to pass parameters to this.ajax().
        return {
          url: helpers.fmt('%@/users', this.resources.END_POINT),
          type: 'GET',
          dataType: 'json',
          username: this.resources.USERNAME,
          password: this.resources.PASSWORD
        };
      }
    },

    events: {
      'click .get_no_auth': 'getNoAuth',
      'click .get_with_auth': 'getWithAuth',
      'fetchHeartyQuotes.done': 'renderHeartyQuote',
      'fetchTeachMyAPIUsers.done': 'renderUserList',
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

    getWithAuth: function() {
      this.ajax('fetchTeachMyAPIUsers');
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
    },

    renderUserList: function(data) {
      var users = _.map(data, function(user){ user.friends = user.friends.join(' '); return { user: user };});
      this.switchTo('user_list', { users: users });
    }
  };

}());
