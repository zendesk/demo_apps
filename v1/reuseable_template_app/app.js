(function() {

  return {
    events: {
      'app.created': 'greet',
      'click a': 'handleButton'
    },

    greet: function(type) {
      if (typeof type != 'string') {
        type = 'hello';
      }
      var currentUser = this.currentUser().name();
      var boilerPlate = this.renderTemplate('boilerplate', { username: currentUser });
      this.switchTo(type, {
        heading: boilerPlate
      });
    },

    handleButton: function(e) {
      var nextType = e.target.classList[0];
      this.greet(nextType);
    }

  };

}());
