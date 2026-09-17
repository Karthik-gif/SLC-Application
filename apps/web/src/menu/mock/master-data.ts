/**
 * Placeholder master-data tiles.
 *
 * Nothing is wired behind any of these: the master-data area has not been specified, and
 * these exist so the section has a real layout to review. Replace this module wholesale
 * when the real entities are known.
 */
import type { MenuTile } from '../types.ts'

export type MasterDataGroup = { label: string; items: MenuTile[] }

export const MASTER_DATA_GROUPS: MasterDataGroup[] = [
  {
    label: 'Counterparties',
    items: [
      {
        code: 'md-business-partner',
        title: 'Business Partner',
        tag: 'Master',
        desc: 'Counterparties, their roles, addresses and settlement instructions.',
        icon: 'M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z',
      },
      {
        code: 'md-bank-master',
        title: 'Bank Master',
        tag: 'Master',
        desc: 'Banks, branches, SWIFT codes and the accounts held with them.',
        icon: 'M4 10h3v7H4v-7zm6.5 0h3v7h-3v-7zM2 19h20v3H2v-3zm15-9h3v7h-3v-7zm-5-9L2 6v2h20V6L12 1z',
      },
      {
        code: 'md-credit-rating',
        title: 'Credit Rating',
        tag: 'Master',
        desc: 'Internal and agency ratings used when limits are assessed.',
        icon: 'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z',
      },
    ],
  },
  {
    label: 'Instruments',
    items: [
      {
        code: 'md-product-types',
        title: 'Product Types',
        tag: 'Config',
        desc: 'Trade finance product catalogue and the screens each product reaches.',
        icon: 'M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z',
      },
      {
        code: 'md-commodity-master',
        title: 'Commodity Master',
        tag: 'Master',
        desc: 'Commodities, grades and the units each one is quoted in.',
        icon: 'M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.18L19.5 8 12 11.82 4.5 8 12 4.18z',
      },
      {
        code: 'md-currencies',
        title: 'Currencies & FX Pairs',
        tag: 'Config',
        desc: 'Currencies, quotation pairs and rounding rules.',
        icon: 'M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z',
      },
      {
        code: 'md-rate-indices',
        title: 'Interest Rate Indices',
        tag: 'Master',
        desc: 'Reference rates, tenors and fixing calendars behind IRS and loans.',
        icon: 'M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z',
      },
    ],
  },
  {
    label: 'Configuration',
    items: [
      {
        code: 'md-company-codes',
        title: 'Company Codes',
        tag: 'Config',
        desc: 'Company codes, trading desks and their default ledgers.',
        icon: 'M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z',
      },
      {
        code: 'md-calendars',
        title: 'Factory Calendars',
        tag: 'Config',
        desc: 'Working days and holidays used for value and settlement dates.',
        icon: 'M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19a2 2 0 002 2h14c1.1 0 2-.9 2-2V5a2 2 0 00-2-2h-1V1h-2zm3 18H5V8h14v11z',
      },
      {
        code: 'md-charge-types',
        title: 'Charge Types',
        tag: 'Config',
        desc: 'Fees and commissions, their bases and the accounts they post to.',
        icon: 'M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z',
      },
      {
        code: 'md-incoterms',
        title: 'Incoterms',
        tag: 'Config',
        desc: 'Delivery terms and the transfer-of-risk point each one implies.',
        icon: 'M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z',
      },
      {
        code: 'md-document-types',
        title: 'Document Types',
        tag: 'Config',
        desc: 'Bills of lading, invoices and certificates, and what each requires.',
        icon: 'M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z',
      },
    ],
  },
]
