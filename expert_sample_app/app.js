(function() {

  'use strict';

  var TICKET_URL_PATTERN = /(.+)\.json$/,
      TO_REPLACE_PATTERN = /\/api\/v2\//,
              REPLACE_BY = '/agent/#/',
                 VAL_MIN = 0,
                 VAL_MAX = 100,
                TIME_OUT = 5000,
           TIME_INTERVAL = 500,
                 SORT_BY = 'created_at',
              SORT_ORDER = 'asc',
        DEFAULT_PAGE_NUM = 1,
          PAGE_NUM_CLASS = '.page_number',
              PREV_CLASS = '.prev',
              NEXT_CLASS = '.next';

  return {

    requests: {
      search: function(searchUrl) {
        return {
          url: searchUrl,
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
      'click .prev': 'previousTicketsPage',
      'click .next': 'nextTicketsPage',
      'click .page_number': 'searchTicketsByPageNumber'
    },

    init: function() {
      this.pageNumber = this.previousPageNumber = DEFAULT_PAGE_NUM;
      this.ticketsPerPage = this.setting('results_per_page');
      this.sendSearchRequest(this.makeSearchUrl(this.pageNumber));
    },

    previousTicketsPage: function() {
      if (this.pageNumber !== DEFAULT_PAGE_NUM) {
        this.previousPageNumber = this.pageNumber;
        this.pageNumber--;
        this.sendSearchRequest(this.previousPageQueryUrl);
      }
    },

    nextTicketsPage: function() {
      if (this.pageNumber !== this.totalPages) {
        this.previousPageNumber = this.pageNumber;
        this.pageNumber++;
        this.sendSearchRequest(this.nextPageQueryUrl);
      }

    },

    searchTicketsByPageNumber: function(event) {
      this.previousPageNumber = this.pageNumber;
      this.pageNumber = parseInt(this.$(event.currentTarget).text(), 10);
      if (this.previousPageNumber !== this.pageNumber) {
        this.sendSearchRequest(this.makeSearchUrl(this.pageNumber));
      }
    },

    renderTicketLinks: function(data) {
      console.log(data);
      this.ticketsInfo = [];
      _.each(data.results, this.organizeTicketsInfo.bind(this)); // Use bind to set organizeTicketsInfo's scope to this App.
      this.totalPages = Math.ceil(data.count / this.ticketsPerPage); // Calculate total number of pages.
      var pages = []; // Make page number array
      for (var i = 1; i <= this.totalPages; i++) {

        pages.push({ number: i, paginator: this.makePagiClassName(i) });
      }
      if (data.previous_page === null) {
        this.$('.prev').addClass('hidden');
      } else {
        this.previousPageQueryUrl = data.previous_page;
      }
      if (data.next_page === null) {
        this.$('.next').addClass('hidden');
      } else {
        this.nextPageQueryUrl = data.next_page;
      }
      this.switchTo('modal', {
        ticketsInfo: this.ticketsInfo,
        pages: pages
      });
      this.$('.tickets_list_header h5').text(this.I18n.t('total_ticket_assigned_today', { total: data.count }));
      this.syncButtons();
      this.reorderPageButtons();
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
      var ticketUrl = regexResult[1]; // This returns the matched ticket API url
      ticketUrl = ticketUrl.replace(TO_REPLACE_PATTERN, REPLACE_BY); // Convert API url to ticket url
      var ticketSubject = ticket.subject;
      this.ticketsInfo.push({
        url: ticketUrl,
        subject: ticketSubject
      });
    },

    makeSearchUrl: function(pageNumber) {
      var query = 'assignee:' + this.currentUser().email() + '+type:ticket+status:open';
      return helpers.fmt('/api/v2/search.json?page=%@&per_page=%@&query=%@&sort_by=%@&sort_order=%@', pageNumber, this.ticketsPerPage, query, SORT_BY, SORT_ORDER);
    },

    sendSearchRequest: function(queryUrl) {
      this.ajax('search', queryUrl);
      this.switchTo('loading_screen');
    },

    highlightCurrentPageNumber: function(btnClass, index) {
      this.$(this.$(this.$(btnClass)[index]).parent()).addClass('disabled');
      this.$(this.$(this.$(btnClass)[index]).parent()).removeClass('active');
    },

    removeHighlightOnPageNumber: function(btnClass, index) {
      this.$(this.$(this.$(btnClass)[index]).parent()).addClass('active');
      this.$(this.$(this.$(btnClass)[index]).parent()).removeClass('disabled');
      console.log(this.$(this.$(btnClass)[index]).parent());
    },

    syncButtons: function() {
      if (this.previousPageNumber !== this.pageNumber) {
        this.removeHighlightOnPageNumber(PAGE_NUM_CLASS, this.previousPageNumber - 1);
      }
      this.highlightCurrentPageNumber(PAGE_NUM_CLASS, this.pageNumber - 1);

      if (this.pageNumber < this.totalPages && this.pageNumber > DEFAULT_PAGE_NUM ) {
        this.removeHighlightOnPageNumber(NEXT_CLASS, 0);
        this.removeHighlightOnPageNumber(PREV_CLASS, 0);
      } else {
        if (this.totalPages === this.pageNumber) { // At last page
          this.highlightCurrentPageNumber(NEXT_CLASS, 0);
        }
        if (this.pageNumber === DEFAULT_PAGE_NUM) { // At first page
          this.highlightCurrentPageNumber(PREV_CLASS, 0);
        }
      }
    },

    reorderPageButtons: function() { // Always have 7 buttons displayed (2 for nav, 5 for page numbers)
      this.$('.pagi').addClass('hidden');
      if (this.totalPages - this.pageNumber + 2 > 5 - 1) {

        if (this.pageNumber - 2 <= DEFAULT_PAGE_NUM) {
          for (var i = DEFAULT_PAGE_NUM; i <= DEFAULT_PAGE_NUM + 4; i++) {
            this.$('.' + this.makePagiClassName(i)).removeClass('hidden');
          }
        } else {
          for (var j = this.pageNumber - 2; j <= this.pageNumber - 2 + 4; j++) {
            this.$('.' + this.makePagiClassName(j)).removeClass('hidden');
          }
        }
      } else if (this.pageNumber + 2 >= this.totalPages) {
        for (var z = this.totalPages; z >= this.totalPages - 4; z--) {
          this.$('.' + this.makePagiClassName(z)).removeClass('hidden');
        }
      }
    },

    makePagiClassName: function(pageNumber) {
      return helpers.fmt('pagi%@', pageNumber);
    }
  };

}());
