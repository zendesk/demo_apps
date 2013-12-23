(function() {

  var SIDE_BAR_HREF = "http://www.wikipedia.com",
      NAV_BAR_HREF = "http://developer.zendesk.com/documentation/apps/introduction.html",
      SIDE_BAR_REGEX = /_sidebar$/;

  return {
    events: {
      'app.activated': 'init',
      'pane.activated': 'paneActivated'
    },

    init: function(data){ //load content if app is at new_ticket_sidebar, ticket_sidebar and user_sidebar
      if (data.firstLoad && SIDE_BAR_REGEX.test(this.currentLocation())) {
        this.showIframe({ width: '300px', height: '260px' }, SIDE_BAR_HREF);
      }
    },

    paneActivated: function(data) { //load content if app is at top_bar and nav_bar
      if (data.firstLoad) {
        this.showIframe({ width: '1024px', height: '500px' }, NAV_BAR_HREF);
      }
    },

    showIframe: function(dimensions, href) {
      this.switchTo('iframePage', {
        dimension: dimensions,
        href: href
      });
    }
  };
}());
