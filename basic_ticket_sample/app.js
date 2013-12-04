/*global FormData*/
(function() {

  return { // the entire app goes inside this returh block!
    // listen for API events such as the start of our app, when bits of it get clicked on or when AJAX requests complete
    events: {
      'app.activated':'initialize', // this event is run once when the app loads and calls the 'initialize' function
      'ticket.type.changed':'initialize', // API event fired when the ticket type changes (eg a ticket is marked as an Incident or a Question is changed to a Problem)
      'click .demoapp_button':'buttonClicked',
      'zd_change #tickettypeset':'newTicketType',
      'click #apitestbutton':'testButtonClicked',
      'analyseText.done':'reportAnalysis',
      'analyseText.fail':'analysisFailed',
      '*.changed': 'detectedChange'

    },

    requests: {
      analyseText: function(text) {
        return {
          url: 'http://textalyser.net/index.php?lang=en',
          type: 'POST',
          data: text,
          contentType: false,
          processData: false,
          /*url: 'http://www.zombo.com/',
          type: 'GET'*/
        };
      }

    },

    initialize: function(data) { // function called when we load or the ticket type is modified
          var self = this;
          var templateData = {
            type_label:        self.getTypeLabel(),
            type_is_visible:   self.isTypeVisible(),
            type_is_required:  self.isTypeRequired(),
            type_options:      self.getTypeOptions(),
            status_is_visible: self.getStatusVisible(),
            status_options:    self.getStatusOptions()
          };
        if(data.firstLoad) {
          self.switchTo('main', templateData);
        }
    },

        /* GETTERS */

    getTypeLabel: function() {
      return this.ticketFields("type").label();
    },

    isTypeVisible: function() {
      return this.ticketFields("type").isVisible() ? 'Yes' : 'No';
    },

    isTypeDisabled: function() {
      // To be implemented
    },

    isTypeRequired: function() {
      return this.ticketFields("type").isRequired() ? 'Yes' : 'No';
    },

    getTypeOptions: function() {
      var options = this.ticketFields("type").options(),
          labels  = [];

      options.forEach(function(element) {
          labels.push(element.label());
        }
      );

      return labels;
    },

    getStatusVisible: function() {
      return this.ticketFields("status").isVisible() ? 'Yes' : 'No';
    },

    getStatusDisabled: function() {
      // To be implemented
    },

    getStatusOptions: function() {
      var options = this.ticketFields("status").options(),
          labels  = [];

      options.forEach(function(element) {
          labels.push(element.label());
        }
      );

      return labels;
    },

    /* UI Events */
    buttonClicked: function(data) {
      var clicked = data.currentTarget.id;
      this.$('.active').toggleClass('active');
      this.$('#'+clicked).toggleClass('active');
      switch (clicked)
      {
        case 'ticket':
        this.switchTo('ticket', {
          ticketType: this.ticket().type(),
          ticketSubject: this.ticket().subject(),
          ticketTypes: ['Question', 'Problem', 'Incident', 'Task']
        });
        this.$('.tickettypeset').data('menu').addObserver('change',this.newTicketType.bind(this));
        break;
        case 'user':
        var the_user = this.currentUser();
        this.switchTo('user', { uid: the_user.id(), uemail: the_user.email(), 
          uname: the_user.name(), urole: the_user.role(), 
          ugroups: the_user.groups(), uexternid: the_user.externalId() });
        break;
        case 'account':
        break;
        default:
        break;
      }
      },
    newTicketType: function(data) {
      var newType = this.$('#'+data.namespace).data('menu').value;
      data.preventDefault();
      console.log('new type: ' + newType);
      debugger;
      this.ticket().type(newType.toLowerCase());
    },
    testButtonClicked: function()
    {
      var formData = new FormData();
      formData.append('text_main',this.ticket().description()+"");
      formData.append('site_to_analyze','http://');
      formData.append('file_to_analyze',null,"");
      formData.append('min_char','3');
      formData.append('special_word',null);
      formData.append('words_toanalyse','10');
      formData.append('count_numbers','1');
      formData.append('is_log','1');
      formData.append('stoplist_lang','1');
      formData.append('stoplist_perso',null);
      console.dir(formData);
      this.ajax('analyseText',formData);
    },
    reportAnalysis: function(data)
    {
    console.log('Analysis succeeded');
    console.dir(data);
    var searchString = '<tr><td>Readability  (Gunning-Fog Index) : <span class="quote">(6-easy 20-hard)</span></td><td>';
    var preStart = data.indexOf(searchString);
    var start = preStart + searchString.length;
    var end = data.indexOf('<',start);
    var readability = data.substring(start,end);
    this.$('.gfIndex')[0].innerHTML='<br /><strong>Ticket readability</strong> (6 = easiest, 20 = hardest): ' + readability;
    },
    analysisFailed: function(jqXHR, textStatus, errorThrown)
    {
      console.log('Analysis failed');
      console.dir(jqXHR);
      debugger;
    },
    detectedChange: function(data)
    {
      if (data.propertyName == 'ticket.type')
      {
        
      }
    }
  };

}());
