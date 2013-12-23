(function () {

  return {

    events: {
      'app.activated': 'init',
      'hidden .my_modal': 'afterHidden' // The 'hidden' event is fired when the modal (.my_modal) has finished being hidden from the user (will wait for css transitions to complete).
    },

    init: function () {
      this.switchTo('modal', {
        header: this.I18n.t('modal_header'),
        body: this.I18n.t('modal_body')
      });

    },

    afterHidden: function () {
      console.log("hidden in Process");
    }

  };

}());
