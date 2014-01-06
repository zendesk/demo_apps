(function() {

  'use strict'; // Convert mistakes into errors, securing javascript.

  // Pattern for subdomain.zendesk.com extraction.
  var SUBDOMAIN_PATTERN = /[a-zA-Z0-9]+\.[a-zA-Z0-9]+\.[a-zA-Z0-9]+/;

  return {
    events: {
      'pane.activated': 'showAppSettings'
    },

    showAppSettings: function(e) {
      // Run regular expression to extract subdomain url
      var regexResult = SUBDOMAIN_PATTERN.exec(e.currentTarget.baseURI);

      this.switchTo('mainPage', {
        settings: this.settings,
        email: this.currentUser().email(),
        uri: regexResult[0], // This gets the matched URL
        installation_id: this.installationId()
      });
    }
  };

}());
