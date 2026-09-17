import type { Bank, Ottk } from './types.ts'

/**
 * The OTTK, structure and bank lists the legacy page runs on.
 *
 * QUARANTINED PLACEHOLDER DATA — there is no SAP source for it yet. The original reads an
 * optional global `ICL_REQUEST_PAYLOAD` that nothing ever defines and falls back to this
 * literal, so the screen has never touched a backend. When a service exists, this file is
 * what it replaces; nothing else in the feature holds seed values.
 */

export const STRUCTURES: readonly string[] = ['Corporate Trade', 'Structured LCs']

export const FIRST_REQUEST_NUMBER = 22001595

const SEED_OTTKS: Ottk[] = [
  {
    tsfStructure: 'Structured LCs',
    entityString: 'E021 - OGA-DMCC-PAN',
    ottkStatDesc: '06 - Fully Assigned to Deal ID',
    ottkNo: '102934',
    ottkValue: 1000000,
    ottkCurr: 'USD',
    trader: 'SESHAIAHB',
    dealId: '12002126',
    dttkNo: '202533',
    iclReceivedTxn: '',
    iclRecAmount: '',
    expectedDate: '11-07-24',
    coCode1: 'AE13',
    coCode2: '',
    companyCode: 'AE13',
    companyName: 'Olam International DMCC',
    businessArea: '0615',
    businessAreaName: 'OLAM INTERNATIONAL DMCC',
    lcIssuanceBank: '660000675',
    lcIssuanceBankName: 'ABU DHABI COMMERCIAL BANK DUBAI',
    iclGivenComp: 'SG03',
    iclGivenName: 'Olam Global Agri Pte. Ltd',
    iclReceivedComp: 'AE13',
    iclReceivedName: 'Olam International DMCC',
    entityId: 'E021',
    entityStringFull: 'E021 - OGA-DMCC-PAN',
    depositValue: 'DTY Discounted Value',
    interestCategory: 'Fixed',
    interestRate: 1,
    lcApp: 'DMCC',
    ottkBankDesc: '6600013412 - QATAR NATIONAL BANK (QPSC)',
    noOfDays: 180,
    directIndirect: '01 Pay to Group Co. (Indirect)',
  },
  {
    tsfStructure: 'Corporate Trade',
    entityString: 'E024 - DMCC-PAN-OGA',
    ottkStatDesc: '02 - Open',
    ottkNo: '102951',
    ottkValue: 850000,
    ottkCurr: 'USD',
    trader: 'MELRONE D',
    dealId: '12002144',
    dttkNo: '202548',
    iclReceivedTxn: '',
    iclRecAmount: '',
    expectedDate: '14-07-24',
    coCode1: 'AE11',
    coCode2: '',
    companyCode: 'AE11',
    companyName: 'Olam Global Agri Pte. Ltd',
    businessArea: '0615',
    businessAreaName: 'OLAM INTERNATIONAL DMCC',
    lcIssuanceBank: '660000675',
    lcIssuanceBankName: 'ABU DHABI COMMERCIAL BANK DUBAI',
    iclGivenComp: 'SG03',
    iclGivenName: 'Olam Global Agri Pte. Ltd',
    iclReceivedComp: 'AE11',
    iclReceivedName: 'Olam Global Agri Pte. Ltd',
    entityId: 'E024',
    entityStringFull: 'E024 - DMCC-PAN-OGA',
    depositValue: 'DTY Discounted Value',
    interestCategory: 'Fixed',
    interestRate: 1.15,
    lcApp: 'DMCC',
    ottkBankDesc: '6600013368 - BANESCO (PANAMA) S.A.',
    noOfDays: 180,
    directIndirect: '01 Pay to Group Co. (Indirect)',
  },
]

const DEMO_STATUSES = [
  '05 - Partially Assigned to Deal ID',
  '06 - Fully Assigned to Deal ID',
  '07 - Canceled OTTK',
]

const DEMO_BANK_DESCS = [
  '6600013412 - QATAR NATIONAL BANK (QPSC)',
  '6600013368 - BANESCO (PANAMA) S.A.',
  '6600012956 - Westpac Banking Corporation',
  '6600013411 - THE COMMERCIAL BANK OF QATAR',
]

const DEMO_TRADERS = ['Anbarasan K', 'Jayant S', 'Nithishkumar', 'Sufiyan H']

const DEMO_ENTITIES = [
  { id: 'E021', text: 'E021 - OGA-DMCC-PAN' },
  { id: 'E022', text: 'E022 - OGA-AMBER-DMCC' },
  { id: 'E023', text: 'E023 - SEDA-DMCC-OGA' },
  { id: 'E024', text: 'E024 - DMCC-OGA-PAN' },
  { id: 'E025', text: 'E025 - OGA-OSIPL-PAN' },
  { id: 'E029', text: 'E029 - AMBER-DMCC-OGA' },
]

/** The original's `prepareDemoRows`: 28 further rows cloned from the first, so the list paginates. */
function buildDemoRows(base: Ottk): Ottk[] {
  const rows: Ottk[] = []
  for (let i = 1; i < 29; i++) {
    const status = DEMO_STATUSES[i % DEMO_STATUSES.length] ?? base.ottkStatDesc
    const entity = DEMO_ENTITIES[i % DEMO_ENTITIES.length] ?? {
      id: base.entityId,
      text: base.entityString,
    }
    rows.push({
      ...base,
      ottkNo: String(102934 + i),
      ottkValue: 13436 + ((i * 2879) % 92000),
      dealId: i < 4 ? '' : String(12000740 + i),
      dttkNo: i < 4 ? '' : String(200587 + i),
      ottkStatDesc: status,
      entityId: entity.id,
      entityString: entity.text,
      entityStringFull: entity.text,
      lcApp: 'DMCC',
      trader: DEMO_TRADERS[i % DEMO_TRADERS.length] ?? base.trader,
      expectedDate: `0${11 + (i % 12)}`.slice(-2) + '-07-24',
      layout: i % 2 === 0 ? 'STANDARD' : 'ICL',
      ottkBankDesc: DEMO_BANK_DESCS[i % DEMO_BANK_DESCS.length] ?? base.ottkBankDesc,
    })
  }
  return rows
}

export const DUMMY_OTTKS: readonly Ottk[] = SEED_OTTKS[0]
  ? [...SEED_OTTKS, ...buildDemoRows(SEED_OTTKS[0])]
  : SEED_OTTKS

export const DUMMY_BANKS: readonly Bank[] = [
  { coCd: 'AE13', houseBank: 'BA104', bankKey: '0002312123', bankAccount: '000002312123', bankName: 'BARCLAYS BANK CIB', currency: 'USD', partnerBank: '' },
  { coCd: 'AE13', houseBank: 'BA104', bankKey: '0002312123', bankAccount: '000002312123', bankName: 'BARCLAYS BANK CIB', currency: 'USD', partnerBank: 'EUR1' },
  { coCd: 'AE13', houseBank: 'CB102', bankKey: '1111494728', bankAccount: '110011494728', bankName: 'COMMERCIAL BANK INTERNATIONAL', currency: 'USD', partnerBank: '' },
  { coCd: 'AE13', houseBank: 'CHAUS', bankKey: 'CHAUS33XXX', bankAccount: '816659236', bankName: 'JP MORGAN CHASE BANK, N.A', currency: 'USD', partnerBank: 'MUL1' },
  { coCd: 'AE13', houseBank: 'CMB01', bankKey: 'CMBCUS33', bankAccount: '1021330019', bankName: 'CHINA MERCHANT BANK CO LTD', currency: 'USD', partnerBank: 'SCB1' },
  { coCd: 'AE13', houseBank: 'DBS01', bankKey: 'DBSSSGB', bankAccount: '0720028210', bankName: 'DBS BANK LTD', currency: 'USD', partnerBank: 'USD1' },
  { coCd: 'AE13', houseBank: 'JPM01', bankKey: '6581117386', bankAccount: '6581117386', bankName: 'JPMorgan Chase Bank NA Bangkok Branch', currency: 'USD', partnerBank: '' },
  { coCd: 'AE13', houseBank: 'MBA01', bankKey: 'MASHREO', bankAccount: '19000032025', bankName: 'MASHREQ BANK', currency: 'USD', partnerBank: '' },
  { coCd: 'AE13', houseBank: 'SCB01', bankKey: 'SCBLSGSG', bankAccount: '0105944491', bankName: 'Standard Chartered Bank', currency: 'USD', partnerBank: 'USD1' },
  { coCd: 'AE13', houseBank: 'UAB', bankKey: 'UARBAEAA', bankAccount: '2031020935001', bankName: 'UNITED ARAB BANK', currency: 'USD', partnerBank: 'UAB' },
]
