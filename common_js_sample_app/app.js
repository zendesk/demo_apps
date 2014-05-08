(function() {

  return {
    events:   require('events.js'),  // Please note that paths are relative from the ./lib directory
    requests: require('requests.js'),

    doSomething: function() {
      console.log('I LOADED!!');
    }
  };

}());
