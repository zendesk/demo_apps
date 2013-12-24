(function() {

  'use strict';

  var EVENT_NAME = "send_message",
      MEDIUM_WIDTH = 480,
      MEDIUM_HEIGHT = 300,
      SMALL_WIDTH = 280,
      SMALL_HEIGHT = 240,
      LARGE_WIDTH = 640,
      LARGE_HEIGHT = 400;

  return {

    events: {
      'app.activated': 'init',
      'pane.activated': 'paneOnActivated',
      'pane.deactivated': 'paneOnDeactivated',
      'notification.send_message': 'showNoticeBoard',
      'click .resize_app ul li a': 'resizeAppWindow'

    },

    init: function() {
      this.isNotified = false; // Set the isNotified tag to false by default.
    },

    startPage: function(e) {
      this.switchTo('instruction');
      var uri = e.currentTarget.baseURI.split("/")[2];
      var command = this.I18n.t('instruction_page.command', {
        app_id: this.id(),
        event: EVENT_NAME,
        uri: uri,
        email: this.currentUser().email()
      });
      this.$('code').text(command);
    },

    paneOnActivated: function(e) {
      if (!this.isNotified) {
        this.startPage(e);
      }
      this.popover({ width: MEDIUM_WIDTH, height: MEDIUM_HEIGHT });
    },

    paneOnDeactivated: function() {
      if (this.isNotified) {
        this.isNotified = false;
      }
    },

    showNoticeBoard: function(data) {
      this.isNotified = true;
      this.switchTo('notice_board', {
        message: data
      });
      this.popover();
    },

    resizeAppWindow: function(e) {
      switch (e.currentTarget.className) {
        case 'small':
          this.popover({ width: SMALL_WIDTH, height: SMALL_HEIGHT });
          break;
        case 'medium':
          this.popover({ width: MEDIUM_WIDTH, height: MEDIUM_HEIGHT });
          break;
        case 'largest':
          this.popover({ width: LARGE_WIDTH, height: LARGE_HEIGHT});
          break;
        default:
          break;
      }
    }
  };

}());
