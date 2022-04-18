// Starts a Zendesk OAuth flow
function startOAuth(integrationName, subdomain) {
  // Human-readable name for the Zendesk OAuth client
  // ZIS creates this client when you register an integration
  const zendeskOAuthClientName = "zendesk";

  // Human-readable name for the Zendesk OAuth connection
  const zendeskConnectionName = "zendesk";

  let data = JSON.stringify({
    name: zendeskConnectionName,
    oauth_client_name: zendeskOAuthClientName,
    oauth_url_subdomain: subdomain,
    origin_oauth_redirect_url: window.location.href,
    permission_scopes: "read write",
  });

  let request = {
    type: "POST",
    url: "/api/services/zis/connections/oauth/start/" + integrationName,
    contentType: "application/json",
    data: data,
  };

  client.request(request).then(
    function (response) {
      console.log("Zendesk OAuth started");
      authorize(response.redirect_url);
    },
    function (response) {
      console.log("Failed to start Zendesk OAuth: ", response);
    }
  );
}

function authorize(redirectURL) {
  let authWindow = window.open(redirectURL, "_blank");
  setTimeout(watchToken, 1500);
  // Poll token from the newly opened window
  function watchToken() {
    try {
      let params = new URL(authWindow.location.href).searchParams;
      // Cross-origin access will cause an error.
      // When the OAuth flow completes, the authWindow's location
      // redirects back to the same origin.
      // This lets ZIS get the verification token.
      let verificationToken = params.get("verification_token");
      console.log("Established connection to Zendesk");
      authWindow.close();
    } catch (err) {
      console.log(
        "DOM error expected during cross domain authorization: " + err
      );
      setTimeout(watchToken, 500);
    }
  }
}

// startSlackOAuth initiates a Slack OAuth flow
function startSlackOAuth(integrationName, subdomain) {
  let data = JSON.stringify({
    name: "slack", // the name the obtained access token
    oauth_client_name: "slack",
    oauth_url_subdomain: subdomain,
    origin_oauth_redirect_url: window.location.href,
    permission_scopes: "chat:write",
  });

  let request = {
    type: "POST",
    url: "/api/services/zis/connections/oauth/start/" + integrationName,
    contentType: "application/json",
    data: data,
  };

  client.request(request).then(
    function (response) {
      console.log("Slack OAuth started");
      authorize(response.redirect_url);
    },
    function (response) {
      console.log("Failed to start Slack OAuth: ", response);
    }
  );
}
