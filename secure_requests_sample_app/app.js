(function() {

  return {

    requests: {
      getFrom: {
        url: 'https://www.teachmyapi.com/api/{{setting.key}}/users',
        type: 'GET',
        dataType: 'json',
        secure: true,
        headers: {
          'X-Setting': '{{setting.key}}'
        }
      },

      postTo: {
        url: 'http://{{setting.subdomain}}.herokuapp.com/200/OK/',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({a: '{{setting.new_data}}'}),
        secure: true
      }
    },

    events: {
      'app.activated'        : 'init',
      'click .fetch'         : 'getInfo',
      'getFrom.done'         : 'renderInfo',
      'getFrom.fail'         : 'fail',
      'click .back_to_start' : 'renderStartPage',
      'click .post'          : 'postInfo',
      'postTo.fail'          : 'fail',
      'postTo.done'          : 'render'
    },

    init: function() {
      this.switchTo('start_page');
    },

    getInfo: function(event) {
      event.preventDefault();
      this.ajax('getFrom');
      this.switchTo('loading');
    },

    renderInfo: function(data) {
      var users = _.map(data, function(user){
        user.friends = user.friends.join('; ');
        return { user: user };
      });
      var userPageObj = { users: users };
      this.switchTo('list', userPageObj);
    },

    postInfo: function(event) {
      event.preventDefault();
      this.ajax('postTo');
      this.switchTo('loading');
    },

    render: function(data) {
      this.switchTo('success', data);
      console.log(data);
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
