import * as React from 'react'
import {useHistory} from 'react-router-dom'
import {
  ResponseHandler,
  useClientGet,
  useClientHeight,
  ZAFClientContext,
} from '@zendesk/sell-zaf-app-toolbox'
import {useCallback, useContext} from 'react'

import {
  createInvoice,
  createRelation,
  InvoiceResponse,
} from '../providers/sunshineProvider'
import Loader from './Loader'
import NewForm, {NewFormAttributes} from './NewForm'

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

export default NewView
