(function() {

  return {

    events: {
      'app.activated':'initialize', // this event is run once when the app loads and calls the 'initialize' function
      '*.changed': 'detectedChange', // this event runs when there is a change in the ticket fields
      'click .nav-pills .showhide': 'initialize',
      'click .nav-pills .newchange': 'detectedChange',
      'click input': 'checkboxClicked',
      'click .enable': 'enableClicked',
      'click .collapse': 'collapseClicked'
    },

    initialize: function(event) { // function called when we load
      var options   = null,
          nooptions = null,
          fields    = this.ticketFields().map(
            function(field) {

              try {
                field.options();
              }
              catch(e) {
                nooptions = field.name();
              }

              if ( nooptions != field.name() ) { // we have some options to fetch and make into a nice array
                options = field.options().map(
                  function(option) {
                    console.log('option: ' + option.label() + '\nVisible: ' + option.isVisible());
                    return { label:       option.label(),
                             value:       option.value(),
                             enableText:  option.isEnabled() ? this.I18n.t('showhide.disable') : this.I18n.t('showhide.enable'),
                             oVisible:    option.isVisible()};
                  }, this);
              } else {
                options = null;
              }

              return {  fieldname: field.name(),
                        label:     field.label(),
                        visible:   field.isVisible() ? 'checked=checked' : '',
                        options:   options, // either null or the options we nested in here
                        collapse:  options ? '<td><a class="collapse ' + field.name() + '">+</a></td>':'<td></td>' };
            }, this);

      this.switchTo('showhide', {fields: fields});
    },

    /* UI Events */

    detectedChange: function(event) { // something has triggered our *.changed observer for the ticket!
      var property,
          newvalue;
      if (event.type == 'click') {
        property = null;
        newvalue = null;
      } else {
        property = event.propertyName;
        newvalue = event.newValue;
      }
      this.switchTo('newchange', {property: property, newvalue: newvalue});
    },

    checkboxClicked: function(event) { // one of the checkboxes has been clicked
      var targetField = this.findMe(event, this),
      isVisible  = targetField.isVisible();

      if (isVisible) {
        targetField.hide();
      } else {
        targetField.show();
      }
    },

    enableClicked: function(event) { // An enable or disable button was clicked
      var targetField = this.findMe(event, this),
          action = this.findAction(event.currentTarget, this);

      if (action == 'Enable') {
        targetField.enable();
      } else {
        targetField.disable();
      }
    },

    collapseClicked: function(event) { // Hide or show the options associated with a dropdown box
      if (event.currentTarget.innerText == '-') {
        this.$('tr.option.' + event.currentTarget.classList[1]).hide('slow');
        event.currentTarget.innerText = '+';
      } else {
        this.$('tr.option.' + event.currentTarget.classList[1]).show();
        event.currentTarget.innerText = '-';
      }
    },

    /* Utility Functions */

    findMe: function(event, self) { // Get a 'handle' to the field or option we want
      var fieldList = event.currentTarget.parentElement.parentElement.classList,
          optionValue, fieldName;

      if(fieldList.contains('option')) {
        optionValue = fieldList[0];
        fieldName   = fieldList[1];
        return self.ticketFields(fieldName).options([optionValue]);
      } else {    // Not an option - must be a field

        fieldName = fieldList[0];
        return self.ticketFields(fieldName);
      }
    },

    findAction: function(clickTarget, self) { // figure out what we want to do - enable or disable?
      switch (clickTarget.tagName) {
        case 'INPUT':
          if (clickTarget.type == 'checkbox') { // We could theoretically use the checkbox status to see if we want to enable or disable.
            return clickTarget.checked;         // Alternatively, we could use a toggle function. In this app we just use ticketFieldOption.isVisible()
          }
          break;
          case 'A':
            if (clickTarget.innerText == self.I18n.t('showhide.enable')) {
              if (clickTarget.classList.contains('toggle')) {
                clickTarget.innerText = self.I18n.t('showhide.disable');
              }
              return 'Enable';
            } else {
              if (clickTarget.classList.contains('toggle')) {
                clickTarget.innerText = self.I18n.t('showhide.enable');
              }
              return 'Disable';
            }
            break;
        default:
          break;
      }
    }
  };

}());
