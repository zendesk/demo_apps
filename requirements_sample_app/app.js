(function() {

  return {
    events: {
      'app.activated': 'doSomething'
    },

    doSomething: function() {
      console.log('Doing something...');
    }
  };

}());
