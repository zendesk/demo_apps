(function() {

  'use strict';

  return {

    resources: {
      TICKET_URL_PATTERN       : /(.+)\.json$/,
      TO_REPLACE_PATTERN       : /\/api\/v2\//,
      REPLACE_BY               : '/agent/#/',
      VAL_MIN                  : 0,
      VAL_MAX                  : 100,
      TIME_OUT                 : 5000,
      TIME_INTERVAL            : 500,
      DEFAULT_PAGE_NUM         : 1,
      NUM_OF_PAGE_BUTTONS_SHOW : 5,
      TICKET_LINK_HEIGHT       : 26,
      SORT_BY                  : 'created_at',
      SORT_ORDER               : 'asc',
      PAGE_NUM_CLASS           : 'page_number',
      PREV_CLASS               : 'prev',
      NEXT_CLASS               : 'next',
      MODAL_CLASS              : 'my_modal',
      HIDE_CLASS               : 'hidden'
    },

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
      'app.activated':      'init',
      'ticket.save':        'saveHookHandler',
      'ticket.submit.done': 'ticketSubmitDoneHandler',
      'search.done':        'renderTicketLinks',
      'click .prev':        'previousTicketsPage',
      'click .next':        'nextTicketsPage',
      'click .page_number': 'searchTicketsByPageNumber'
    },

    init: function() {
      this.pageNumber = this.previousPageNumber = this.resources.DEFAULT_PAGE_NUM;
      this.ticketsPerPage = this.setting('results_per_page');
      this.sendSearchRequest(this.makeSearchUrl(this.pageNumber)); // Get tickets info on the first page
    },

    previousTicketsPage: function() {
      if (this.pageNumber !== this.resources.DEFAULT_PAGE_NUM) {
        this.previousPageNumber = this.pageNumber;
        this.pageNumber--;
        this.sendSearchRequest(this.previousPageQueryUrl); // Get tickets info from previous page.
      }
    },

    nextTicketsPage: function() {
      if (this.pageNumber !== this.totalPages) {
        this.previousPageNumber = this.pageNumber;
        this.pageNumber++;
        this.sendSearchRequest(this.nextPageQueryUrl); // Get tickets info from next page.
      }
    },

    searchTicketsByPageNumber: function(event) {
      this.previousPageNumber = this.pageNumber;
      this.pageNumber = parseInt(event.currentTarget.text, 10);
      if (this.previousPageNumber !== this.pageNumber) {
        this.sendSearchRequest(this.makeSearchUrl(this.pageNumber)); // Get tickets info given a page number
      }
    },

    renderTicketLinks: function(data) { // Reload App page once ajax call is done.
      this.ticketsInfo = [];
      this.pages = [];
      _.each(data.results, this.organizeTicketsInfo.bind(this)); // Use bind to set organizeTicketsInfo's scope to this App.
      this.totalPages = Math.ceil(data.count / this.ticketsPerPage); // Calculate total number of pages.
      _.each(_.range(1, this.totalPages + 1), this.addPages.bind(this)); // Use underscore function _.range to create an array of numbers starting from 1 until size of totalPages.
      this.switchTo('modal', {
        ticketsInfo: this.ticketsInfo,
        pages: this.pages
      });
      this.$('.tickets_list_header h5').text(this.I18n.t('total_ticket_assigned_today', { total: data.count }));
      this.$('.tickets_list_body').css('height', this.ticketsPerPage * this.resources.TICKET_LINK_HEIGHT);
      if (data.previous_page === null) {
        this.getHighlightPaginationButton(this.resources.PREV_CLASS).addClass(this.resources.HIDE_CLASS);
      } else {
        this.previousPageQueryUrl = data.previous_page;
      }
      if (data.next_page === null) {
        this.getHighlightPaginationButton(this.resources.NEXT_CLASS).addClass(this.resources.HIDE_CLASS);
      } else {
        this.nextPageQueryUrl = data.next_page;
      }
      this.removeOrAddHighlight();
      this.reorderPageButtons();
    },

    ticketSubmitDoneHandler: function() { // This is called once ticket.submit.done event is fired.
      clearInterval(this.progress);
      this.toggleModal(this.resources.MODAL_CLASS, false);
    },

    saveHookHandler: function() { // This is called onces ticket.save is fired.
      this.commentBody = this.comment().text();
      this.toggleModal(this.resources.MODAL_CLASS, true);
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
          this.valNow = this.resources.VAL_MIN;
          this.progress = setInterval(function() {
            this.goProgress(this.valNow);
            if (Date.now() - this.currentTime > this.resources.TIME_OUT) {
              done();
            }
          }.bind(this), this.resources.TIME_INTERVAL);
        });
      }
    },

    /* Helpers Go Here. */
    toggleModal: function(modalClass, showModal) { // Toggle modal
      var classSelector = this.makeClassSelector(modalClass),
          modalParam;
      if (showModal) {
        modalParam = { backdrop: true, keyboard: false };
      } else {
        modalParam = 'hide';
      }
      this.$(classSelector).modal(modalParam);
    },

    goProgress: function(valNow) { // Bootstrap 2.3 progress bar
      this.valNow += this.resources.VAL_MAX / ( this.resources.TIME_OUT / this.resources.TIME_INTERVAL );
      var percentage = valNow * 100 / this.resources.VAL_MAX;
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
      this.toggleModalElementHidden(false);
    },

    showSubmitProgressBar: function() {
      this.renderModalLabel('modal_header_submit');
      this.toggleModalElementHidden(true);
    },

    toggleModalElementHidden: function(isProgressBarOnShown) {
      this.$('.alert-block').toggleClass(this.resources.HIDE_CLASS,isProgressBarOnShown);
      this.$('.modal-footer').toggleClass(this.resources.HIDE_CLASS, isProgressBarOnShown);
      this.$('.progress').toggleClass(this.resources.HIDE_CLASS, !isProgressBarOnShown);
    },

    organizeTicketsInfo: function(ticket) {
      var regexResult = this.resources.TICKET_URL_PATTERN.exec(ticket.url);
      var ticketUrl = regexResult[1]; // This returns the matched ticket API url
      ticketUrl = ticketUrl.replace(this.resources.TO_REPLACE_PATTERN, this.resources.REPLACE_BY); // Convert API url to ticket url
      var ticketSubject = ticket.subject;
      this.ticketsInfo.push({
        url: ticketUrl,
        subject: ticketSubject
      });
    },

    makeSearchUrl: function(pageNumber) { // This search query searches for all open tickets that are assigned to the current user.
      var query = 'assignee:' + this.currentUser().email() + '+type:ticket+status:open';
      return helpers.fmt('/api/v2/search.json?page=%@&per_page=%@&query=%@&sort_by=%@&sort_order=%@', pageNumber, this.ticketsPerPage, query, this.resources.SORT_BY, this.resources.SORT_ORDER);
    },

    sendSearchRequest: function(queryUrl) {
      this.ajax('search', queryUrl); // Fire jQuery-like ajax request
      this.switchTo('loading_screen');
    },

    getHighlightPaginationButton: function(btnClass, index) { // Return a jQuery object of the page button to be highlighted
      index = index || 0;
      return this.$(this.makeClassSelector(btnClass)).eq(index).parent();
    },

    highlightCurrentPageNumber: function(btnClass, index) {
      this.getHighlightPaginationButton(btnClass, index)
        .addClass('disabled')
        .removeClass('active');
    },

    removeHighlightOnPageNumber: function(btnClass, index) {
      this.getHighlightPaginationButton(btnClass, index)
          .addClass('active')
          .removeClass('disabled');
    },

    removeOrAddHighlight: function() {
      if (this.previousPageNumber !== this.pageNumber) { // Remove highlight on previously selected page.
        this.removeHighlightOnPageNumber(this.resources.PAGE_NUM_CLASS, this.previousPageNumber - 1);
      }
      this.highlightCurrentPageNumber(this.resources.PAGE_NUM_CLASS, this.pageNumber - 1);
    },

    reorderPageButtons: function() { // Always have at most 7 buttons displayed (2 for nav, 5 for page numbers)
      this.numOfPageBtnEachSide = this.resources.NUM_OF_PAGE_BUTTONS_SHOW / 2;
      this.$('.pagi').addClass(this.resources.HIDE_CLASS);
      if (this.totalPages - this.pageNumber + this.numOfPageBtnEachSide > this.resources.NUM_OF_PAGE_BUTTONS_SHOW - 1) {
        if (this.pageNumber - this.numOfPageBtnEachSide <= this.resources.DEFAULT_PAGE_NUM) {
          for (var i = this.resources.DEFAULT_PAGE_NUM; i <= this.resources.DEFAULT_PAGE_NUM + this.resources.NUM_OF_PAGE_BUTTONS_SHOW - 1; i++) {
            this.$('.' + this.makePagiClassName(i)).removeClass(this.resources.HIDE_CLASS);
          }
        } else {
          for (var j = this.pageNumber - this.numOfPageBtnEachSide; j <= this.pageNumber - this.numOfPageBtnEachSide + this.resources.NUM_OF_PAGE_BUTTONS_SHOW - 1; j++) {
            this.$('.' + this.makePagiClassName(j)).removeClass(this.resources.HIDE_CLASS);
          }
        }
      } else if (this.pageNumber + this.numOfPageBtnEachSide >= this.totalPages) {
        for (var z = this.totalPages; z >= this.totalPages - ( this.resources.NUM_OF_PAGE_BUTTONS_SHOW - 1 ); z--) {
          this.$('.' + this.makePagiClassName(z)).removeClass(this.resources.HIDE_CLASS);
        }
      }
    },

    makePagiClassName: function(pageNumber) {
      return helpers.fmt('pagi%@', pageNumber);
    },

    makeClassSelector: function(className) {
      return helpers.fmt('.%@', className);
    },

    addPages: function(num) {
      this.pages.push({ number: num, paginator: this.makePagiClassName(num) });
    }
  };

}());
