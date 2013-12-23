(function () {

  return {

    events: {
      'app.activated': 'modalAttr',
      'hidden .my_modal': 'onHidden'
    },

    modalAttr: function () {
      this.switchTo('modal', {
        header: this.I18n.t('modal_header', { method: 'Data Attribute' }),
        body: this.I18n.t('modal_body')
      });

    },

    onHidden: function () {
      console.log("hidden in Process");
    }

  };

}());
