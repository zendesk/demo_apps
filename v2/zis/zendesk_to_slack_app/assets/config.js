// configScope is a custom defined key for referencing the configuration data
let configScope = "slackNotification";

// Indicates whether config data exists for slackNotification
let scopeExists = false;

// fetchConfig defines the function to fetch config data
function fetchConfig(integrationName) {
  // Fetch config request
  let request = {
    type: "GET",
    url:
      "/api/services/zis/integrations/" +
      integrationName +
      "/configs?filter[scope]=" +
      configScope,
  };

  client.request(request).then(
    function (response) {
      console.log("Config fetched: ", response.configs[0].config);
      scopeExists = true;
      updateComponents(response.configs[0].config);
    },
    function (response) {
      console.log("Config fetching failed: ", response);
      if (response.status == 404) {
        scopeExists = false;
      }
    }
  );
}

// submitConfig maps the data from DOM and submit through ZIS Configs API
function submitConfig(integrationName) {
  // Prepare the config payload
  let data = JSON.stringify({
    scope: configScope,
    config: {
      priority: document.getElementById("select-priority").value,
      channel: document.getElementById("txt-channel").value,
    },
  });

  // The request is for create or update config data
  let request;

  if (scopeExists) {
    // request for update config
    request = {
      type: "PUT",
      url:
        "/api/services/zis/integrations/" +
        integrationName +
        "/configs/" +
        configScope,
      contentType: "application/json",
      data: data,
    };
  } else {
    // request for create config
    request = {
      type: "POST",
      url: "/api/services/zis/integrations/" + integrationName + "/configs",
      contentType: "application/json",
      data: data,
    };
  }

  client.request(request).then(
    function (response) {
      console.log("Config saved: ", response);
      client.invoke("notify", "Config saved");
      scopeExists = true;
    },
    function (response) {
      console.log("Config submission failed: ", response);
    }
  );
}

// updateComponents updates the UI components with the newly fetched config data
function updateComponents(config) {
  console.log("Updating components with config: ", config);
  document.getElementById("select-priority").value = config.priority;
  document.getElementById("txt-channel").value = config.channel;
}
