(function() {

  return {
    events: {
      'app.created': 'sayHello'
    },

    sayHello: function() {
      var currentUser = this.currentUser().name();
      this.switchTo('hello', {
        username: currentUser
      });
    }

  };

}());
