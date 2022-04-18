:warning: *Use of this software is subject to important terms and conditions as set forth in the License file* :warning:

## Zendesk Integration Services (ZIS) example apps

This sample app provides a user interface (UI) for a Zendesk integration for
Slack.

The integration listens for [Ticket
Created](https://developer.zendesk.com/api-reference/integration-services/trigger-events/ticket-events/#ticket-created)
events in Zendesk. When it detects an event with a specific ticket priority, the
integration will post a related message to a provided Slack channel.

The app's UI lets admins connect the integration to their Zendesk and Slack
instances. The app also lets admins configure settings for the integration.
The app uses Zendesk Integration Services (ZIS) APIs to manage the
connections and configurations.

For more information, refer to the [related tutorial
series](https://developer.zendesk.com/documentation/integration-services/zis-tutorials/zendesk-app-admin-interface/app-oauth/)
on the Zendesk Developer portal.