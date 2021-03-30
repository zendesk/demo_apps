  
## Building your first React Sell Custom Objects app - Part 1: Laying the groundwork    
 In this tutorial series, we will walk you through a simple Zendesk Sell Custom Objects showcase application.  
The app will use [Sunshine Custom Objects API](https://developer.zendesk.com/rest_api/docs/sunshine/custom_objects_api) in order to interact with Custom Objects resources management.  
This part of the tutorial covers the following steps:    
    
1. [Product requirements](#product-requirements)
2. [Planning the app](#planning-the-app)
3. [Using the showcase template](#using-the-showcase-template)
4. [Development requirements](#development-requirements)
5. [Installing dependencies](#installing-dependencies)
6. [Installing the Zendesk CLI](#installing-zcli)
7. [Quick app files overview](#app-files-overview)    
    
The other tutorials in the series teach you how to build and install the app:    
- Part 1: Laying the groundwork - YOU ARE HERE
- [Part 2: Running the showcase app locally](https://develop.zendesk.com/hc/en-us/articles/...) 
- [Part 3: Implementation details](...)
- [Part 4: Installing the app in Sell](...) 
    
Because the tutorials build upon each other, it's recommended you tackle them in order and finish each tutorial before moving on to the next one.    
        
**Note**: Zendesk provides this article for instructional purposes only. Zendesk does not provide support for the content. Please post any issue in the comments section below or in the [Zendesk Apps community](https://develop.zendesk.com/hc/en-us/community/topics/...), or search for a solution online.    
    
<h3 id="product-requirements">1. Product requirements</h3>    
 Before we dive into the tutorial, we need to make sure you have required products on your account:    
    
1. Zendesk Sell on `Team/Professional/Enterprise/Elite` plan    
2. Zendesk Support with enabled `Sunshine Custom Objects`    
 ****Enabling `Sunshine Custom Objects`****    
 Custom Objects are available on all Zendesk Suite plans. If you're interested in becoming a Zendesk developer partner, you can convert a trial account into a sponsored Zendesk Support account. See [Getting a trial or sponsored account for development](https://develop.zendesk.com/hc/en-us/articles/360000036968) for more details.    
    
Custom Objects must be enabled by an administrator in Zendesk Support. If you're not an admin, ask one to enable them for you.    
    
To enable custom objects in your account:    
1. In Zendesk Support, click the Zendesk Products icon (<img src="https://zen-marketing-documentation.s3.amazonaws.com/docs/en/admin_center_product_icon.png" alt="Person card location" width="15"/>) in the top bar, then select Admin Center on the lower side of the pop-up box.  
<img src="https://zen-marketing-documentation.s3.amazonaws.com/docs/en/admin_center_product_menu.png" alt="Admin center product menu" width="400"/>
2. On the Admin Center home page, click the Sunshine icon (<img src="https://zen-marketing-documentation.s3.amazonaws.com/docs/en/admin_center_sunshine_icon.png" alt="Person card location" width="15"/>) in the sidebar.

The Custom Objects and Relationships page will open:  
<img src="https://zen-marketing-documentation.s3.amazonaws.com/docs/en/custom_obj_ui.png" alt="Enable Custom Objects" width="600"/> 
3. Click Activate Custom Objects.    
    
<h3 id="planning-the-app">2. Planning the app</h3>    
 We will walk you through a showcase application placed on Sell Deal page. It will allow you to manage an Invoice record assigned to a Sell Deal object.   
The app assumes 1:1 relationship between Sell Deal object and Custom Object record of Invoice type. It also allows you to do the following:     
1. <b>Create</b> a new Invoice and connect it to the viewed Deal    
2. <b>Edit</b> an Invoice attached to the Deal    
3. <b>Delete</b> an Invoice and detach it from the Deal    
    
When a user opens a Deal, the app will automatically make an HTTP GET request to the Sunshine Custom Objects API to fetch the Invoice related to it. If such a record exists, it will be shown in the app and edit/delete actions will be performable on it. If an Invoice related to the Deal doesn't exist, a button to create a new Invoice will be shown.    
    
<h3 id="using-the-showcase-template">3. Using the showcase template</h3>
    
 Clone the [showcase repository](https://github.com/zendesk/sell-custom-objects-app-tutorial) to your local machine and open the project.
 Please note that this is a React app.    
    
```    
$ git clone git@github.com:zendesk/sell-custom-objects-app-tutorial.git    
    
$ cd sell-custom-objects-app-tutorial     
```    
    
<h3 id="development-requirements">4. Development requirements</h3>    
 Here is a list of libraries with recommended versions that will be used for development of this tutorial app:    
    
1. nodeJS v14.15.3    
2. npm v6.14.9    
    
    
<h3 id="installing-dependencies">4. Installing dependencies</h3>    
 In your terminal run the following command to install all necessary packages:    
    
```    
$ npm install
$ npm install node-fetch
```    
    
<h3 id="installing-zcli">6. Installing the Zendesk CLI</h3>
    
 In this section, you'll install the [Zendesk CLI](https://github.com/zendesk/zcli) (also known as ZCLI). Among other tasks, the tools let you perform the following tasks:    
    
- Automatically create all the necessary files and folders for a new app    
- Test your app locally in a browser    
- Validate your app    
- Package your app for upload    
    
Installing the tools is a one-time task. Once installed, you can use ZCLI for all your Zendesk app projects. Follow these [instructions](https://developer.zendesk.com/apps/docs/developer-guide/zcli#installing-and-updating-zcli) to install `cli`. After you're done, return here to continue the tutorial. If you have already installed Zendesk CLI, make sure you are using the latest version.    
    
Read the [ZCLI apps section](https://github.com/zendesk/zcli/blob/master/docs/apps.md) to get familiar with the tool, but don’t run `$ zcli apps:new` command since the template we’re using includes all starter files necessary to build the app. Inside the app project, ZCLI commands are available as **npm scripts** which you can run in your terminal. They can be found in the **package.json** file under `'script'` property. For example, if you want to build your app you will simply run `$ npm run build` which will execute properly parametrized `$ zcli apps:validate` and `$ zcli apps:package` under the hood. We’ll be using those commands in the next sections.    
    
<h3 id="app-files-overview">7. Showcase app overview</h3>  
  
 Open the showcase app in your favorite editor and go to the `dist/` folder. The folder contains all [required files](https://developer.zendesk.com/apps/docs/developer-guide/setup#file-requirements) which have to be included in an app to install it successfully in a Zendesk product. Directory `src/` is a place where the source code lives. You can add as many files as you need while you're building your app, but for now it includes everything you need to start off.    
    
In the next part of tutorial, you'll test if the showcase app works as expected and you will learn how to develop the app locally.

