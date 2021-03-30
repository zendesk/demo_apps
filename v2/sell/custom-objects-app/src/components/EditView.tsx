import * as React from 'react'
import {useHistory} from 'react-router-dom'
import {
  ResponseHandler,
  useClientRequest,
  ZAFClientContext,
} from '@zendesk/sell-zaf-app-toolbox'
import {useCallback, useContext} from 'react'

import {updateInvoice, InvoiceListResponse} from '../providers/sunshineProvider'
import Loader from './Loader'
import EditForm, {EditFormAttributes} from './EditForm'

const EditView = ({dealId}: {dealId: string}) => {
  const history = useHistory()
  const client = useContext(ZAFClientContext)

  const sunshineResponse = useClientRequest(
    `/api/sunshine/objects/records/zen:deal:${dealId}/related/deal_invoice`,
  )

  const handleSubmittedForm = useCallback(
    async (invoiceId: string, attributes: EditFormAttributes) => {
      await updateInvoice(client, invoiceId, attributes)
      history.push('/')
    },
    [],
  )
  const isInvoiceListEmpty = (response: {data: InvoiceListResponse}) =>
    response.data.data.length === 0

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
  )
}

export default EditView
