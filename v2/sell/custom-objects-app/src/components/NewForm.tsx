import * as React from 'react'
import {Datepicker} from '@zendeskgarden/react-datepickers'
import {Field, Label, Input, Checkbox} from '@zendeskgarden/react-forms'
import {Row, Col, Grid} from '@zendeskgarden/react-grid'
import {Button} from '@zendeskgarden/react-buttons'
import {Inline} from '@zendeskgarden/react-loaders'
import {useCallback, useState} from 'react'
import {Link} from 'react-router-dom'

import css from './Form.css'

export interface NewFormAttributes {
  dealId: number
  invoiceNumber: string
  issueDate: Date
  dueDate: Date
  dueAmount: string
  isPaid: boolean
}

const NewForm = ({
  dealId,
  onSubmittedForm,
}: {
  dealId: number
  onSubmittedForm: (attributes: NewFormAttributes) => void
}) => {
  const [attributes, setAttributes] = useState({
    invoiceNumber: '',
    issueDate: new Date(),
    dueDate: new Date(),
    dueAmount: '',
    isPaid: false,
  })

  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = useCallback(() => {
    setSubmitted(true)
    onSubmittedForm({...attributes, dealId})
  }, [attributes])

  const handleInvoiceNumber = useCallback(
    (event: {target: {value: string}}) =>
      setAttributes({...attributes, invoiceNumber: event.target.value}),
    [attributes],
  )

  const handleIssueDate = useCallback(
    (issueDate: Date) => setAttributes({...attributes, issueDate}),
    [attributes],
  )

  const handleDueDate = useCallback(
    (dueDate: Date) => setAttributes({...attributes, dueDate}),
    [attributes],
  )

  const handleDueAmount = useCallback(
    (event: {target: {value: string}}) =>
      setAttributes({...attributes, dueAmount: event.target.value}),
    [attributes],
  )

  const handleIsPaid = useCallback(
    () => setAttributes({...attributes, isPaid: !attributes.isPaid}),
    [attributes],
  )

  const isButtonDisabled = () =>
    attributes.invoiceNumber.length === 0 || attributes.dueAmount.length === 0

  return (
    <Grid className={css.Form}>
      <Row justifyContent="center">
        <Col sm={5}>
          <Field className="u-mt-xs">
            <Label>Invoice number</Label>
            <Input
              data-test-id="invoice-number"
              value={attributes.invoiceNumber}
              onChange={handleInvoiceNumber}
            />
          </Field>
          <Field className="u-mt-sm">
            <Label>Issue date</Label>
            <Datepicker value={attributes.issueDate} onChange={handleIssueDate}>
              <Input data-test-id="invoice-issue-date" />
            </Datepicker>
          </Field>
          <Field className="u-mt-sm">
            <Label>Due date</Label>
            <Datepicker value={attributes.dueDate} onChange={handleDueDate}>
              <Input data-test-id="invoice-due-date" />
            </Datepicker>
          </Field>
          <Field className="u-mt-sm">
            <Label>Due amount</Label>
            <Input
              data-test-id="invoice-due-amount"
              value={attributes.dueAmount}
              type="number"
              onChange={handleDueAmount}
            />
          </Field>
          <Field className="u-mt-sm">
            <Checkbox
              data-test-id="invoice-is-paid"
              checked={attributes.isPaid}
              onChange={handleIsPaid}
            >
              <Label>Is paid</Label>
            </Checkbox>
          </Field>
        </Col>
      </Row>
      <Row>
        <Col textAlign="end">
          <Link to="/" className={css.submitButtonsSpacing}>
            <Button data-test-id="invoice-create-cancel" size="small">
              Cancel
            </Button>
          </Link>
          <Button
            data-test-id="invoice-create"
            size="small"
            isPrimary
            onClick={handleSubmit}
            disabled={isButtonDisabled()}
          >
            {submitted ? <Inline size={28} /> : 'Create'}
          </Button>
        </Col>
      </Row>
    </Grid>
  )
}

export default NewForm
