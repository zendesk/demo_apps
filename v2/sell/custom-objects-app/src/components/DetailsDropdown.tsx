import * as React from 'react'
import {OverflowButton} from '@zendeskgarden/react-tables'
import {Dropdown, Menu, Item, Trigger} from '@zendeskgarden/react-dropdowns'

enum InvoiceActions {
  Delete = 'delete',
  Edit = 'edit',
}

const DetailsDropdown = ({
  onEdit,
  onDelete,
}: {
  onEdit: () => void
  onDelete: () => void
}) => {
  const handleSelect = (action: InvoiceActions) => {
    switch (action) {
      case InvoiceActions.Delete:
        onDelete()
        break
      case InvoiceActions.Edit:
        onEdit()
        break
    }
  }

  return (
    <Dropdown onSelect={handleSelect}>
      <Trigger>
        <OverflowButton
          data-test-id="invoice-actions"
          aria-label="Row actions"
        />
      </Trigger>
      <Menu
        placement="bottom-end"
        popperModifiers={{
          preventOverflow: {
            boundariesElement: 'viewport',
          },
          flip: {
            enabled: false,
          },
          offset: {
            fn: (data) => {
              data.offsets.popper.top -= 2

              return data
            },
          },
        }}
      >
        <Item value={InvoiceActions.Edit} data-test-id="invoice-edit">
          Edit
        </Item>
        <Item value={InvoiceActions.Delete} data-test-id="invoice-delete">
          Delete
        </Item>
      </Menu>
    </Dropdown>
  )
}

export default DetailsDropdown
