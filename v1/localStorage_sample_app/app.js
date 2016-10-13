(function() {

  return {

    events: {
      'app.created':'demoFunction'
    },

    demoFunction: function() {

      console.log('--- demoFunction (start) ---');

      var exampleObject = { 'exampleKey': 'exampleValue' }; // Set variable exampleObject to object

      this.store('exampleObject', exampleObject); // set value of 'exampleObject' to 'exampleValue' - save to localStorage
      
      console.log('\'exampleObject\':');

      console.log(this.store('exampleObject')); // print 'exampleObject' object to browser console

      var exampleString = 'hello world'; // Set variable exampleVariable to string
      
      this.store('exampleString', exampleString); // set value of 'exampleVariable' to 'exampleValue' - save to localStorage
      
      console.log('\'exampleString\':');
      
      console.log(this.store('exampleString')); // print 'exampleVariable' string to browser console
      
      console.log('--- demoFunction (end) ---');

    }

  };

}());