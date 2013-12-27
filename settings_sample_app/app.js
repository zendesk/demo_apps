(function() {

  return {
    events: {
      'app.activated':'doSomething'
    },

    doSomething: function() {
      this.switchTo('mainPage', {
        subdomain: this.setting('subdomain'),
        message: this.setting('mainBodyMessage'),
        hidden_message: this.setting('hiddenSetting'),
        email: this.currentUser().email(),
        uri: e.currentTarget.baseURI.split('/')[2],
        app_id: this.id()
      });

    }
  };

}());
