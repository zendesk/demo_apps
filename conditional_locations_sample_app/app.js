(function() {

  return {
    events: {
      'app.created': 'onAppCreated',
      'click .hide-btn': 'onHideBtnClick',
      'click .show-btn': 'onShowBtnClick',
      'message.hide': 'onHideMessageRecieved',
      'message.show': 'onShowMessageRecieved'
    },

    locations: {
      top_bar: {
        name: 'Top Bar',
        visible: true
      },
      nav_bar: {
        name: 'Nav Bar',
        visible: true
      },
      ticket_sidebar: {
        name: 'Ticket Sidebar',
        visible: false // specified as noTemplate in the manfiest, therefore will be hidden by default
      }
    },

    // Event Handlers

    onAppCreated: function() {
      this.renderControls();
    },

    onHideBtnClick: function(e) {
      var location = this.$(e.target).parents('[data-location]').data('location');
      this.hideLocation(location);
      this.renderControls();
    },

    onShowBtnClick: function(e) {
      var location = this.$(e.target).parents('[data-location]').data('location');
      this.showLocation(location);
      this.renderControls();
    },

    onHideMessageRecieved: function(data) {
      this.locations[data.location].visible = false;
      if (data.location == this.currentLocation()) {
        this.hide();
      }
      this.renderControls();
    },

    onShowMessageRecieved: function(data) {
      this.locations[data.location].visible = true;
      if (data.location == this.currentLocation()) {
        this.show();
      }
      this.renderControls();
    },

    // Actions

    renderControls: function() {
      this.switchTo('controls', {
        currentLocation: this.locations[this.currentLocation()],
        locations: this.locations
      });
    },

    hideLocation: function(location) {
      this.locations[location].visible = false;
      if (location == this.currentLocation()) {
        this.hide();
      } else {
        this.message('hide', {location: location});
      }
    },

    showLocation: function(location) {
      this.locations[location].visible = true;
      if (location == this.currentLocation()) {
        this.show();
      } else {
        this.message('show', {location: location});
      }
    }
  };

}());
