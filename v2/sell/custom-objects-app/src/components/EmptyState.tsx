import * as React from 'react'
import {Row, Col} from '@zendeskgarden/react-grid'
import {Button} from '@zendeskgarden/react-buttons'
import {Link} from 'react-router-dom'

import EmptyStateSVG from './../svg/EmptyState.svg'
import css from './../App.css'

const EmptyState = () => {
  return (
    <Col textAlign="center">
      <Row justifyContent="center" className={css.contentView}>
        <EmptyStateSVG width={'50%'} />
      </Row>
      <Row justifyContent="center" className={css.contentView}>
        <Link to="/new">
          <Button data-test-id="invoice-new" size="small">
            Add Invoice
          </Button>
        </Link>
      </Row>
    </Col>
  )
}

export default EmptyState
