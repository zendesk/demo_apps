(function() {

  'use strict';

  var SUBDOMAIN_PATTERN = /\/\/([a-zA-Z0-9]*)\./; // Pattern for extracting subdomain
  return {
    events: {
      'pane.activated':'showAppSettings'
    },

    showAppSettings: function(e) {

      this.switchTo('mainPage', {
        settings: this.settings,
        email: this.currentUser().email(),
        uri: e.currentTarget.baseURI.split('/')[2], // extract the whole domain name url from the current base uri
        installation_id: this.installationId()
      });

      console.log(this.settings);
    }
  };

}());
