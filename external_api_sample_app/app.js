(function() {

  return {

    resources: {

    },

    requests: {

    },

    events: {
      'app.activated':'start'
    },

    start: function() {
      this.switchTo('start_page');
    }
  };

}());
