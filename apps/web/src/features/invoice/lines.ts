import { COLUMNS } from './columns.ts'
import type { InvoiceDeal, InvoiceLine } from './types.ts'

/**
 * Seeds the grid rows for a deal.
 *
 * The original generates these client-side too — there is no backend to read them from.
 * Every cell is a string because the grid edits them as text; numbers are formatted once,
 * here, rather than at each render.
 */
export function buildLines(deal: InvoiceDeal): InvoiceLine[] {
  const amount = deal.quantity * deal.price
  const base: InvoiceLine = Object.fromEntries(
    COLUMNS.map((col) => [col.key, '']),
  ) as InvoiceLine

  return [
    {
      ...base,
      invoiceTypeMain: 'Commercial',
      drawingAmountA: amount.toFixed(2),
      tradeType: 'Merchanting',
      profitability: 'Positive',
      plannedInvAmt: amount.toFixed(2),
      client: deal.client,
      dealId: deal.deal,
      invTrmRefNo: `TRM-${deal.deal}`,
      invoiceType: 'Commercial',
      proposedInvDate: deal.entryDate,
      invoiceDate: deal.entryDate,
      soPoDate: deal.entryDate,
      invoiceNo: '',
      invoiceCommodity: deal.commodity,
      gtCommodityId: deal.gtCommodityId,
      partialComplete: 'Complete',
      fixedMatDate: deal.fixedMatDate,
      incoterms: deal.incoterms,
      seller: deal.entity.split(' - ')[0] ?? '',
      buyer: deal.busa,
      mcReferenceNo: `MC-${deal.deal}`,
      quantity: String(deal.quantity),
      price: deal.price.toFixed(2),
      invPriceUsd: deal.price.toFixed(2),
      invAmountUsd: amount.toFixed(2),
      differenceInvAmount: '0.00',
      finalInvAmt: amount.toFixed(2),
      invoiceCurrency: deal.currency,
      exchangeRate: deal.exchangeRate,
      plannedExchangeRate: deal.plannedExchangeRate,
      invoiceTransferred: 'No',
      payTerms: deal.payTerms,
      companyCode: deal.companyCode,
      netAmount: amount.toFixed(2),
      profitMargin: deal.profitMargin,
      blDate: deal.blDate,
      drawingAmountB: amount.toFixed(2),
      enteredBy: 'DEMO',
      enteredOn: deal.entryDate,
      amendmentCheck: 'No',
    },
  ]
}

/**
 * Recomputes the cells the original's Calculate button derives, leaving every typed cell
 * alone. Quantity x price drives the amount columns; the difference adjusts the final.
 */
export function calculate(lines: readonly InvoiceLine[]): InvoiceLine[] {
  return lines.map((line) => {
    const quantity = Number(line.quantity) || 0
    const price = Number(line.price) || 0
    const difference = Number(line.differenceInvAmount) || 0
    const amount = quantity * price
    const final = amount + difference
    return {
      ...line,
      invAmountUsd: amount.toFixed(2),
      plannedInvAmt: amount.toFixed(2),
      finalInvAmt: final.toFixed(2),
      netAmount: (final - (Number(line.prepaymentDiscount) || 0)).toFixed(2),
    }
  })
}

/** Sorts by one column. Numeric columns compare as numbers, everything else as text. */
export function sortLines(
  lines: readonly InvoiceLine[],
  key: keyof InvoiceLine,
  direction: 'asc' | 'desc',
): InvoiceLine[] {
  const numeric = COLUMNS.find((col) => col.key === key)?.number === true
  const sign = direction === 'asc' ? 1 : -1
  return [...lines].sort((a, b) => {
    const left = a[key] ?? ''
    const right = b[key] ?? ''
    if (numeric) return sign * ((Number(left) || 0) - (Number(right) || 0))
    return sign * String(left).localeCompare(String(right))
  })
}
