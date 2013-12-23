(function() {

  return {

    events: {
      'app.activated': 'init',
      'show .my_modal': 'onShow',
      'click .toggle_modal_javascript': 'displayModal',
      'click .modal_switch_attribute': 'switchToModalAttrExample',
      'click .save_button': 'showSavedMessage'
    },

    init: function() {
      this.switchTo('modal');
    },

    onShow: function() { // Capture the show modal event.
      console.log("activating the modal");
    },

    displayModal: function() {
      this.$('.my_modal').modal({
        backdrop: true,
        keyboard: false
      });
    },

    showSavedMessage: function() {
      this.modalBody = this.$('.modal-body p').text(); // Print modal boy text.
      console.log(this.modalBody);
      this.$('.my_modal').modal('hide');
    }
  };

}());
