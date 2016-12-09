(function() {

  return {
    events: {
      'app.created': 'doSomething'
    },

    doSomething: function() {
      console.log('Doing something...');
    }
  };

}());
