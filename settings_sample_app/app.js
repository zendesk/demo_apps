(function() {

  return {
    events: {
      'app.activated':'doSomething'
    },

    doSomething: function() {
      this.switchTo('mainPage', {
        message: this.setting('mainBodyMessage')
      });

    }
  };

}());
