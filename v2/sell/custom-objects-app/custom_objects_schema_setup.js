const fetch = require('node-fetch')
// REQUIREMENTS:
// 1. Activate Sunshine Custom objects on UI
// 2. Get credentials
// https://developer.zendesk.com/rest_api/docs/support/introduction#api-token
const ACCESS_TOKEN = ''
const MAIL = ''
const SUBDOMAIN = ''

const TOKEN = Buffer.from(`${MAIL}/token:${ACCESS_TOKEN}`).toString('base64')
const ENVIRONMENT = 'zendesk-staging.com'

const headers = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
  Authorization: `Basic ${TOKEN}`,
}

const createType = async (path, data) => {
  const result = await fetch(
    `https://${SUBDOMAIN}.${ENVIRONMENT}/api/sunshine/${path}`,
    {
      body: JSON.stringify(data),
      method: 'POST',
      headers,
    },
  )
  return result.json()
}

const invoiceTypeSchema = {
  data: {
    key: 'invoice',
    schema: {
      properties: {
        invoice_number: {
          type: 'string',
          description: 'Invoice number',
        },
        issue_date: {
          type: 'string',
          description: 'Invoice date',
        },
        due_date: {
          type: 'string',
          description: 'Date due',
        },
        due_amount: {
          type: 'number',
          description: 'Due amount',
        },
        is_paid: {
          type: 'boolean',
          description: 'Is paid',
        },
      },
      required: [
        'invoice_number',
        'issue_date',
        'due_date',
        'due_amount',
        'is_paid',
      ],
    },
  },
}

const dealInvoiceRelationTypeSchema = {
  data: {
    key: 'deal_invoice',
    source: 'zen:deal',
    target: 'invoice',
  },
}

const handleCreatedRelationType = (response) => {
  console.log('Relation type:', '\n', response.data, '\n')
  console.log('Setup is ready. Please follow the next steps of tutorial.')
}

const handleCreatedObjectType = (response) => {
  if (response.data === undefined) {
    console.log('Error:', '\n', response)
  } else {
    console.log('Object type:', '\n', response.data, '\n')
    createType('relationships/types', dealInvoiceRelationTypeSchema).then(
      handleCreatedRelationType,
    )
  }
}

createType('objects/types', invoiceTypeSchema).then(handleCreatedObjectType)
