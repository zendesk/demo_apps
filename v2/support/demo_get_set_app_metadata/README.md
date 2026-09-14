# Test getting and setting Zendesk Apps framework metadata

This demo ticket sidebar app creates two app setting -- *enable_role_restriction* and *form_name*. When the app is displayed, the user can set and get app setting values.

*This app is not officially supported by Zendesk. It is strictly for demonstration purposes.*

## Getting
Uses [client.metadata()](https://developer.zendesk.com/apps/docs/core-api/client_api#client.metadata)

## Setting
Uses [PUT /api/v2/apps/installations/{id}.json API](https://developer.zendesk.com/rest_api/docs/support/apps#update-app-installation)

## NOTE:
* This app also demonstrates setting up parameters in the [en.json file](https://developer.zendesk.com/apps/docs/developer-guide/deploying#app-internationalization), which are used to customize the app's Install form
* Despite the app successfully updating metadata/setting values, because these values are cached by ZAF at app load time, you need to do an app refresh. This reloads the app and gets the updated values via subsequent client.metadata() calls.
* PUT /api/v2/apps/installations/{id}.json API requires administrator rights. Agent level users cannot call this API.