// installFlow enable the workflow on the current Zendesk account.
// The underlying concept of JobSpec is used to associate a workflow with a
// triggering event.
function installFlow(integrationKey) {
  const jobSpec = "zis:" + integrationKey + ":job_spec:post_message_to_slack_on_ticket_created_job_spec"

  let request = {
    type: "POST",
    url: "/api/services/zis/integrations/" + integrationKey + "/job_specs/installation",
    contentType: "application/json",
    data: JSON.stringify([{ "name": jobSpec }])
  };

  return client.request(request).then(
    function(response) {
      console.log("Flow enabled successfully")
    },
    function(response) {
      console.log("Failed to enable flow: ", response)
    }
  );
}
