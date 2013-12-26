(function() {

  return {

    defaultState: 'showCase',

    events: {

      'app.activated': 'init',
      'ticket.save': 'hookHandler',

      // Switch to different hook handlers
      'click .simplePass': 'useSimplePass',
      'click .simpleFail': 'useSimpleFail',
      'click .stringFail': 'useStringFail',
      'click .delayedPass': 'useDelayedPass',
      'click .delayedFail': 'useDelayedFail'

    },

    init: function() {
      this.currentHandler = this.useSimplePass;
    },

    hookHandler: function() {
      return this.currentHandler();
    },

    // Switches

    useSimplePass: function() {
      this.currentHandler = this.simplePass;
      console.log('Using simple pass');
    },

    useSimpleFail: function() {
      this.currentHandler = this.simpleFail;
      console.log('Using simple fail');
    },

    useStringFail: function() {
      this.currentHandler = this.stringFail;
      console.log('Using string fail');
    },

    useDelayedPass: function() {
      this.currentHandler = this.delayedPass;
      console.log('Using delayed pass');
    },

    useDelayedFail: function() {
      this.currentHandler = this.delayedFail;
      console.log('Using delayed fail');
    },

    // Handles

    simplePass: function() {
      return true;
    },

    simpleFail: function() {
      return false;
    },

    stringFail: function() {
      return this.I18n.t('fail_string');
    },

    delayedPass: function() {
      return this.promise(function(done, fail) {
        setTimeout(function() {
          done();
        }, 3000);
      });
    },

    delayedFail: function() {
      return this.promise(function(done, fail) {
        setTimeout(function() {
          fail();
        }, 3000);
      });
    }

  };

}());
