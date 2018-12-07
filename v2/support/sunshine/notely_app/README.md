# Notely

Notely is a sample Zendesk App that allows you to record note events using the Events API.
<img src="./images/screenshot.png" width="400">

## Table of Contents

* [Installing the app as is](#installing-the-app-as-is)
* [Local Development](#local-development)
* [Built With](#built-with)
* [License](#license)

## Installing the app as is

To run the app on your Zendesk subdomain

1. Download the zip of the app
<img src="./images/download.png" width="400">

2. Go to the Zendesk Support Manage Apps page on the Admin Settings page, and click the `Upload private app` button
<img src="./images/manage-apps.png" width="400">

3. Upload the downloaded zip
<img src="./images/upload.png" width="400">

4. Install the app
<img src="./images/install.png" width="400">

## Local Development
Clone the repo and `cd` into the directory
```
git clone git@github.com:zendesk/notely_app.git && cd notely_app
```

Run the local dev server
```
zat server
```

Open a browser and go to your Zendesk subdomain. Append `?zat=true` to the end of your instance's url

<img src="./images/url.png" width="800">

Click the security icon that pops up.

<img src="./images/security.png" width="400">

Click load unsafe scripts

<img src="./images/load-unsafe-scripts.png" width="400">


Happy Developing :)

## Built With

* [Zendesk App Framework](https://developer.zendesk.com/apps/docs/developer-guide/setup)

## License

This project is licensed under the Apache 2.0 License
