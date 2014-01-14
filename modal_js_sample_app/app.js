(function() {

  // complete app API reference can be found at
  // http://developer.zendesk.com/documentation/rest_api/apps.html

  return {

    events: {
      'app.activated': 'init',
      'show .my_modal': 'onShow',
      'click .toggle_modal': 'displayModal',
      'click .save_button': 'showSavedMessage'
    },

    init: function() {
      this.switchTo('modal');
    },
    // Capture the show modal event.
    onShow: function() {
      services.notify('activating the modal');
    },

    displayModal: function() {
      this.$('.my_modal').modal({
        backdrop: true,
        keyboard: false
      });
    },

    showSavedMessage: function() {
      this.$('.my_modal').modal('hide');
      // Print modal body text.
      this.switchTo('modal', {
        modal_body: this.$('.modal-body p').text()
      });

    }
  };

}());
