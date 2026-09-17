import type { InvoiceLine } from './types.ts'

/**
 * The 53 columns of the Adjusted Price / Qty grid, ported verbatim from the original's
 * COLUMNS array — including each fixed pixel width, which the legacy header applies inline
 * and which keeps the grid's columns aligned with its sort arrows.
 */
export type LineColumn = {
  key: keyof InvoiceLine
  label: string
  width: number
  editable?: boolean
  number?: boolean
}

export const COLUMNS: readonly LineColumn[] = [
  { key: "invoiceTypeMain", label: "Invoice Type", width: 88 },
  { key: "drawingAmountA", label: "Drawing Amount", width: 108, number: true },
  { key: "tradeType", label: "Trade Type", width: 78 },
  { key: "profitability", label: "Profitability", width: 88 },
  { key: "plannedInvAmt", label: "Planned Inv Amt", width: 108, number: true },
  { key: "client", label: "Client", width: 60 },
  { key: "dealId", label: "Deal ID", width: 86 },
  { key: "invTrmRefNo", label: "Inv TRM Ref No", width: 112 },
  { key: "invoiceType", label: "Invoice Type", width: 88 },
  { key: "preTicketRefNo", label: "Pre Ticket Reference Number", width: 128, editable: true },
  { key: "proposedInvDate", label: "Proposed Inv Date", width: 104, editable: true },
  { key: "invoiceDate", label: "Invoice Date", width: 96, editable: true },
  { key: "soPoDate", label: "SO/PO Date", width: 92, editable: true },
  { key: "invoiceNo", label: "Invoice No", width: 100 },
  { key: "invoiceCommodity", label: "Invoice Commodity", width: 185, editable: true },
  { key: "gtCommodityId", label: "GT Commodity ID", width: 98 },
  { key: "partialComplete", label: "Partial/Complete", width: 104, editable: true },
  { key: "fixedMatDate", label: "Fixed Mat Date", width: 96 },
  { key: "incoterms", label: "Incoterms", width: 84, editable: true },
  { key: "seller", label: "Seller", width: 76 },
  { key: "buyer", label: "Buyer", width: 76 },
  { key: "mcRefPurchase", label: "MC Ref Purchase", width: 108, editable: true },
  { key: "mcRefSale", label: "MC Ref Sale", width: 108, editable: true },
  { key: "mcReferenceNo", label: "MC Reference No", width: 115, editable: true },
  { key: "quantity", label: "Quantity", width: 90, editable: true, number: true },
  { key: "price", label: "Price", width: 82, editable: true, number: true },
  { key: "invPriceUsd", label: "Inv Price (USD)", width: 100, number: true },
  { key: "invAmountUsd", label: "Inv Amount (USD)", width: 112, number: true },
  { key: "differenceInvAmount", label: "Difference Inv Amount", width: 118, editable: true, number: true },
  { key: "finalInvAmt", label: "Final Inv Amt", width: 108, number: true },
  { key: "invoiceCurrency", label: "Invoice Currency", width: 100 },
  { key: "exchangeRate", label: "Exchange Rate", width: 98, editable: true, number: true },
  { key: "plannedExchangeRate", label: "Planned Exchange Rate", width: 118, editable: true, number: true },
  { key: "invoiceTransferred", label: "Invoice Transfered", width: 108 },
  { key: "payTerms", label: "Pay Terms", width: 170, editable: true },
  { key: "companyCode", label: "Company Code", width: 96 },
  { key: "int4", label: "INT4", width: 55, number: true },
  { key: "businessPartner", label: "Business Partner", width: 110, editable: true },
  { key: "houseBank", label: "House Bank", width: 92, editable: true },
  { key: "accountId", label: "Account ID", width: 92, editable: true },
  { key: "bankDetailsId", label: "Bank Details ID", width: 108, editable: true },
  { key: "prepaymentDiscount", label: "Prepayment Discount", width: 118, editable: true, number: true },
  { key: "netAmount", label: "Net Amount", width: 108, number: true },
  { key: "profitMargin", label: "Profit Margin", width: 98, editable: true, number: true },
  { key: "blDate", label: "BL Date", width: 92, editable: true },
  { key: "drawingAmountB", label: "Drawing Amount", width: 108, editable: true, number: true },
  { key: "enteredBy", label: "Entered By", width: 95 },
  { key: "enteredOn", label: "Entered On", width: 92 },
  { key: "entryTime", label: "Entry Time", width: 84 },
  { key: "lastChangedBy", label: "Last Changed By", width: 108 },
  { key: "changedOn", label: "Changed On", width: 92 },
  { key: "timeChanged", label: "Time Changed", width: 92 },
  { key: "amendmentCheck", label: "Amendment Check", width: 108, editable: true },
]
