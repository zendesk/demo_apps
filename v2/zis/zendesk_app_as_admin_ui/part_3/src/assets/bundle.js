// upsertBundle upserts the ZIS Bundle
function upsertBundle(integrationKey) {
  const bundle = compileBundle(integrationKey)

  let request = {
    type: "POST",
    url: "/api/services/zis/registry/" + integrationKey + "/bundles",
    contentType: "application/json",
    data: JSON.stringify(bundle)
  };

  return client.request(request).then(
    function(response) {
      console.log("Bundle upserted successfully")
    },
    function(response) {
      console.log("Failed to upsert bundle: ", response)
    }
  );
}

function compileBundle(integrationKey) {
  return {
    zis_template_version: '2019-10-14',
    name: 'RedactSensitiveDetailsOnComments',
    description: 'Redact sensitive details from comments such as email',
    resources: {
      redact_ticket_comment_flow: {
        type: 'ZIS::Flow',
        properties: {
          name: 'redact_ticket_comment',
          definition: {
            StartAt: 'VerifyTicketStatus',
            States: {
              VerifyTicketStatus: {
                Type: 'Action',
                ActionName: 'zis:common:transform:Jq',
                Parameters: {
                  "expr.$": '.ticket_statuses | index(["{{$.input.ticket_event.ticket.status}}"])',
                  data: '{"ticket_statuses": ["new","open","pending","solved","closed"]}'
                },
                ResultPath: '$.ticket_status_index',
                Next: 'IsTicketStatusConfigured'
              },
              IsTicketStatusConfigured: {
                Type: 'Choice',
                Choices: [
                  {
                    Variable: '$.ticket_status_index',
                    NumericGreaterThanEquals: 0,
                    Next: 'RedactConfigs'
                  }
                ],
                Default: 'Done'
              },
              RedactConfigs: {
                Type: 'Action',
                ActionName: 'zis:common:transform:Jq',
                Parameters: {
                  expr: '.items',
                  data: '{"items": [{"name": "email", "regex": "[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+"}]}'
                },
                ResultPath: '$.items',
                Next: 'RedactItems'
              },
              RedactItems: {
                Type: 'Action',
                ActionName: 'zis:common:transform:Jq',
                Parameters: {
                  "expr.$": '[.items[] | (.comment = "{{$.input.ticket_event.comment.body}}") | (.comment_id = "{{$.input.ticket_event.comment.id}}") |' +
                    '(.ticket_id = "{{$.input.ticket_event.ticket.id}}") | (.connection = "{{$.connections.zendesk.access_token}}")]',
                  "data.$": '$'
                },
                ResultPath: '$.items',
                Next: 'RedactComment'
              },
              RedactComment: {
                Type: 'Map',
                ItemsPath: '$.items',
                ResultPath: '$.redacted_description',
                Iterator: {
                  StartAt: 'FindRedactMatch',
                  States: {
                    FindRedactMatch: {
                      Type: 'Action',
                      ActionName: 'zis:common:transform:Jq',
                      Parameters: {
                        "expr.$": '.comment | capture("(?<redact_string>{{$.regex}})"; "gi")',
                        "data.$": '$'
                      },
                      ResultPath: '$.capture',
                      Next: 'RedactStringInComment'
                    },
                    RedactStringInComment: {
                      Type: 'Action',
                      ActionName: "zis:" + integrationKey + ":action:redact_string_in_comment_http_action",
                      Parameters: {
                        "token.$": '$.connection',
                        "ticket_id.$": '$.ticket_id',
                        "comment_id.$": '$.comment_id',
                        "redact_string.$": '$.capture.redact_string'
                      },
                      ResultPath: '$.update_comment_results',
                      Next: 'DoneMap'
                    },
                    DoneMap: {
                      Type: 'Succeed'
                    }
                  }
                },
                End: true
              },
              Done: {
                Type: 'Succeed'
              }
            }
          }
        }
      },
      redact_comment_action: {
        type: 'ZIS::Action::Http',
        properties: {
          name: 'redact_string_in_comment_http_action',
          definition: {
            method: 'PUT',
            url: 'https://{{$.subdomain}}.{{$.zendeskHost}}/api/v2/tickets/{{$.ticket_id}}/comments/{{$.comment_id}}/redact.json',
            headers: [
              {
                key: 'Authorization',
                value: 'Bearer {{$.token}}'
              },
              {
                key: 'Content-Type',
                value: 'application/json'
              }
            ],
            requestBody: {
              text: '{{$.redact_string}}'
            }
          }
        }
      },
      redact_ticket_comment_on_ticket: {
        type: 'ZIS::JobSpec',
        properties: {
          name: 'redact_ticket_comment_job_spec',
          event_source: 'support',
          event_type: 'ticket.CommentAdded',
          flow_name: "zis:" + integrationKey + ":flow:redact_ticket_comment"
        }
      }
    }
  }
}
