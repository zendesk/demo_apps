(function() {
  return {

    events: {
      'app.activated': 'appActivated'
    },

    appActivated: function(data) {
      this.switchTo('iframe', {
        url: "https://your-auth-page"
      });
    }

  };

}());
