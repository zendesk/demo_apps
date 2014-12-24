(function() {

  return {

    defaultState: 'loading',

    events: {
      // Lifecycle
      'app.activated':           'appActivated',
      'pane.activated':          'paneActivated',

      // Requests
      'getUserRelatedInfo.done': 'handleUserData',

      // DOM events
      'click a.app_view':        'handleIconClick'
    },

    requests: {
      getUserRelatedInfo: function(id) {
        return { url: helpers.fmt('/api/v2/users/%@/related.json', id) };
      }
    },

    appActivated: function(data) {
      if (data.firstLoad) {
        this.setIconState('inactive', this.assetURL('spinner.gif'));
        this.ajax('getUserRelatedInfo', this.currentUser().id());
      }
    },

    paneActivated: function(data) {
      if (data.firstLoad) {
        this.inDOM = true;
        // DOM manipulation can be done from this point
      }
    },

    handleUserData: function(data) {
      this.setIconState('inactive', this.assetURL('icon_nav_bar_inactive.png'));

      this.switchTo('user', {
        hello: this.I18n.t('user.hello', { name: this.currentUser().name() }),
        information: this.I18n.t('user.information', data.user_related)
      });
    },

    handleIconClick: function() {
       if (this.currentState === 'loading') { return false; }
    }
  };

}());
