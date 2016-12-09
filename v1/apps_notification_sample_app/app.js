(function() {

  return {
    events: {
      'app.created':         'initApp',
      'click .btn-growl-it': 'growlIt'
    },

    initApp: function() {
      this.switchTo('input');
    },

    growlIt: function() {
      var msg  = 'This will be shown for %@ seconds',
          life = parseInt(this.$('#life').val(), 10);
      life = isNaN(life) ? 3 : life;
      services.notify(msg.fmt(life), 'notice', life * 1000);
    }
  };

}());
