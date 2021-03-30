import * as React from 'react'
import moment from 'moment'
import {
  Body,
  Cell,
  Head,
  HeaderCell,
  HeaderRow,
  Row as TableRow,
  Table,
} from '@zendeskgarden/react-tables'
import {Code, MD} from '@zendeskgarden/react-typography'
import {Grid, Row} from '@zendeskgarden/react-grid'

import {InvoiceData} from '../providers/sunshineProvider'
import DetailsDropdown from './DetailsDropdown'

const Details = ({
  invoice,
  onEdit,
  onDelete,
}: {
  invoice: InvoiceData
  onEdit: () => void
  onDelete: () => void
}) => {
  const {
    invoice_number,
    issue_date,
    due_date,
    due_amount,
    is_paid,
  } = invoice.attributes

  return (
    <Grid>
      <Row>
        <Table>
          <Head>
            <HeaderRow>
              <HeaderCell>Invoice number</HeaderCell>
              <HeaderCell data-test-id="invoice-number-value">
                {invoice_number}
              </HeaderCell>
              <HeaderCell hasOverflow>
                <DetailsDropdown onEdit={onEdit} onDelete={onDelete} />
              </HeaderCell>
            </HeaderRow>
          </Head>
          <Body>
            <TableRow>
              <Cell>
                <MD isBold>Issue date</MD>
              </Cell>
              <Cell data-test-id="invoice-issue-date-value">
                {moment(issue_date).format('ll')}
              </Cell>
              <Cell />
            </TableRow>
            <TableRow>
              <Cell>
                <MD isBold>Due date</MD>
              </Cell>
              <Cell data-test-id="invoice-due-date-value">
                {moment(due_date).format('ll')}
              </Cell>
              <Cell />
            </TableRow>
            <TableRow>
              <Cell>
                <MD isBold>Due amount</MD>
              </Cell>
              <Cell data-test-id="invoice-due-amount-value">${due_amount}</Cell>
              <Cell />
            </TableRow>
            <TableRow>
              <Cell>
                <MD isBold>Status</MD>
              </Cell>
              <Cell data-test-id="invoice-is-paid-value">
                {is_paid ? (
                  <Code hue="green">Paid</Code>
                ) : (
                  <Code hue="red">Not Paid</Code>
                )}
              </Cell>
              <Cell />
            </TableRow>
          </Body>
        </Table>
      </Row>
    </Grid>
  )
}

export default Details
