(function() {

  return {
    events: {
      'app.activated':    'sayHello'
    },

    sayHello: function(){
      var currentUser = this.currentUser().name();
      this.switchTo('hello',
        {
          sayUsername: currentUser
        });
    },

  };

}());
