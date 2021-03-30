import * as React from 'react'
import {
  ResponseHandler,
  useClientRequest,
  ZAFClientContext,
} from '@zendesk/sell-zaf-app-toolbox'
import {useHistory} from 'react-router-dom'
import {useCallback, useContext} from 'react'

import {
  deleteRelation,
  deleteObject,
  RelationshipData,
} from '../providers/sunshineProvider'

import {
  RELATION_TYPE,
  RelationshipListResponse,
} from '../providers/sunshineProvider'
import Loader from './Loader'
import DeleteSection from './DeleteSection'

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

export default DeleteView
