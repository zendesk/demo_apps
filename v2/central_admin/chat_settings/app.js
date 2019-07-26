import React from 'react'
import ReactDOM from 'react-dom'
import { Button } from '@zendeskgarden/react-buttons'

import '@zendeskgarden/react-buttons/dist/styles.css'

class ChatSeetings extends React.Component {
  render() {
    return (
      <div>
        <Button>Garden Button</Button>
      </div>
    )
  }
}

ReactDOM.render(<ChatSeetings />, document.getElementById('app'))
