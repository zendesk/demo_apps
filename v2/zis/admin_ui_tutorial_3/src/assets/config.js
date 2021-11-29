// configScope is a custom defined key for referencing the configuration data
let configScope = "slackNotification";

// scopeExists is a boolean flag to indicate if the config data exists
// for a given scope
let scopeExists = false;

// fetchConfig defines the function to fetch config data
function fetchConfig(integrationKey) {
  // Fetch config request
  let request = {
    type: "GET",
    url: "/api/services/zis/integrations/" + integrationKey +
      "/configs?filter[scope]=" + configScope
  };

  client.request(request).then(
    function(response) {
      console.log("Config fetched successfully: ", response.configs[0].config)
      scopeExists = true;
      updateComponents(response.configs[0].config);
    },
    function(response) {
      console.log("Config fetching failed: ", response)
      if (response.status == 404) {
        scopeExists = false;
      }
    }
  );
}

// submitConfig maps the data from DOM and submit through ZIS Configs API
function submitConfig(integrationKey) {
  // Prepare the config payload
  let data = JSON.stringify({
    scope: configScope,
    config: {
      priority: $("#select-priority").val(),
      channel: $("#txt-channel").val()
    }
  });

  // The request is for create or update config data
  let request;

  if (scopeExists) {
    // request for update config
    request = {
      type: "PUT",
      url: "/api/services/zis/integrations/" + integrationKey + "/configs/" + configScope,
      contentType: "application/json",
      data: data
    };
  } else {
    // request for create config
    request = {
      type: "POST",
      url: "/api/services/zis/integrations/" + integrationKey + "/configs",
      contentType: "application/json",
      data: data
    };
  }

  client.request(request).then(
    function(response) {
      console.log("Config submitted successfully: ", response);
      client.invoke('notify', "Submitted successfully");
      scopeExists = true;
    },
    function(response) {
      console.log("Config submission failed: ", response);
    }
  );
}

// updateComponents updates the UI components with the newly fetched config data
function updateComponents(config) {
  console.log("Updating components with config: ", config);
  $("#select-priority").val(config.priority);
  $("#txt-channel").val(config.channel);
}
