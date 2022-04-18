// Bootstrap the app when the DOM is ready
(function () {
  // Initialize the Zendesk JavaScript API client
  // https://developer.zendesk.com/apps/docs/developer-guide/getting_started
  window.client = ZAFClient.init();

  // OAuth flow kick-off requires a subdomain
  let subdomain = undefined;

  // Integration name is the unique identifier for your integration app
  let integrationName = undefined;

  client
    .context()
    .then(function (context) {
      // Derive subdomain & integration name
      subdomain = context["account"]["subdomain"];
      integrationName = subdomain + "_zendesk_to_slack";
    })
    .then(function () {
      // Bind button to start a Zendesk OAuth flow
      document
        .getElementById("btnConnect")
        .addEventListener("click", function () {
          startOAuth(integrationName, subdomain);
        });

      // Bind button to start a Slack OAuth flow
      document
        .getElementById("btnConnectSlack")
        .addEventListener("click", function () {
          startSlackOAuth(integrationName, subdomain);
        });

      // Bind button to submit config
      document.getElementById("submit").addEventListener("click", function () {
        submitConfig(integrationName);
      });

      // Fetch configuration data and display in UI
      fetchConfig(integrationName);

      // Bind button to install the job spec
      document
        .getElementById("btnEnableIntegration")
        .addEventListener("click", function () {
          enableIntegration(integrationName);
        });
    });
})();
