(function() {

  return { // the entire app goes inside this return block!
    // listen for API events such as the start of our app, when bits of it get clicked on or when AJAX requests complete
    events: {
      'app.activated':                'initialize', // this event runs when the app activates - for sidebar apps, whenever the user navigates to a location the app exists
      'ticket.collaborators.changed': 'newCCs', // API event fired when the ticket type changes (eg a ticket is marked as an Incident or a Question is changed to a Problem)
      'click .nav-pills .account':    'tabClicked', // DOM event fired when the user clicks an option on the account tab
      'click .nav-pills .user':       'tabClicked',
      'click .nav-pills .ticket':     'tabClicked',
      'zd_ui_change .tickettypeset':  'newTicketType', // changing the Zendesk-style menu
      '*.changed':                    'detectedChange' // fires when ticket properties change
    },

    // This app doesn't make any AJAX requests but they would go here if it did
    requests: {
    },

    initialize: function(data) { // function called when we load
      if (data.firstLoad) {
        this.switchTo('main');
      }
    },

    // UI Events

    // This function is called when the user changes the tab being viewed
    tabClicked: function(event) {
      this.$('.active').removeClass('active'); // Toggle the tabs visually
      this.$(event.currentTarget).addClass('active');

      switch (event.currentTarget.classList[0]) {
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

    newTicketType: function() { // The ticket type has been changed in our app - better change it in Zendesk
      var newType = this.$('.tickettypeset').zdSelectMenu('value'); // note: you can't use all of jQuery here but selectors are OK
      if (this.ticket().type() != newType) {
        this.ticket().type(newType);
      }
    },

    detectedChange: function(event) {
      if (event.propertyName == 'ticket.type' && event.newValue != this.$('.tickettypeset').zdSelectMenu('value')) {
      // The ticket type changed in Zendesk - better change it in our app but not if we initiated the change from the app, that would be an endless loop!
        this.$('.tickettypeset').zdSelectMenu('setValue', event.newValue);
      }
      else if (event.propertyName == 'ticket.collaborators') {
       // We could copy the code out of the newCCs function below and put it here
      }
    },

    newCCs: function() {
      // The list of CCs has changed - let's just regenerate everything including our handlebars
      this.generateTicketView();
    },

    generateTicketView: function() { // Draw the 'Ticket' tab
      var ccArray  = [], // this array and analogous ones further down are used because Handlebars won't call functions, so we need to pass in properties
      ticket    = this.ticket(),
      ticketTypes  = ['question', 'problem', 'incident', 'task'].map(function(type) {
        return { name: this.I18n.t('ticket.types.' + type), value: type };
      }.bind(this)); // NOTE: In the user tab, we have a similar menu to this in the templates/user.hdbs file statically

      _.each(ticket.collaborators(), function(collaborator) {
        ccArray.push({
          email: collaborator.email(), // .email() is the function call we are replacing with the .email property
          role:  collaborator.role() || 'Not registered'
        });
      });

      this.switchTo('ticket', { // render the ticket.hdbs template
        ticketType:     ticket.type(),
        ticketSubject:  ticket.subject(),
        ticketTypes:    ticketTypes,
        ticketCCs:      ccArray
      });

      this.$('.tickettypeset').zdSelectMenu('setValue', ticket.type()); // initialise the Zendesk-style dropdown to the actual value
    },

    generateUserView: function() { // draw the User tab
      var groupArray = [], // this is similar to ccArray in the ticket view - check out the underscore library at http://underscorejs.org
      user        = this.currentUser(),
      userRole       = user.role(),
      roleToSelect, roleSelector;

      _.each(user.groups(), function(group, key) {
        this[key]       = {group: '', id: ''};
        this[key].group = group.name();
        this[key].id    = group.id();
      }, groupArray);

      this.switchTo('user', {
        uid:        user.id(),
        uemail:     user.email(),
        uname:      user.name(),
        urole:      userRole,
        ugroups:    groupArray,
        uexternid:  user.externalId()
      });

      // Bold the agent's role:
      roleToSelect = _.isNumber(userRole) ? 'other' : userRole;
      roleSelector = helpers.fmt('li[data-role=%@]', roleToSelect);

      this.$('.userroleget').find(roleSelector).css('font-weight', 'bold');
    },

    generateAccountView: function() {
      var theAccount = this.currentAccount();
      this.switchTo('account', {
        id:         theAccount.id() || 'None',
        subdomain:  theAccount.subdomain()
      });
    }
  };

}());
