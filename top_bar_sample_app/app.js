(function() {

  'use strict';

  var EVENT_NAME        = 'send_message',
      MEDIUM_WIDTH      = 480,
      MEDIUM_HEIGHT     = 300,
      SMALL_WIDTH       = 280,
      SMALL_HEIGHT      = 240,
      LARGE_WIDTH       = 640,
      LARGE_HEIGHT      = 400,
      SUBDOMAIN_PATTERN = /\/\/([a-zA-Z0-9]*)./, // Pattern for subdomain extraction.
      SIZES             = {
        small: { width: SMALL_WIDTH, height: SMALL_HEIGHT },
        medium: { width: MEDIUM_WIDTH, height: MEDIUM_HEIGHT },
        largest: { width: LARGE_WIDTH, height: LARGE_HEIGHT }
      };
  return {

    events: {
      'app.activated': 'init', // This event fires when App is activated.
      'pane.activated': 'paneOnActivated', // This event fires when pane in topbar is activated.
      'pane.deactivated': 'paneOnDeactivated',
      'notification.send_message': 'showNoticeBoard', // Capture notification event 'send_message'
      'click .resize_app a': 'resizeAppWindow' // This event is fired when an element in the App is clicked, in this case, we try to capture the click event of tabs in the notification_board
    },

    init: function() {
      this.isNotified = false; // Set the isNotified tag to false by default.
    },

    startPage: function(e) {
      var regexResult = SUBDOMAIN_PATTERN.exec(e.currentTarget.baseURI); // Run regular expression to extract subdomain
      this.switchTo('instruction', { // These parameters are handlebars parameters in the instruction page that renders a cURL command
        app_id: this.id(),
        event: EVENT_NAME,
        subdomain: regexResult[1], // This gets the subdomain.
        email: this.currentUser().email()
      });
    },

    paneOnActivated: function(e) {
      if (!this.isNotified) {
        this.startPage(e);
      }
      this.popover({ width: MEDIUM_WIDTH, height: MEDIUM_HEIGHT }); // Resize after pane is activated.
    },

    paneOnDeactivated: function() {
      if (this.isNotified) {
        this.isNotified = false;
      }
    },

    showNoticeBoard: function(data) {
      this.isNotified = true;
      this.switchTo('notice_board', { // Pass the message received from the notify API call.
        message: data
      });
      this.popover();
    },

    resizeAppWindow: function(e) {

      this.$('.resize_app ul li').removeClass('active');
      this.$(e.currentTarget).parent().addClass('active');

      var size = e.currentTarget.className;
      if (size === 'small') {
        this.popover(SIZES.small);
      } else if (size === 'medium') {
        this.popover(SIZES.medium);
      } else if (size === 'largest') {
        this.popover(SIZES.largest);
      }

    }
  };

}());
