// Bootstrap the app when DOM is ready
$(function() {
  // Initialise the Zendesk JavaScript API client
  // https://developer.zendesk.com/apps/docs/developer-guide/getting_started
  window.client = ZAFClient.init();

  // Subdomain is required to kick-off OAuth flow. See: connect.js
  let subdomain = undefined;

  // Integration key is the unique identifier for your integration app
  let integrationKey = undefined;

  client.context().then(function(context) {
    // Derive subdomain & integration key
    subdomain = context['account']['subdomain']
    integrationKey = subdomain + "_zis_tutorial"
    console.log("Integration key: " + integrationKey);
  }).then(function() {
    // Bind button to start OAuth flow
    $("#btnConnect").click(function() { startOAuth(integrationKey, subdomain) });

    // Bind button to start Slack OAuth flow
    $("#btnConnectSlack").click(function() { startSlackOAuth(integrationKey, subdomain) });

    // Bind button to install the Flow
    $("#btnInstallFlow").click(function() { installFlow(integrationKey) });

    // Bind button to submit config
    $("#submit").click(function() { submitConfig(integrationKey) });

    // Fetch configuration data and render on UI
    fetchConfig(integrationKey);
  });
});
