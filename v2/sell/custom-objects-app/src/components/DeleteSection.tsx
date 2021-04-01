import * as React from 'react'
import {Col, Grid, Row} from '@zendeskgarden/react-grid'
import {LG} from '@zendeskgarden/react-typography'
import {Button} from '@zendeskgarden/react-buttons'
import {PALETTE} from '@zendeskgarden/react-theming'
import {Inline} from '@zendeskgarden/react-loaders'
import {Link} from 'react-router-dom'
import {useState} from 'react'

import {RelationshipData} from '../providers/sunshineProvider'
import css from './DeleteSection.css'

const DeleteSection = ({
  relation,
  onDelete,
}: {
  relation: RelationshipData
  onDelete: (relationId: string, invoiceId: string) => void
}) => {
  const [submitted, setSubmitted] = useState(false)
  const handleDelete = () => {
    setSubmitted(true)
    onDelete(relation.id, relation.target)
  }

  return (
    <Grid className={css.DeleteSection}>
      <Row
        justifyContent="center"
        alignItems="center"
        className={css.deleteHeader}
      >
        <LG>Do you want to remove the Invoice?</LG>
      </Row>
      <Row justifyContent="center" alignItems="center">
        <Col textAlign="center">
          <Link to="/" className={css.cancelDeleteSpacing}>
            <Button size="small" data-test-id="invoice-delete-cancel">
              Cancel
            </Button>
          </Link>
          <Button
            size="small"
            isDanger
            isPrimary
            data-test-id="invoice-delete-confirm"
            onClick={handleDelete}
          >
            {submitted ? <Inline size={28} color={PALETTE.white} /> : 'Delete'}
          </Button>
        </Col>
      </Row>
    </Grid>
  )
}

export default DeleteSection
