(function() {

  'use strict';

  var PATTERN = /ticket_sidebar$/,
    VAL_MIN = 0,
    VAL_MAX = 100;

  function stopFunction(progress) {
    clearInterval(progress);
  }

  return {
    events: {
      'app.activated': 'init',
      'ticket.save': 'saveHookHandler',
      'ticket.submit.start': 'ticketSubmitStartHandler',
      'ticket.submit.done': 'ticketSubmitDoneHandler',
      'click .comment_body_btn': 'showComment'
    },

    init: function() {
      this.switchTo('modal');
    },

    ticketSubmitStartHandler: function() {
    },

    ticketSubmitDoneHandler: function() {
      var percentage = 100;
      this.progressBar.css('width', percentage + '%');
      this.$('sr-only').text(this.I18n.t('progress_percentage', {
        percentage: percentage
      }));

      clearInterval(this.progress);

      this.$('.my_modal').modal('hide');

    },

    showComment: function() {
      console.log(this.comment().text());
    },

    saveHookHandler: function() {

      this.commentBody = this.comment().text();
      console.log(this.commentBody);
      this.$('modal-footer').addClass('hidden');

      this.$('.my_modal').modal({
        backdrop: true,
        keyboard: false
      });

      if(this.commentBody === '') {
        return this.promise(function(done, fail) {
          fail();
        }).fail(function() {
            this.showWarningDialog();
          }.bind(this));
      } else {
        return this.promise(function(done, fail) {

          this.showSubmitProgressBar();

          this.progressBar = this.$('.bar');

          this.currentTime = Date.now();

          this.valNow = VAL_MIN;

          this.progress = setInterval(function() {

            this.goProgress(this.valNow);

            if(Date.now() - this.currentTime > 5000) {
              done();
            }

          }.bind(this), 500);

        });
      }
    },

    /* Helpers Go Here. */

    goProgress: function(valNow) {
      this.valNow += VAL_MAX / 10;

      var percentage = valNow * 100 / VAL_MAX;

      this.progressBar.css('width', percentage + '%');

      this.$('.sr-only').text(this.I18n.t('progress_percentage', {
        percentage: percentage
      }));
    },

    renderModalLabel: function(label) {
      this.$('.my_modal_label').text(this.I18n.t(label));
    },

    showWarningDialog: function() {
      this.renderModalLabel('modal_header_reject');
      this.$('.alert-block').removeClass('hidden');
      this.$('.progress').addClass('hidden');
      this.$('button').removeClass('hidden');
    },

    showSubmitProgressBar: function() {
      this.renderModalLabel('modal_header_submit');
      this.$('.alert-block').addClass('hidden');
      this.$('.progress').removeClass('hidden');

      this.$('button').addClass('hidden');


    }


};

}());
