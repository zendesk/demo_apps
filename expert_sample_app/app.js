(function () {

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

    init: function () {
      this.switchTo('modal');
      /*if (PATTERN.test(this.currentLocation())) {
       console.log(this.ticketFields());
       console.log(this.ticket());
       console.log(this.comment().text());
       }*/
/*      this.commentBody = this.comment().text();
      console.log(this.commentBody);
      this.$('modal-footer').addClass('hidden');

      this.$('.my_modal').modal({
        backdrop: true,
        keyboard: false
      });

      console.log(this.comment().text());
      this.$('.alert-block').addClass('hidden');
      this.$('.progress').removeClass('hidden');

      this.progressBar = this.$('.bar');
      //this.valMax = this.progressBar.attr('aria-valuemax');
      console.log("define valMax here: " + VAL_MAX);
      this.currentTime = Date.now();

      this.valNow = 0;

      this.progress = setInterval(function () {

        //var val = this.progressBar.attr('aria-valuenow');
        console.log("val: " + this.valNow);
        this.valNow += VAL_MAX / 30
        this.progressBar.attr('aria-valuenow', this.valnow);

        console.log("val: " + this.valNow);
        console.log("valMax: " + VAL_MAX);
        var percentage = this.valNow * 100 / VAL_MAX;

        console.log("percentage: " + percentage);
        this.progressBar.css('width', percentage + '%');

        this.$('.sr-only').text(this.I18n.t('progress_percentage', {
          percentage: percentage
        }));

        if (Date.now() - this.currentTime > 30000) {
          clearInterval(this.progress);
        }

        console.log('hello world!');
      }.bind(this), 1000);
*/
    },

    ticketSubmitStartHandler: function () {
    },

    ticketSubmitDoneHandler: function () {
      var percentage = 100;
      this.progressBar.css('width', percentage + '%');
      this.$('sr-only').text(this.I18n.t('progress_percentage', {
        percentage: percentage
      }));

      clearInterval(this.progress);

      this.$('.my_modal').modal('hide');

    },

    showComment: function () {
      console.log(this.comment().text());
    },

    saveHookHandler: function () {

      this.commentBody = this.comment().text();
      console.log(this.commentBody);
      this.$('modal-footer').addClass('hidden');

      this.$('.my_modal').modal({
        backdrop: true,
        keyboard: false
      });

      if (this.commentBody === '') {
        return this.promise(function (done, fail) {
          fail();
        }).fail(function () {
            //debugger;
            this.$('.alert-block').removeClass('hidden');
            this.$('.progress').addClass('hidden');
          }.bind(this));
      } else {

        console.log(this.comment().text());
        this.$('.alert-block').addClass('hidden');
        this.$('.progress').removeClass('hidden');

        this.progressBar = this.$('.bar');
        //this.valMax = this.progressBar.attr('aria-valuemax');
        console.log('define valMax here: ' + VAL_MAX);
        this.currentTime = Date.now();

        this.valNow = 0;

        this.progress = setInterval(function () {

          //var val = this.progressBar.attr('aria-valuenow');
          console.log('val: ' + this.valNow);
          this.valNow += VAL_MAX / 10;
          this.progressBar.attr('aria-valuenow', this.valnow);

          console.log('val: ' + this.valNow);
          console.log('valMax: ' + VAL_MAX);
          var percentage = this.valNow * 100 / VAL_MAX;

          console.log('percentage: ' + percentage);
          this.progressBar.css('width', percentage + '%');

          this.$('.sr-only').text(this.I18n.t('progress_percentage', {
            percentage: percentage
          }));

          if (Date.now() - this.currentTime > 5000) {
            clearInterval(this.progress);
          }

          console.log('hello world!');
        }.bind(this), 500);

        setTimeout(this, 5000);

      }

    },

    progressBarEffect: function () {
      this.progressBar = this.$('.bar');

    }

  };

}());
