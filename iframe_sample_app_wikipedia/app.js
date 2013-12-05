(function() {
  return {
    events: {
      'app.activated':'displayWikipedia'
    },

    displayWikipedia: function() {
      this.page = {href : "http://en.wikipedia.org/wiki/Zendesk"};
      this.switchTo('iframePage', {
    page:            this.page,
  });
    }
  };

}());
