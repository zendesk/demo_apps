// Install the job spec.
function enableIntegration(integrationName) {
  const jobSpec =
    "zis:" +
    integrationName +
    ":job_spec:post_message_to_slack_on_ticket_creation_job_spec";

  let request = {
    type: "POST",
    url:
      "/api/services/zis/integrations/" +
      integrationName +
      "/job_specs/installation",
    contentType: "application/json",
    data: JSON.stringify([{ name: jobSpec }]),
  };

  return client.request(request).then(
    function () {
      console.log("Integration enabled");
      client.invoke("notify", "Integration enabled");
    },
    function (error) {
      console.log("Failed to enable flow: ", response);
    }
  );
}
