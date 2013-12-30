(function() {

  'use strict';

  var EVENT_NAME        = 'send_message',
      SUBDOMAIN_PATTERN = /[a-zA-Z0-9]+\.[a-zA-Z0-9]+\.[a-zA-Z0-9]+/,// Pattern for subdomain.zendesk.com extraction.
      SIZES             = {
        small: {
          width: 280,
          height: 240
        },
        medium: {
          width: 480,
          height: 300
        },
        largest: {
          width: 600,
          height: 400
        }
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
      // Set the isNotified tag to false by default.
      this.isNotified = false;
    },

    startPage: function(e) {
      // Run regular expression to extract subdomain
      var regexResult = SUBDOMAIN_PATTERN.exec(e.currentTarget.baseURI);
      // These parameters are handlebars parameters in the instruction page that renders a cURL command
      this.switchTo('instruction', {
        app_id: this.id(),
        event: EVENT_NAME,
        url: regexResult[0], // This gets the matched URL.
        email: this.currentUser().email()
      });
    },

    paneOnActivated: function(e) {
      if (!this.isNotified) {
        this.startPage(e);
      }

      // Resize after pane is activated.
      this.popover(SIZES.medium);
    },

    paneOnDeactivated: function() {
      if (this.isNotified) {
        this.isNotified = false;
      }
    },

    showNoticeBoard: function(data) {
      this.isNotified = true;

      // Pass the message received from the notify API call.
      this.switchTo('notice_board', {
        message: data
      });
      this.popover();
    },

    resizeAppWindow: function(e) {

      var size = e.currentTarget.className;

      this.$('.resize_app ul li').removeClass('active');
      this.$(e.currentTarget).parent().addClass('active');
      this.popover(SIZES[size]);

    }
  };

}());
