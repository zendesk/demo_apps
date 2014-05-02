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
      FIRST_PAGE               : 1,
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
      'app.activated'      : 'init',
      'ticket.save'        : 'saveHookHandler',
      'ticket.submit.done' : 'ticketSubmitDoneHandler',
      'hidden .my_modal'   : 'modalIsHiddenHandler',
      'search.done'        : 'renderTicketLinks',
      'click .prev'        : 'previousTicketsPage',
      'click .next'        : 'nextTicketsPage',
      'click .page_number' : 'searchTicketsByPageNumber'
    },

    init: function() {
      this.pageNumber = this.previousPageNumber = this.resources.DEFAULT_PAGE_NUM;
      this.incrementValue = this.incrementValue || Math.floor(this.resources.VAL_MAX / ( this.resources.TIME_OUT / this.resources.TIME_INTERVAL ));
      this.numOfPageBtnEachSide = this.numOfPageBtnEachSide || Math.floor(this.resources.NUM_OF_PAGE_BUTTONS_SHOW / 2);
      this.ticketsPerPage = this.setting('results_per_page');
      this.sendSearchRequest(this.makeSearchUrl(this.pageNumber)); // Get tickets info on the first page
    },

    previousTicketsPage: function(event) {
      event.preventDefault();
      if (this.pageNumber > this.resources.FIRST_PAGE) {
        this.previousPageNumber = this.pageNumber;
        this.pageNumber--;
        this.sendSearchRequest(this.previousPageQueryUrl); // Get tickets info from previous page.
      }
    },

    nextTicketsPage: function(event) {
      event.preventDefault();
      if (this.pageNumber !== this.totalPages) {
        this.previousPageNumber = this.pageNumber;
        this.pageNumber++;
        this.sendSearchRequest(this.nextPageQueryUrl); // Get tickets info from next page.
      }
    },

    searchTicketsByPageNumber: function(event) {
      event.preventDefault();
      this.previousPageNumber = this.pageNumber;
      this.pageNumber = parseInt(event.currentTarget.text, 10);
      if (this.previousPageNumber !== this.pageNumber) {
        this.sendSearchRequest(this.makeSearchUrl(this.pageNumber)); // Get tickets info given a page number
      }
    },

    renderTicketLinks: function(data) { // Reload App page once ajax call is done.
      this.totalPages = Math.ceil(data.count / this.ticketsPerPage); // Calculate total number of pages.
      this.switchTo('ticket_list', {
        ticketsInfo: data.results,
        pages: _.range(1, this.totalPages + 1),
        total: data.count
      });
      if (data.previous_page === null) {
        this.highlightCurrentPageNumber(this.resources.PREV_CLASS, 0);
      } else {
        this.previousPageQueryUrl = data.previous_page;
        this.removeHighlightOnPageNumber(this.resources.PREV_CLASS, 0);
      }
      if (data.next_page === null) {
        this.highlightCurrentPageNumber(this.resources.NEXT_CLASS, 0);
      } else {
        this.nextPageQueryUrl = data.next_page;
        this.removeHighlightOnPageNumber(this.resources.NEXT_CLASS, 0);
      }

      if (data.count === 0) { // Hide prev and next buttons if there is no ticket
        this.$(this.makeClassSelector(this.resources.PREV_CLASS)).addClass(this.resources.HIDE_CLASS);
        this.$(this.makeClassSelector(this.resources.NEXT_CLASS)).addClass(this.resources.HIDE_CLASS);
      } else { // Otherwise, assign the height of the ticket list body
        this.$('.tickets_list_body').height(this.ticketsPerPage * this.resources.TICKET_LINK_HEIGHT);
      }

      this.removeOrAddHighlight();
      if (this.totalPages > 5) {
        this.reorderPageButtons();
      }
    },

    ticketSubmitDoneHandler: function() { // This is called once ticket.submit.done event is fired.
      clearInterval(this.progress);
      this.toggleModal(this.resources.MODAL_CLASS, false);
    },

    saveHookHandler: function() { // This is called once ticket.save is fired.
      this.switchTo('modal');
      this.commentBody = this.comment().text();
      this.toggleModal(this.resources.MODAL_CLASS, true);
      if (this.commentBody === '') {
        this.showWarningDialog();
        return false;
      } else {
        return this.promise(function(done, fail) {
          this.showSubmitProgressBar();
          this.$progressBar = this.$('.bar'); // Use $ to indicate that the variable is an jQuery object.
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

    modalIsHiddenHandler: function() {
      this.sendSearchRequest(this.makeSearchUrl(this.pageNumber)); // Get tickets info on the first page
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
      this.valNow += this.incrementValue;
      var percentage = valNow * 100 / this.resources.VAL_MAX;
      this.$progressBar.width(percentage + '%');
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
      this.$('.alert-block, .modal-footer').toggleClass(this.resources.HIDE_CLASS, isProgressBarOnShown);
      this.$('.progress').toggleClass(this.resources.HIDE_CLASS, !isProgressBarOnShown);
    },

    makeSearchUrl: function(pageNumber) { // This search query searches for all open tickets that are assigned to the current user.
      var query = helpers.fmt('assignee:%@+type:ticket+status:open', this.currentUser().email());
      return helpers.fmt('/api/v2/search.json?page=%@&per_page=%@&query=%@&sort_by=%@&sort_order=%@', pageNumber, this.ticketsPerPage, query, this.resources.SORT_BY, this.resources.SORT_ORDER);
    },

    sendSearchRequest: function(queryUrl) {
      this.switchTo('loading_screen');
      this.ajax('search', queryUrl); // Fire jQuery-like ajax request
    },

    getHighlightPaginationButton: function(btnClass, index) { // Return a jQuery object of the page button to be highlighted
      index = index || 0;
      return this.$(this.makeClassSelector(btnClass)).eq(index).parent();
    },

    highlightCurrentPageNumber: function(btnClass, index) {
      this.getHighlightPaginationButton(btnClass, index)
        .addClass('active');
      console.log('add');
    },

    removeHighlightOnPageNumber: function(btnClass, index) {
      this.getHighlightPaginationButton(btnClass, index)
          .removeClass('active');
      console.log('remove');
    },

    removeOrAddHighlight: function() {
      if (this.previousPageNumber !== this.pageNumber) { // Remove highlight on previously selected page.
        this.removeHighlightOnPageNumber(this.resources.PAGE_NUM_CLASS, this.previousPageNumber - 1);
      }
      this.highlightCurrentPageNumber(this.resources.PAGE_NUM_CLASS, this.pageNumber - 1);
    },

    reorderPageButtons: function() { // Always have at most 7 buttons displayed (2 for nav, 5 for page numbers)
      this.$('.pagi').addClass(this.resources.HIDE_CLASS);
      var extraBelow = this.numOfPageBtnEachSide - (this.totalPages - this.pageNumber), // if we are close to the end, show more pages lower than this.pageNumber
          extraAbove = this.numOfPageBtnEachSide - (this.pageNumber - this.resources.DEFAULT_PAGE_NUM); // if we are close to the start, show more pages greater than this.pageNumber
      extraBelow = (extraBelow > 0) ? extraBelow : 0; // if you're at the last page (9) show extra pages below it (8,7,6,5)
      extraAbove = (extraAbove > 0) ? extraAbove : 0; // if at page 1 show not just 2, 3 but also 4 and 5
      for (var i = this.pageNumber - this.numOfPageBtnEachSide - extraBelow; i <= this.pageNumber + this.numOfPageBtnEachSide + extraAbove; i++) {
        this.$('.' + this.makePagiClassName(i)).removeClass(this.resources.HIDE_CLASS);
      }
    },

    makePagiClassName: function(pageNumber) {
      return 'pagi' + pageNumber;
    },

    makeClassSelector: function(className) {
      return '.' + className;
    }
  };

}());
