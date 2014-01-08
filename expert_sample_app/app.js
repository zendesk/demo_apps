(function() {

  'use strict';

  var TICKET_URL_PATTERN = /(.+)\.json$/,
                 VAL_MIN = 0,
                 VAL_MAX = 100,
                TIME_OUT = 5000,
           TIME_INTERVAL = 500,
                PER_PAGE = 6,
                 SORT_BY = 'created_at',
              SORT_ORDER = 'asc';

  return {

    requests: {
      search: function(perPage, queryString, sortBy, sortOrder) {
        return {
          url: helpers.fmt('/api/v2/search.json?per_page=%@&query=%@&sort_by=%@&sort_order=%@', perPage, queryString, sortBy, sortOrder),
          type: 'GET',
          dataType: 'json'
        };
      }
    },

    events: {
      'app.activated': 'init',
      'ticket.save': 'saveHookHandler',
      'ticket.submit.start': 'ticketSubmitStartHandler',
      'ticket.submit.done': 'ticketSubmitDoneHandler',
      'click .comment_body_btn': 'showComment',
      'search.done': 'renderTicketLinks',
      'click .nav a': 'searchTickets'
    },

    init: function() {
      var query = 'assignee:' + this.currentUser().email() + '+type:ticket+status:open';
      console.log(query);
      this.ticketsInfo = [];
      /* TODO: Make a loader icon here, and make ajax call into a promise. This can improve the overall app experience. */
      this.ajax('search', PER_PAGE , query, SORT_BY, SORT_ORDER);
      console.log(helpers.fmt('/api/v2/search.json?per_page=%@&query=%@&sort_by=%@&sort_order=%@', PER_PAGE, query, SORT_BY, SORT_ORDER));
    },

    searchTickets: function(event) {

      this.ajax('search', PER_PAGE, event.currentTarget.href, SORT_BY, SORT_ORDER);
    },

    renderTicketLinks: function(data) {
      console.log(data);
      _.each(data.results, this.organizeTicketsInfo.bind(this)); // Use bind to set organizeTicketsInfo's scope to this App.
      this.switchTo('modal', {
        ticketsInfo: this.ticketsInfo
      });
      this.$('.tickets_list_header h5').text(this.I18n.t('total_ticket_assigned_today', { total: data.count }));
      if (data.previous_page === null) {
        this.$('.prev').addClass('hidden');
      }
      if (data.next_page === null) {
        this.$('.next').addClass('hidden');
      }
    },

    ticketSubmitStartHandler: function() {

    },

    ticketSubmitDoneHandler: function() {
      var percentage = 100;
      this.progressBar.css('width', percentage + '%');
      this.$('.sr-only').text(this.I18n.t('progress_percentage', {
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
      if (this.commentBody === '') {
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
            if (Date.now() - this.currentTime > TIME_OUT) {
              done();
            }
          }.bind(this), TIME_INTERVAL);
        });
      }
    },

    /* Helpers Go Here. */

    goProgress: function(valNow) { // Bootstrap 2.3 progress bar
      this.valNow += VAL_MAX / ( TIME_OUT / TIME_INTERVAL );
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
    },

    organizeTicketsInfo: function(ticket) {
      var regexResult = TICKET_URL_PATTERN.exec(ticket.url);
      var ticketUrl = regexResult[1]; // This returns the matched url
      var ticketSubject = ticket.subject;
      this.ticketsInfo.push({
        url: ticketUrl,
        subject: ticketSubject
      });
    }
  };

}());
