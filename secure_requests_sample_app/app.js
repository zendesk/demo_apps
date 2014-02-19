(function() {

  return {

    defaultState: 'loading',

    requests: {

      fetchInfo: {
          url: 'https://www.teachmyapi.com/api/{{setting.key}}/users',
          type: 'GET',
          dataType: 'json',
          secure: true
      }
    },

    events: {
      'app.activated'        :  'init',
      'click .btn'           :  'getInfo',
      'fetchInfo.done'       :  'renderInfo',
      'fetchInfo.fail'       :  'fail',
      'click .back_to_start' :  'renderStartPage'
    },

    init: function() {
      this.switchTo('start_page');
    },

    getInfo: function(event) {
      event.preventDefault();
      this.ajax('fetchInfo');
      this.switchTo('loading');
    },

    renderInfo: function(data) {
      var users = _.map(data, function(user){ user.friends = user.friends.join('; '); return { user: user };});
      var userPageObj = { users: users };
      this.switchTo('list', userPageObj);
    },

    fail: function(data) {
      services.notify(JSON.stringify(data));
      this.switchTo('start_page');
    },

    renderStartPage: function() {
      this.switchTo('start_page');
    }
  };

}());
