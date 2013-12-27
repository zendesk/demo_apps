(function() {

  return {
    events: {
      'app.activated':'showAppSettings'
    },

    showAppSettings: function(e) {
      this.switchTo('mainPage', {
        subdomain: this.setting('subdomain'),
        message: this.setting('mainBodyMessage'),
        hidden_message: this.setting('hiddenSetting'),
        email: this.currentUser().email(),
        uri: e.currentTarget.baseURI.split('/')[2], // extract the whole domain name url from the current base uri
        app_id: this.id()
      });

    }
  };

}());
