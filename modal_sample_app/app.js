(function() {

  return {

    events: {
      'app.activated': 'modalAttr',
      'hide .my_modal': 'onHide',
      'shown .my_modal': 'onShown',
      'show .my_modal': 'onShow',
      'hidden .my_modal': 'onHidden',
      'click .modal_switch_javascript': 'switchToModalJSExample',
      'click .toggle_modal_javascript': 'displayModal',
      'click .modal_switch_attribute': 'switchToModalAttrExample',
      'click .save_button': 'showSavedMessage'
    },

    modalAttr: function(hasModalBody) {
      if (hasModalBody) {
        this.switchTo('modal', {
          header: this.I18n.t('modal_header', { method: 'Data Attribute' }),
          body: this.I18n.t('modal_body'),
          modal_body: this.modalBody
        });
      } else {
        this.switchTo('modal', {
          header: this.I18n.t('modal_header', { method: 'Data Attribute' }),
          body: this.I18n.t('modal_body')
        });
      }
      this.isJavascript = false;
    },

    onHide: function() {
      console.log("hide in Process");
    },

    onShown: function() {
      console.log("shown in Process");
    },

    onShow: function() {
      console.log("show in Process");
    },

    onHidden: function() {
      console.log("hidden in Process");
      if (this.isJavascript) {
        this.switchTo('modal_js', { modal_body: this.modalBody });
      } else {
        this.modalAttr(true);
      }
    },

    switchToModalJSExample: function() {
      this.switchTo('modal_js');
      this.isJavascript = true;
    },

    switchToModalAttrExample: function() {
      this.modalAttr(false);
    },

    displayModal: function() {
      this.switchTo('modal', {
        header: this.I18n.t('modal_header', { method: 'JavaScript' }),
        body: this.I18n.t('modal_body')
      });
      this.isJavascript = true;
      this.$('.my_modal').modal({
        backdrop: true,
        keyboard: false
      });
    },

    showSavedMessage: function() {
      this.modalBody = this.$('.modal-body p').text();
      console.log(this.modalBody);
      this.$('.my_modal').modal('hide');
    }
  };

}());
