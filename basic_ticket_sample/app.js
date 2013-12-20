(function() {

  return { // the entire app goes inside this return block!
    // listen for API events such as the start of our app, when bits of it get clicked on or when AJAX requests complete
    events: {
      'app.activated':                'initialize', // this event is run once when the app loads and calls the 'initialize' function
      'ticket.collaborators.changed': 'newCCs', // API event fired when the ticket type changes (eg a ticket is marked as an Incident or a Question is changed to a Problem)
      'click .nav-pills .account':    'tabClicked', //switching views within the app
      'click .nav-pills .user':       'tabClicked',
      'click .nav-pills .ticket':     'tabClicked',
      'zd_ui_change .tickettypeset':  'newTicketType', //changing the Zendesk-style menu
      '*.changed':                    'detectedChange' // detects changes in the app's UI
    },

    // This app doesn't make any AJAX requests but they would go here if it did
    requests: {
    },

    initialize: function(data) {// function called when we load or the ticket type is modified
      if (data.firstLoad) {
        this.switchTo('main');
      }
    },

    // UI Events

    // This function is called when the user changes the tab being viewed
    tabClicked: function(data) {
      var clicked = data.currentTarget.className;

      this.$('.active').removeClass('active'); // Toggle the tabs visually
      this.$('.' + clicked).addClass('active');

      switch (clicked) {
        case 'ticket':
          this.generateTicketView();
          break;
        case 'user':
          this.generateUserView();
          break;
        case 'account':
          this.generateAccountView();
          break;
        default:
          break;
      }
    },

    newTicketType: function(data) {// The ticket type has been changed in our app - better change it in Zendesk
      var newType = this.$('.tickettypeset').zdSelectMenu('value'); // note: you can't use all of jQuery here but selectors are OK
      if (this.ticket().type() != newType) {
        this.ticket().type(newType);
      }
    },

    detectedChange: function(data) {
      if (data.propertyName == 'ticket.type' && data.newValue != this.$('.tickettypeset').zdSelectMenu('value')) {
      // The ticket type changed in Zendesk - better change it in our app but not if we initiated the change from the app, that would be an endless loop!
        this.$('.tickettypeset').zdSelectMenu('setValue', data.newValue);
      }
      else if (data.propertyName == 'ticket.collaborators') {
       // We could copy the code out of the newCCs function below and put it here
      }
    },

    newCCs: function(data) {
      // The list of CCs has changed - let's just regenerate everything including our handlebars
      this.generateTicketView();
    },

    generateTicketView: function() {// Draw the 'Ticket' tab
      var ccArray  = [], // this array and analogous ones further down are used because Handlebars won't call functions, so we need to pass in properties
      theTicket    = this.ticket(),
      ticketTypes  = [{name: this.I18n.t('ticket.types.question'), value: 'question'},
                      {name: this.I18n.t('ticket.types.problem'),  value: 'problem'},
                      {name: this.I18n.t('ticket.types.incident'), value: 'incident'},
                      {name: this.I18n.t('ticket.types.task'),     value: 'task'}];

      _.each(theTicket.collaborators(), function(collaborator, key, list) {
        this[key]       = {email: '', role: ''};
        this[key].email = collaborator.email(); // .email() is the function call we are replacing with the .email property
        this[key].role  = collaborator.role() ? collaborator.role() : 'Not registered';
       }, ccArray);

      this.switchTo('ticket', { // render the ticket.hdbs template
        ticketType:     theTicket.type(),
        ticketSubject:  theTicket.subject(),
        ticketTypes:    ticketTypes,
        ticketCCs:      ccArray
      });

      this.$('.tickettypeset').zdSelectMenu('setValue', theTicket.type()); // initialise the Zendesk-stype dropdown to the actual value
    },

    generateUserView: function() {// draw the User tab
      var groupArray = [], // this is similar to ccArray in the ticket view - check out the underscore library at http://underscorejs.org
      theUser        = this.currentUser(),
      userRoles      = [{name: this.I18n.t('agent.roles.end-user'), value: 'end-user'},
                        {name: this.I18n.t('agent.roles.agent'),    value: 'agent'},
                        {name: this.I18n.t('agent.roles.admin'),    value: 'admin'},
                        {name: this.I18n.t('agent.roles.other'),    value: 'other'}];

      _.each(theUser.groups(), function(group, key) {
        this[key]       = {group: '', id: ''};
        this[key].group = group.name();
        this[key].id    = group.id();
      }, groupArray);

      this.switchTo('user', {
        uid:        theUser.id(),
        uemail:     theUser.email(),
        uname:      theUser.name(),
        urole:      theUser.role(),
        ugroups:    groupArray,
        uexternid:  theUser.externalId(),
        userRoles:  userRoles
      });
      for (var i = 0; i < userRoles.length; i++) {// bold the corrent role
        if (theUser.role() == userRoles[i].value || i == userRoles.length-1) {
          var role_text = '<strong>' + this.$('.userroleget').find('li')[i].innerHTML + '</strong>';
          this.$('.userroleget').find('li')[i].innerHTML = role_text;
          break;
        }
      }
    },

    generateAccountView: function() {
      var the_account = this.currentAccount();
      this.switchTo('account', {
        id:         the_account.id() ? the_account.id() : 'None',
        subdomain:  the_account.subdomain()
      });
    }
  };

}());
