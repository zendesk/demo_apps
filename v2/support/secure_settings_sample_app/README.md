# Secure Settings Example App

This sample app shows how to add Secure Settings to an app. "Secure Settings" is a neat feature that allows your App to pass a secure setting via the proxy that is invisible to normal agents.  Detailed documentation regarding this feature can be found here: https://developer.zendesk.com/apps/docs/developer-guide/using_sdk#using-secure-settings .

In particular, this App uses a secure setting to store a token for https://thecatapi.com/ which is required for making api requests.  To get such a key, you will need to sign up for an account, and then grab your api key from the signup email.

On installation the account admin should paste this key into the "catering_token" field.

The app will parse a single response from thecatapi and render it as an image within the app's iframe.  The request made is a GET request to /images/search per https://documenter.getpostman.com/view/4016432/RWToRJCq .

In particular, it will make this request:

curl --request GET \
  --url 'https://api.thecatapi.com/v1/images/search?format=json' \
  --header 'Content-Type: application/json' \
  --header 'x-api-key: {{catering_token}}'

### Screenshot(s):

None as yet!
