(function() {

  return {

    events: {
      'app.activated':'initialize', // this event is run once when the app loads and calls the 'initialize' function
      '*.changed': 'detectedChange', // this event runs when there is a change in the ticket fields
      'click .nav-pills .showhide': 'initialize',
      'click .nav-pills .newchange': 'detectedChange',
      'click input': 'checkboxClicked',
      'click .aenable': 'enableClicked',
      'click .adisable': 'enableClicked'
    },

    initialize: function(event) { // function called when we load
      var fields = this.ticketFields().map(function(field) {
        return {  fieldname: field.name(),
                  label:     field.label(),
                  visible:   field.isVisible() ? 'checked="checked"' : ''};
      });
      this.switchTo('showhide', {fields: fields});
    },

    /* UI Events */

    detectedChange: function(event)
    {
      var property,
          newvalue;
      if (event.type == 'click')
      {
        property = null;
        newvalue = null;
      }
      else
      {
        property = event.propertyName;
        newvalue = event.newValue;
      }
      this.switchTo('newchange', {property: property, newvalue: newvalue});
    },

    checkboxClicked: function(event)
    {
      var fieldName = event.currentTarget.parentElement.parentElement.className,
          isVisible = event.currentTarget.checked,
          field     = this.ticketFields(fieldName);

      if (isVisible)
      {
        field.show();
      }
      else
      {
        field.hide();
      }
    },

    enableClicked: function(event)
    {
      var fieldName = event.currentTarget.parentElement.parentElement.className,
          field     = this.ticketFields(fieldName);

      if (event.currentTarget.className == 'aenable')
      {
        field.enable();
      }
      else
      {
        field.disable();
      }
    }
  };

}());
