(function() {

  return {

    requests: {
      sampleRequest: function() {
        return {
          url: 'https://requestb.in/{{setting.requestbin_uri}}?token={{jwt.token}}',
          type: "GET",
          "secure": true,
          "contentType": "application/json",
          jwt: {
            algorithm: 'HS256',
            secret_key: '{{setting.shared_secret}}',
            expiry: 3600, // one hour token expiry
            claims: {
              iss: this.currentAccount().subdomain()
            }
          }
        };
      }
    },

    events: {
      'app.created': 'init'
    },

    init: function() {
      this.ajax('sampleRequest').done(function(data){
        console.log(data);
        //should log 'OK'. Tested using a requestb.in url
      });
    }
  };

}());
