(function() {
  return {
    events: {
      'app.activated':'init',
      'click a.app_view':'handleAppClick',
      'pane.activated': 'paneActivated'
    },

    init: function(data){
      if (data.firstLoad && this.currentLocation() !== 'top_bar' && this.currentLocation() !== 'nav_bar') {
        this.resizeIframe({ width : '300px', height : '260px' });
      }
    },

    paneActivated: function(data) {
      if (data.firstLoad) {
        this.resizeIframe({ width : '1024px', height : '500px' });
      }
    },

    resizeIframe: function(dimensions) {
      this.page = { href : "http://developer.zendesk.com/documentation/apps/introduction.html" };
      this.switchTo('iframePage', {
        dimension : dimensions,
        page : this.page
      });
    }

    // handleAppClick: function(){
    //   this.href = "http://developer.zendesk.com/documentation/apps/introduction.html";
    //   this.page = {};
    //   if (this.currentLocation() == 'top_bar' || this.currentLocation() == 'nav_bar'){
    //     this.page = {
    //       href : this.href,
    //       width : '1024px',
    //       height : '500px'
    //     }
    //   }
    //   this.switchTo('iframePage', {
    //     page:            this.page,
    //   });
    // }
  };
}());
