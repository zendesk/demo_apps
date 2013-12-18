/*global FormData*/
(function() {

  return { // the entire app goes inside this returh block!
    // listen for API events such as the start of our app, when bits of it get clicked on or when AJAX requests complete
    events: {
      'app.activated':'initialize', // this event is run once when the app loads and calls the 'initialize' function
      'ticket.type.changed':'initialize', // API event fired when the ticket type changes (eg a ticket is marked as an Incident or a Question is changed to a Problem)
      'click .demoapp_tab':'tabClicked', //switching views within the app
      'zd_change #tickettypeset':'newTicketType', //changing the Zendesk-style menu
      '*.changed': 'detectedChange' // detects changes in the app's UI
    },

    requests: {
    },

    initialize: function(data) 
    { // function called when we load or the ticket type is modified
      var self = this;
      if (data.firstLoad) {
        self.switchTo('main');
      }
    },

    /* UI Events */
    tabClicked: function(data) 
    {
      var clicked = data.currentTarget.id;

      this.$('.active').toggleClass('active');
      this.$('#' + clicked).toggleClass('active');

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

    newTicketType: function(data) 
    {
      var newType = this.$('#'+data.namespace).data('menu').value;
      newType = newType.toLowerCase();
      data.preventDefault();
      if (this.ticket().type() != newType) {
      console.log('new type: ' + newType);
      this.ticket().type(newType.toLowerCase());
      }
    },

    detectedChange: function(data)
    {
      if (data.propertyName == 'ticket.type' && data.newValue != this.$('.tickettypeset').data('menu').value)
      {
        console.log('Changing dropdown in app to: ' + data.newValue);
        this.$('.tickettypeset').data('menu').setValue(data.newValue);
      }
      if (data.propertyName == 'ticket.collaborators')
      {
        console.log('Change to collaborators');
        this.generateTicketView();
      }
    },

    generateTicketView: function()
    {
      var the_ticket = this.ticket();
        var ticketTypes = [{name: this.I18n.t('ticket.types.question'), value: 'question'},
                           {name: this.I18n.t('ticket.types.problem'), value: 'problem'},
                           {name: this.I18n.t('ticket.types.incident'), value: 'incident'},
                           {name: this.I18n.t('ticket.types.task'), value: 'task'}];

        var ccArray = [];
        _.each(the_ticket.collaborators(), function(collaborator, key, list) {
          this[key] = {email: "", role: ""};
          this[key]["email"]=collaborator.email();
          this[key]["role"]=collaborator.role() ? collaborator.role() : "Not registered";
        }, ccArray);

        this.switchTo('ticket', {
          ticketType: the_ticket.type(),
          ticketSubject: the_ticket.subject(),
          ticketTypes: ticketTypes,
          ticketCCs: ccArray
        });

        this.$('.tickettypeset').data('menu').setValue(the_ticket.type());
        this.$('.tickettypeset').data('menu').addObserver('change',this.newTicketType.bind(this));
    },

    generateUserView: function()
    {
      var the_user = this.currentUser();
      var userRoles = [{name: this.I18n.t('agent.roles.end-user'), value: 'end-user'},
                       {name: this.I18n.t('agent.roles.agent'), value: 'agent'},
                       {name: this.I18n.t('agent.roles.admin'), value: 'admin'},
                       {name: this.I18n.t('agent.roles.other'), value: 'other'}];

      var groupArray = [];
        _.each(the_user.groups(), function(group, key, list) {
          this[key] = {group: "", id: ""};
          this[key]["group"]=group.name();
          this[key]["id"]=group.id();
        }, groupArray);

        this.switchTo('user', {
          uid: the_user.id(),
          uemail: the_user.email(),
          uname: the_user.name(),
          urole: the_user.role(),
          ugroups: groupArray,
          uexternid: the_user.externalId(),
          userRoles: userRoles
        });
        for (var i =0; i < userRoles.length; i++)
        {
          if (the_user.role() == userRoles[i].value || i == userRoles.length-1)
          {
            var role_text = this.$('.userroleget').find('li')[i].innerHTML;
            role_text = '<strong>' + role_text + '</strong>';
            this.$('.userroleget').find('li')[i].innerHTML = role_text;
            break;
          }
        }
    },

    generateAccountView: function()
    {
      var the_account = this.currentAccount();
      this.switchTo('account', {
        id: the_account.id(),
        subdomain: the_account.subdomain()
      });
    }
  };

}());
