(function() {
  
  return {
  
    events: {
      // Framework Events
      'app.created':'checkLocalStorage', // Call 'checkLocalStorage' function below
      
      // Request Events (None)
      
      // DOM events
      'keyup #input-value-id': function(event){ // User clicked the 'enter'/'return' button so store value in localStorage
        if(event.keyCode === 13) {
          return this.processInputValue();
        }
      },
      'click .reset': 'resetValue' // Call 'resetValue' function below
    },

    checkLocalStorage: function () { // Look in localStorage for if value is present for 'exampleString'
        if (this.store('exampleString') === null) {
          
          services.notify('localStorage value not set', 'alert', 500); // Services notification

          this.switchTo('input_value'); // Display input field for user to set value of localStorage

        } else { // There is a value already set for 'exampleString' in localStorage

          services.notify('localStorage value found', 'notice', 500); // Services notification

          var value = this.store('exampleString'); // Instantiate variable 'value' set to value in localStorage 'exampleString'

          this.switchTo('display_value', { // Switch to 'displayValue' template
            value: value // Set handlebars.js placeholder 'value' equal to the variable 'value' above
          });

        }
    },

    processInputValue: function() { // Handle value entered into input field in the 'inputValue' template
      var exampleString = this.$('input#input-value-id').val(); // Variable set to value entered into input field

      this.store('exampleString', exampleString); // Value of exampleString for future use

      exampleString = this.$('input#input-value-id').val(''); // Empty input field - visual UX enhancement

      services.notify('localStorage value set', 'notice', 500); // Services notification

      var value = this.store('exampleString');

      this.switchTo('display_value', {
        value: value
      });

    },

    resetValue: function() {

      this.store('exampleString', null); // Set value of 'exampleString' in localStorage to 'empty' variable (null)

      services.notify('localStorage value reset', 'notice', 500); // Services notification

      this.switchTo('input_value'); // Display input field for user to set value of localStorage

    }

  };

}());