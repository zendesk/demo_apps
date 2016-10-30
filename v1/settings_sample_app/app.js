(function() {

  return {
    resources: {
      // Pattern for "subdomain.zendesk.com" extraction.
      PATTERN: /[a-zA-Z0-9]+\.[a-zA-Z0-9]+\.[a-zA-Z0-9]+/
    },

    events: {
      'pane.activated': 'showAppSettings'
    },

    showAppSettings: function(e) {
      this.switchTo('mainPage', {
        settings: this.settings, // An object that contains all the setting key-value pairs
        email: this.currentUser().email(),
        uri: this.getDomainFromURL(e.currentTarget.baseURI), // This gets the matched URL
        installation_id: this.installationId()
      });
    },

    getDomainFromURL: function(baseURI) {
      // Run regular expression to extract domain url
      var regexResult = this.resources.PATTERN.exec(baseURI);
      return regexResult[0];
    }
  };
}());
