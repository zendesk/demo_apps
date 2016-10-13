(function() {

  // Hook reference: http://developer.zendesk.com/documentation/apps/reference/hooks.html

  return {

    defaultState: 'showCase',

    requests: {
      heartQuote: {
        url: 'http://iheartquotes.com/api/v1/random',
        data: {
          format: 'json'
        }
      }
    },

    events: {

      'app.activated': 'init',
      'ticket.save':   'hookHandler',

      // Switch to different hook handlers
      'click .simple_pass':  'useSimplePass',  // pass
      'click .simple_fail':  'useSimpleFail',  // fail
      'click .string_fail':  'useStringFail',  // fail with an error message
      'click .delayed_pass': 'useDelayedPass', // pass 3s after clicking submit
      'click .delayed_fail': 'useDelayedFail', // fail 3s after clicking submit
      'click .ajax_pass':    'useAjaxPass',    // pass after getting a quote through ajax
      'click .ajax_fail':    'useAjaxFail'     // fail after getting a quote through ajax

    },

    init: function() {
      this.currentHandler = this.useSimplePass;
    },

    hookHandler: function() {
      return this.currentHandler();
    },

    // Switches that control which handler is used to handle `ticket.save`

    useSimplePass: function(e) {
      this.currentHandler = this.simplePass;
      console.log('Using simple pass');
      this.toggleActive(e);
    },

    useSimpleFail: function(e) {
      this.currentHandler = this.simpleFail;
      console.log('Using simple fail');
      this.toggleActive(e);
    },

    useStringFail: function(e) {
      this.currentHandler = this.stringFail;
      console.log('Using string fail');
      this.toggleActive(e);
    },

    useDelayedPass: function(e) {
      this.currentHandler = this.delayedPass;
      console.log('Using delayed pass');
      this.toggleActive(e);
    },

    useDelayedFail: function(e) {
      this.currentHandler = this.delayedFail;
      console.log('Using delayed fail');
      this.toggleActive(e);
    },

    useAjaxPass: function(e) {
      this.currentHandler = this.ajaxPass;
      console.log('Using ajax pass');
      this.toggleActive(e);
    },

    useAjaxFail: function(e) {
      this.currentHandler = this.ajaxFail;
      console.log('Using ajax fail');
      this.toggleActive(e);
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
    },

    ajaxPass: function() {
      return this.promise(function(done, fail) {
        this.ajax('heartQuote').then(
          function(data) {
            console.log(data.quote);
            done();
          },
          function() {
            console.log('ajax failed, but ticket.save shall pass');
            done();
          }
        );
      });
    },

    ajaxFail: function() {
      return this.promise(function(done, fail) {
        this.ajax('heartQuote').then(
          function(data) {
            console.log(data.quote);
            fail();
          },
          function() {
            console.log('ajax failed, ticket.save shall fail anyway');
            fail();
          }
        );
      });
    },

    toggleActive: function(e) {
      this.$('.btn').removeClass('active');
      this.$(e.currentTarget).addClass('active');
    }

  };

}());
