(function() {
  return {
    events: {
      // Framework Events
      'app.created':'checkLocalStorage', // Call 'checkLocalStorage' function below
      // Request Events (None)
      // DOM events
      'keyup #inputValueId': function(event){ // User clicked the 'enter'/'return' button so store value in localStorage
        if(event.keyCode === 13)
          return this.processInputValue();
      },
      'click .reset': 'resetValue' // Call 'resetValue' function below
    },
    checkLocalStorage: function () { // Look in localStorage for if value is present for 'exampleString'
        if (this.store('exampleString') === null) { // If no value
          services.notify('<span style="font-size: 14px;">localStorage value not set</span>', 'alert', 8000); // Services notification
          this.switchTo('inputValue'); // Display input field for user to set value of localStorage
        } else { // There is a value already set for 'exampleString' in localStorage
          services.notify('<span style="font-size: 14px;">localStorage value found</span>', 'notice'); // Services notification
          var value = this.store('exampleString'); // Instantiate variable 'value' set to value in localStorage 'exampleString'
          this.switchTo('displayValue', { // Switch to 'displayValue' template
            value: value // Set handlebars.js placeholder 'value' equal to the variable 'value' above
          });
        }
    },
    processInputValue: function() { // Handle value entered into input field in the 'inputValue' template
      var exampleString = this.$('input#inputValueId').val(); // Variable set to value entered into input field
      this.store('exampleString', exampleString); // Value of exampleString for future use
      exampleString = this.$('input#inputValueId').val(''); // Empty input field - visual UX enhancement
      services.notify('<span style="font-size: 14px;">localStorage value set</span>', 'notice'); // Services notification
      var value = this.store('exampleString');
      this.switchTo('displayValue', {
        value: value
      });
    },
    resetValue: function() {
      var empty = null; // Instantiate variable 'empty' set to null 
      this.store('exampleString', empty); // Set value of 'exampleString' in localStorage to 'empty' variable (null)
      services.notify('<span style="font-size: 14px;">localStorage value reset</span>', 'notice'); // Services notification
      this.switchTo('inputValue'); // Display input field for user to set value of localStorage
    }
  };
}());