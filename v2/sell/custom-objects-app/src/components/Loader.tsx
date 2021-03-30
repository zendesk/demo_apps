import * as React from 'react'
import {Spinner} from '@zendeskgarden/react-loaders'
import {Col} from '@zendeskgarden/react-grid'

import css from './Loader.css'

const Loader = () => {
  return (
    <Col textAlign="center" className={css.loaderContainer}>
      <Spinner size="32" />
    </Col>
  )
}

export default Loader
