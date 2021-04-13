# Custom objects app

This example app shows how custom objects can be implemented in an app for Zendesk Sell. It manages invoice records assigned to a Sell Deal object. It appears on the Zendesk Sell Deal page.

The app has a one-to-one relationship between the Sell Deal object and the invoice custom object record. It uses the [Custom Objects API](https://developer_v2.zendesk.com/documentation/sunshine/custom-objects/custom-objects-api/) to interact with the Custom Objects resources management.

When a user opens a deal card in Sell, the app makes an HTTP GET request to the Sunshine Custom Objects API to fetch the invoice associated to it. If the record exists, it is displayed in the app with options to edit or delete the record. If an invoice related to the deal doesn't exist, a button is displayed to create a new invoice.

<img src="https://zen-marketing-documentation.s3.amazonaws.com/docs/developer/5.display_invoice.png" width="600">

Included topics in this file:

- [Using the Zendesk app scaffold](#using-the-zendesk-app-scaffold)
- [What you'll need](#what-you'll-need)
- [Getting started](#getting-started)
- [Installing the app](#installing-the-app)
- [Implementation details](#implementation-details)
- [Developing the app](#developing-the-app)

## Using the Zendesk app scaffold

This app is built on the Zendesk app scaffold. It allows you to bootstrap a React-based application which is integrated with the Zendesk Apps framework (ZAF). It is intended for experienced web developers who are comfortable working with advanced web tooling such as Webpack, Node, and npm packages, among other technologies.

To further develop the app, it is recommended to use nodeJS v14.15.3 and npm v6.14.9.

**Disclaimer**: Zendesk can't provide support for third-party technologies such as Webpack, Node.js, or npm packages, nor can Zendesk debug custom scaffold configurations or code.

## What you'll need

To upload a private app in Sell, you must have the following:

- Zendesk Sell on the Team plan or above
- A Zendesk Suite plan to use custom objects

If you're interested in becoming a Zendesk developer partner, you can convert a trial account into a sponsored Zendesk Support account. See [Getting a trial or sponsored account for development](https://developer_v2.zendesk.com/documentation/developer-tools/getting-started/getting-a-trial-or-sponsored-account-for-development/).

## Getting started

To use the app, complete the tasks as described in the following sections.

### Enabling custom objects

Custom objects must be enabled by an administrator in Zendesk Support. If you're not an admin, ask one to enable them for you. For more information, see [Enabling custom objects](https://support.zendesk.com/hc/en-us/articles/360037716253-Sunshine-custom-objects-guide-for-admins#topic_fk5_wyl_mjb).

### Installing dependencies

Run the following commands to install the necessary packages:

```
$ npm install 
$ npm install node-fetch
```

### Installing Zendesk CLI

[Zendesk CLI](https://github.com/zendesk/zcli), also known as ZCLI is an application for creating the necessary app files, testing, validating, and packaging your app. To install it, follow the instructions in [Installing and updating ZCLI](https://developer.zendesk.com/apps/docs/developer-guide/zcli#installing-and-updating-zcli).

### Creating the custom object schema

To quickly get up and running, a script is provided to create the schema for the custom object. The custom object type is an invoice and there is a one-to-one relationship between the standard Sell Object (`zen:deal`) and the invoice.

**Create the schema**

1. Open the **custom_objects_schema_setup.js** file in your text editor.
2. Provide details for the following properties:
   - `ACCESS_TOKEN` - API tokens are managed in the Support admin interface at **Admin** > **Channels** > **API**. If needed, create a new API token paste it in the script. Be careful to not expose your token publicly.
   - `MAIL` - Your account email address
   - `SUBDOMAIN` - Your Zendesk Sell subdomain
3. From the project root directory, run `$ node custom_objects_schema_setup.js`.
4. Review the created object type and relationship in **Admin Center** > **Sunshine** > **Objects** and **Admin Center** > **Sunshine** > **Relationships**.

## Installing the app

See [Uploading and installing a private app in Zendesk Sell](https://develop.zendesk.com/hc/en-us/articles/360001069347#ariaid-title4) for information on installing a private app in Zendesk Sell.

You should see the app in Sell when viewing a Deal card.

## Implementation details

The following sections describe the implementation of CRUD operations using the [Custom Objects API](https://developer.zendesk.com/rest_api/docs/sunshine/custom_objects_api) in the app.

### Getting data

In **sell-custom-objects-app-tutorial** > **src**, the **index.tsx** file contains a `return` method.

```js
return (
	...
        <Router>
          <Switch>
            <Route exact path="/new" component={NewView} />
            <Route exact path="/edit" component={EditEntryView} />
            <Route exact path="/delete" component={DeleteView} />
            <Route component={EntryView} />
          </Switch>
        </Router>
    ...
  )
```

In the `Router` section, "EntryView" is defined as the default path. If you view the **src/EntryView.tsx** file, it is a component which makes an HTTP request and then displays the data. All **`name`View.tsx** files are responsible for gathering the data and HTTP requests.

```js
export const EntryView = () => {
  useClientHeight(215);
  const dealIdResponse = useClientGet("deal.id");

  return (
    <Grid gutters={false} className={css.App}>
      <Row>
        <ResponseHandler
          response={dealIdResponse}
          loadingView={<Loader />}
          errorView={<div>Something went wrong!</div>}
          emptyView={<div>There is no Deal</div>}
        >
          {([dealId]: [string]) => <DetailsView dealId={dealId} />}
        </ResponseHandler>
      </Row>
    </Grid>
  );
};
```

The first request is in the [useClientGet](https://github.com/zendesk/sell-zaf-app-toolbox#useclientgetpath) hook. It uses the `client.get()` method to retrieve a deal based on a current location. That is, it calls `client.get('deal.id')` for the location.

[useClientHeight](https://github.com/zendesk/sell-zaf-app-toolbox#useclientheightheight) is another hook that is useful when you need to manage an app's height. It accepts a height value and calls `client.invoke(‘resize’ , {height})`.

`<ResponseHandler/>` component is responsible for handling asynchronous requests. Depending on a request status it can display a loader, an error state, or an empty state. When the request has finished successfully, a child component with the response data will be rendered.

At this point, there's a `deal.id` which can be passed to the `DetailsView` component. Open **src/components/DetailsViews.tsx**.

```js
const DetailsView = ({ dealId }: { dealId: string }) => {
  const history = useHistory();
  const sunshineResponse = useClientRequest(
    `/api/sunshine/objects/records/zen:deal:${dealId}/related/deal_invoice`
  );

  const handleEdit = useCallback(() => history.push("/edit"), []);
  const handleDelete = useCallback(() => history.push("/delete"), []);

  const isInvoiceListEmpty = (response: { data: InvoiceListResponse }) =>
    response.data.data.length === 0;

  return (
    <ResponseHandler
      response={sunshineResponse}
      loadingView={<Loader />}
      errorView={<div>Something went wrong!</div>}
      emptyView={<EmptyState />}
      isEmpty={isInvoiceListEmpty}
    >
      {([response]: [InvoiceListResponse]) => (
        <Details
          invoice={response.data[0]}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </ResponseHandler>
  );
};
```

This component is responsible for gathering data based on the provided `dealId` prop. It calls the Custom Objects API to find the related record of custom object type `invoice` for a given `dealId`.

It uses the [useClientRequest](https://github.com/zendesk/sell-zaf-app-toolbox#useclientrequesturl-options-dependencies-cachekey) hook to perform a GET request on the [Related Object Records API](https://developer.zendesk.com/rest_api/docs/sunshine/resources#list-related-object-records). As previously mentioned, the one-to-one relationship type is:

```
{
  key: 'deal_invoice',
  source: 'zen:deal',
  target: 'invoice',
  ....
}
```

An example request to fetch a related invoice for the deal would look like this:

`https://{your_sell_subdomain}/api/sunshine/objects/records/zen:deal:21730067/related/deal_invoice`

where `21730067` is the `dealId` of a deal from the current location. It is provided as a prop and `deal_invoice` is the relationship type key.

In this scenario, `<ResponseHandler/>` also covers asynchronous requests. It also provides an `isEmpty` method as a prop to check whether the response is empty or not. If no invoice records are created, an `emptyView` prop is rendered which is an `<EmptyState/>` component.

When the response is not empty, an `invoice` record is passed to a **Details.js** component responsible for rendering its attributes.

### Creating a custom object and relationship

This section describes a situation when the previous response is empty. So there is no `Invoice` yet and you would like to add new record.

The **EmptyState.tsx** component responsible for handling this scenario displays a button to add a new `Invoice` and navigates to **NewView.tsx** in the `/new` path.

```js
const EmptyState = () => {
  return (
   ...
        <Link to="/new">
          <Button data-test-id="invoice-new">Add Invoice</Button>
        </Link>
   ...
  )
}
```

The app uses standard Zendesk Garden UI components such as a [Button](https://garden.zendesk.com/components/button).

As mentioned above, adding a new `Invoice` record is handled by **NewView.tsx**.

```js
const NewView = () => {
  useClientHeight(400)
  const history = useHistory()
  const dealIdResponse = useClientGet('deal.id')
  const client = useContext(ZAFClientContext)

  const handleSubmittedForm = useCallback(
    async (attributes: NewFormAttributes) => {
      const invoiceResponse = (await createInvoice(
        client,
        attributes,
      )) as InvoiceResponse
      await createRelation(client, attributes.dealId, invoiceResponse.data.id)
      history.push('/')
    },
    [],
  )

  return (
    <ResponseHandler
      responses={[dealIdResponse]}
      loadingView={<Loader />}
      errorView={<div>Something went wrong!</div>}
      emptyView={<div>There's nothing to see yet.</div>}
    >
      {([dealId]: [number]) => (
        <NewForm dealId={dealId} onSubmittedForm={handleSubmittedForm} />
      )}
    </ResponseHandler>
  )
}
```

This component renders `<NewForm>` with a `dealId` and a `onSubmittedForm` prop that is invoked when the form is submitted.

The `handleSubmittedForm` function gets invoice attributes passed from the form and performs two actions - `createInvoice` and `createRelation` implemented in **src** > **providers** > **SunshineProvider.ts**.

**createInvoice**

```js
export const createInvoice = (
  client: Client | undefined,
  attributes: NewFormAttributes
) => {
  const body = {
    data: {
      type: OBJECT_TYPE,
      attributes: {
        invoice_number: attributes.invoiceNumber,
        issue_date: attributes.issueDate,
        due_date: attributes.dueDate,
        due_amount: parseFloat(attributes.dueAmount),
        is_paid: attributes.isPaid,
      },
    },
  };

  return client?.request({
    url: `/api/sunshine/objects/records`,
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify(body),
  });
};
```

A POST request is made to [Create Object Record API](/rest_api/docs/sunshine/resources#create-object-record) endpoint and creates a new record of `Invoice`. A client performing the request is an instance of [ZAF Client](/apps/docs/core-api/client_api#zaf-client-api) initialized in the `<App>` component.

In the response, the `id` in the `Invoice` record is used to create a relationship between the deal and invoice.

**createRelation**

```js
export const createRelation = (
  client: Client | undefined,
  dealId: number,
  invoiceId: string
) => {
  const data = {
    data: {
      relationship_type: RELATION_TYPE,
      source: `zen:deal:${dealId}`,
      target: invoiceId,
    },
  };

  return client?.request({
    url: `/api/sunshine/relationships/records`,
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify(data),
  });
};
```

This method runs after the `createInvoice` response and as a parameter requires the `dealId` and `invoiceId` parameters. It then makes a POST request to the [Create Relationship Record API](/rest_api/docs/sunshine/relationships#create-relationship-record) endpoint and creates a new record of linking an invoice to a deal. A client performing the request (passed as a parameter) is also an instance of [ZAF Client](/apps/docs/core-api/client_api#zaf-client-api) initialized in an `<App>` component.

In the end, you navigate back to `EntryView` using `history.push('/')` available by using [React Router](https://reactrouter.com/). At this point it loads the newly created `Invoice` as described in earlier in this section.

### Editing an object

In this section, you'll learn how object records are edited using Custom Objects API. It occurs when you navigate to `/edit` from `<Details>`. This action is handled by `EditView` function in the **EditView.tsx** file.

```js
const EditView = ({ dealId }: { dealId: string }) => {
  const history = useHistory();
  const client = useContext(ZAFClientContext);

  const sunshineResponse = useClientRequest(
    `/api/sunshine/objects/records/zen:deal:${dealId}/related/deal_invoice`
  );

  const handleSubmittedForm = useCallback(
    async (invoiceId: string, attributes: EditFormAttributes) => {
      await updateInvoice(client, invoiceId, attributes);
      history.push("/");
    },
    []
  );
  const isInvoiceListEmpty = (response: { data: InvoiceListResponse }) =>
    response.data.data.length === 0;

  return (
    <ResponseHandler
      responses={[sunshineResponse]}
      loadingView={<Loader />}
      errorView={<div>Something went wrong!</div>}
      emptyView={<div>Couldn't find any related invoices</div>}
      isEmpty={isInvoiceListEmpty}
    >
      {([response]: [InvoiceListResponse]) => (
        <EditForm
          invoice={response.data[0]}
          onSubmittedForm={handleSubmittedForm}
        />
      )}
    </ResponseHandler>
  );
};
```

First, you can retrieve an `Invoice` record from the [Related Object Records API](/rest_api/docs/sunshine/resources#list-related-object-records) to edit its current attributes:

```js
const sunshineResponse = useClientRequest(
  `/api/sunshine/objects/records/zen:deal:${dealId}/related/deal_invoice`
);
```

The response is handled by `<ResponseHandler>` and passed to `<EditForm>` along with the `onSubmittedForm` prop.

Similarly, to the `Create` function `handleSubmittedForm`, invoice attributes are passed from the form and performs an action where the `updateInvoice` implemented within the **SunshineProvider.ts** file.

**updateInvoice**

```js
export const updateInvoice = (
  client: Client | undefined,
  invoiceId: string,
  attributes: EditFormAttributes
) => {
  const body = {
    data: {
      attributes: {
        invoice_number: attributes.invoiceNumber,
        issue_date: attributes.issueDate,
        due_date: attributes.dueDate,
        due_amount: parseFloat(attributes.dueAmount),
        is_paid: attributes.isPaid,
      },
    },
  };

  return client?.request({
    url: `/api/sunshine/objects/records/${invoiceId}`,
    method: "PATCH",
    contentType: "application/merge-patch+json",
    data: JSON.stringify(body),
  });
};
```

Based on `invoiceId` provided in the parameters, this method makes a PATCH request to the [Update Object Record](/rest_api/docs/sunshine/resources#update-object-record) endpoint. Note, the Content-Type is specified as "application/merge-patch+json".

### Deleting an object and relationship

The last action available in the app is detaching the invoice record from a deal. It can be performed from the `<Details>` view by clicking the button which navigates to the `/delete` path handled by the `<DeleteView>` component.

```js
const DeleteView = ({dealId}: {dealId: string}) => {
  const dealRelationName = `zen:deal:${dealId}`
  const client = useContext(ZAFClientContext)
  const history = useHistory()
  const sunshineResponse = useClientRequest(
    `/api/sunshine/relationships/records?type=${RELATION_TYPE}`,
  )

  const handleDelete = useCallback(
    async (relationId: string, invoiceId: string) => {
      await deleteRelation(client, relationId)
      await deleteObject(client, invoiceId)
      history.push('/')
    },
    [],
  )
  const isRelationEmpty = (response: {data: RelationshipListResponse}) =>
    response.data.data.filter(
      (relation: RelationshipData) => relation.source === dealRelationName,
    ).length === 0

  return (
    <ResponseHandler
      response={sunshineResponse}
      loadingView={<Loader />}
      errorView={<div>Something went wrong!</div>}
      emptyView={<div>Couldn't find any related invoices</div>}
      isEmpty={isRelationEmpty}
    >
      {([response]: [RelationshipListResponse]) => (
        <DeleteSection
          relation={
            response.data.find(
              (relation: RelationshipData) =>
                relation.source === dealRelationName,
            ) as RelationshipData
          }
          onDelete={handleDelete}
        />
      )}
    </ResponseHandler>
  )
}
```

It works similar to `create` action. Once the `handleDelete` method is invoked, two actions, `deleteRelation` and `deleteInvoice` are implemented in the **SunshineProvider.ts** file. Requests to the Custom Objects API are made in this order to first detach the relationship, then remove the Custom Object record.

**deleteRelation and deleteInvoice**

```js
export const deleteRelation = (
  client: Client | undefined,
  relationId: string
) => {
  return client?.request({
    url: `/api/sunshine/relationships/records/${relationId}`,
    method: "DELETE",
  });
};

export const deleteObject = (client: Client | undefined, objectId: string) => {
  return client?.request({
    url: `/api/sunshine/objects/records/${objectId}`,
    method: "DELETE",
  });
};
```

DELETE requests are made to the [Delete Object record](/rest_api/docs/sunshine/resources#delete-object-record) and [Delete Relation record](/rest_api/docs/sunshine/relationships#delete-relationship-record) endpoints, requiring the `id` of given object.

A client performing the request is an instance of [ZAF Client](https://developer.zendesk.com/apps/docs/core-api/client_api#zaf-client-api) initialized in `<App>` component and passed as an argument.

## Developing the app

Go ahead and experiment with changes in the app. You can test the app locally and use Zendesk CLI to validate and package the app before uploading it to Sell.

### Testing the app locally

The Zendesk CLI (ZCLI) includes a local web server so you can run and test your apps locally as you're developing it. Run it often to test your latest changes.

**Note**: It is recommended to use private browsing or the Incognito mode in your browser when testing and developing apps. Your browser may cache certain files used by the app. If a change is not working in your app, the browser might be using an older cached version of the file. With private browsing, files aren't cached.

**Test your app**

1. In your command-line interface, navigate to the **sell-custom-objects-app-tutorial** folder.
2. Install dependencies:
   `$ npm install`
3. Start your app:
   `$ npm start`
4. Open a new window in your command line tool and start the server:
   `$ npm run server`
5. Go to the Deals page and select a deal from the list to open a deal card. The URL should look something like this:

   `https://app.futuresimple.com/sales/deals/123`

6. Append `?zcli_apps=true` to the Deal card URL and press **Enter**. Example:

   `https://app.futuresimple.com/sales/deals/123?zcli_apps=true`

7. If you're using the Google Chrome browser, the content of your app may be blocked. Click the lock icon on the left side of the address bar and select **Site settings**. On the Settings page, scroll to the **Insecure Content** section, and select **Allow**.

   **Note:** Firefox doesn't block app content but Safari does and has no option to disable blocking.

### Packaging and uploading the app to Sell

To validate the app and package it for uploading in a zip file, in your command line run:

```
$ npm run build
```

The output confirms a new zip file has been generated. The file can be found in the **dist/tmp/** folder. See [Installing the app](#installing-the-app) to upload the app to Sell.
