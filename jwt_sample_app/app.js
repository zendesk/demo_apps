(function() {

  return {

    requests: {
      sampleRequest: function() {
        return {
          url: 'https://{{setting.url}}?token={{jwt.token}}',
          type: "GET",
          "secure": true,
          "contentType": "application/json",
          jwt: {
            algorithm: 'HS256',
            secret_key: '{{setting.shared_secret}}',
            expiry: 3600, // one hour token expiry
            claims: {
              iss: '{{setting.url}}'
            }
          }
        };
      }
    },

    events: {
      'app.activated':'init'
    },

    init: function() {
      this.ajax('sampleRequest').done(function(data){
        console.log(data);
        //should log 'OK'. Tested using a requestb.in url
      });
    }
  };

}());
