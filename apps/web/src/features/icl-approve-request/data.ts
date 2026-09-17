/**
 * PLACEHOLDER DATA — no SAP source yet.
 *
 * The legacy page shipped these rows inline as `DUMMY_MASTER_DATA` / `DUMMY_ICL_REQUESTS`
 * and never called a service for them: its only contract was an `SAPEVENT:` form post, and
 * the read side was never designed. This file is what a real ICL request service replaces,
 * so it is the one place the literals live.
 */

import type { DmsDoc, IclRequest, MasterItem } from './types.ts'

/** Product description shown on every row; the original hardcodes it too. */
export const ICL_GIVEN_PRD_DESC = '26A - Inter-Co Loan Given'

export const ICL_PAGE_SIZE = 10

/** Status code -> colour of the dot in the first data column. */
export const STATUS_COLOR_MAP: Record<string, string> = {
  '01': 'yellow',
  '02': 'green',
  '03': 'yellow',
  '04': 'yellow',
  '05': 'yellow',
  '11': 'red',
  '12': 'red',
  '20': 'yellow',
  '21': 'green',
}

export const ICL_REQ_STATUSES: MasterItem[] = [
  { key: '01', text: 'ICL Request Created' },
  { key: '02', text: 'Approved by TSF Manager' },
  { key: '03', text: 'Treasury Approval / ICL Given' },
  { key: '04', text: 'ICL Received' },
  { key: '05', text: 'Deposit Created' },
  { key: '11', text: 'Rejected By TSF' },
  { key: '12', text: 'Rejected By Treasury' },
  { key: '20', text: 'ICL Partially Repaid' },
  { key: '21', text: 'ICL Fully Repaid' },
]

/** The three document slots every ICL request carries, all empty until something is uploaded. */
function makeDmsData(): DmsDoc[] {
  return [
    { docType: 'D01', docTypeDesc: 'ICL Request', docDate: '', filePath: '', dmsCode: '' },
    { docType: 'D02', docTypeDesc: 'ICL Request 2', docDate: '', filePath: '', dmsCode: '' },
    { docType: 'D03', docTypeDesc: 'ICL Request 3', docDate: '', filePath: '', dmsCode: '' },
  ]
}

function makeDmsDataWithUpload(docDate: string, fileName: string, dmsCode: string): DmsDoc[] {
  const data = makeDmsData()
  data[0] = { ...data[0]!, docDate, filePath: fileName, dmsCode }
  return data
}

/**
 * A fresh copy every call: Refresh re-seeds the screen, and approvals/rejections edit the
 * rows, so handing out the same objects twice would leak one run into the next.
 */
export function makeIclRequests(): IclRequest[] {
  return [
    {
      iclRequestNo: '22001501', entityId: 'AE13', entityString: 'AE13 - Olam International DMCC',
      requestorCoName: 'Olam International DMCC', iclReqStatus: '01', amount: 100.0, currency: 'USD',
      requestDate: '02-01-2026', ottkNo: '101001', dttkNo: '201101', dealId: '12002001',
      startDate: '05-01-2026', endDate: '05-01-2027', depositBankName: 'STANDARD CHARTERED BANK',
      houseBank: 'SCBL', accountId: '0660013401', partnerBankId: 'SCBLAEAD', fiscalYear: '2026',
      docNo: '5100002001', client: '100', iclGivenCoCode: 'AE13', plannedEndDate: '05-01-2027',
      slcStructure: 'Standard', approved: false, rejected: false, dmsData: makeDmsData(),
    },
    {
      iclRequestNo: '22001502', entityId: 'AE13', entityString: 'AE13 - Olam International DMCC',
      requestorCoName: 'Olam International DMCC', iclReqStatus: '02', amount: 10000.0, currency: 'USD',
      requestDate: '15-12-2025', ottkNo: '101002', dttkNo: '201102', dealId: '12002002',
      startDate: '20-11-2025', endDate: '20-11-2026', depositBankName: 'CITI BANK',
      houseBank: 'CITI', accountId: '0660013402', partnerBankId: 'CITIUS33', fiscalYear: '2025',
      docNo: '5100002002', client: '100', iclGivenCoCode: 'AE13', plannedEndDate: '20-11-2026',
      slcStructure: 'Structured', approved: true, rejected: false,
      dmsData: makeDmsDataWithUpload('16-12-2025', 'icl_request_22001502.pdf', 'DMSD0184201'),
    },
    {
      iclRequestNo: '22001503', entityId: 'SG21', entityString: 'SG21 - Olam International Pte Ltd',
      requestorCoName: 'Olam International Pte Ltd', iclReqStatus: '03', amount: 25000.0, currency: 'USD',
      requestDate: '10-01-2026', ottkNo: '101003', dttkNo: '201103', dealId: '12002003',
      startDate: '12-01-2026', endDate: '12-01-2027', depositBankName: 'HSBC BANK',
      houseBank: 'HSBC', accountId: '0660013403', partnerBankId: 'HSBCSGSG', fiscalYear: '2026',
      docNo: '5100002003', client: '100', iclGivenCoCode: 'SG21', plannedEndDate: '12-01-2027',
      slcStructure: 'Standard', approved: false, rejected: false, dmsData: makeDmsData(),
    },
    {
      iclRequestNo: '22001504', entityId: 'SG21', entityString: 'SG21 - Olam International Pte Ltd',
      requestorCoName: 'Olam International Pte Ltd', iclReqStatus: '04', amount: 500.0, currency: 'USD',
      requestDate: '22-12-2025', ottkNo: '101004', dttkNo: '201104', dealId: '12002004',
      startDate: '24-12-2025', endDate: '24-12-2026', depositBankName: 'DBS BANK',
      houseBank: 'DBS', accountId: '0660013404', partnerBankId: 'DBSSSGSG', fiscalYear: '2025',
      docNo: '5100002004', client: '100', iclGivenCoCode: 'SG21', plannedEndDate: '24-12-2026',
      slcStructure: 'Standard', approved: false, rejected: false, dmsData: makeDmsData(),
    },
    {
      iclRequestNo: '22001505', entityId: 'US10', entityString: 'US10 - Olam Americas Corp',
      requestorCoName: 'Olam Americas Corp', iclReqStatus: '05', amount: 75000.0, currency: 'USD',
      requestDate: '05-01-2026', ottkNo: '101005', dttkNo: '201105', dealId: '12002005',
      startDate: '07-01-2026', endDate: '07-01-2027', depositBankName: 'JPMORGAN CHASE',
      houseBank: 'JPMC', accountId: '0660013405', partnerBankId: 'CHASUS33', fiscalYear: '2026',
      docNo: '5100002005', client: '100', iclGivenCoCode: 'US10', plannedEndDate: '07-01-2027',
      slcStructure: 'Structured', approved: false, rejected: false, dmsData: makeDmsData(),
    },
    {
      iclRequestNo: '22001506', entityId: 'US10', entityString: 'US10 - Olam Americas Corp',
      requestorCoName: 'Olam Americas Corp', iclReqStatus: '11', amount: 1200.0, currency: 'USD',
      requestDate: '18-11-2025', ottkNo: '101006', dttkNo: '201106', dealId: '12002006',
      startDate: '20-11-2025', endDate: '20-11-2026', depositBankName: 'BANK OF AMERICA',
      houseBank: 'BOFA', accountId: '0660013406', partnerBankId: 'BOFAUS3N', fiscalYear: '2025',
      docNo: '5100002006', client: '100', iclGivenCoCode: 'US10', plannedEndDate: '20-11-2026',
      slcStructure: 'Standard', approved: false, rejected: false, dmsData: makeDmsData(),
    },
    {
      iclRequestNo: '22001507', entityId: 'AE13', entityString: 'AE13 - Olam International DMCC',
      requestorCoName: 'Olam International DMCC', iclReqStatus: '12', amount: 3300.0, currency: 'USD',
      requestDate: '30-12-2025', ottkNo: '101007', dttkNo: '201107', dealId: '12002007',
      startDate: '02-01-2026', endDate: '02-01-2027', depositBankName: 'STANDARD CHARTERED BANK',
      houseBank: 'SCBL', accountId: '0660013407', partnerBankId: 'SCBLAEAD', fiscalYear: '2025',
      docNo: '5100002007', client: '100', iclGivenCoCode: 'AE13', plannedEndDate: '02-01-2027',
      slcStructure: 'Standard', approved: false, rejected: false, dmsData: makeDmsData(),
    },
    {
      iclRequestNo: '22001508', entityId: 'SG21', entityString: 'SG21 - Olam International Pte Ltd',
      requestorCoName: 'Olam International Pte Ltd', iclReqStatus: '20', amount: 900.0, currency: 'USD',
      requestDate: '01-12-2025', ottkNo: '101008', dttkNo: '201108', dealId: '12002008',
      startDate: '03-12-2025', endDate: '03-12-2026', depositBankName: 'DBS BANK',
      houseBank: 'DBS', accountId: '0660013408', partnerBankId: 'DBSSSGSG', fiscalYear: '2025',
      docNo: '5100002008', client: '100', iclGivenCoCode: 'SG21', plannedEndDate: '03-12-2026',
      slcStructure: 'Standard', approved: false, rejected: false, dmsData: makeDmsData(),
    },
    {
      iclRequestNo: '22001509', entityId: 'US10', entityString: 'US10 - Olam Americas Corp',
      requestorCoName: 'Olam Americas Corp', iclReqStatus: '21', amount: 15000.0, currency: 'USD',
      requestDate: '12-01-2026', ottkNo: '101009', dttkNo: '201109', dealId: '12002009',
      startDate: '14-01-2026', endDate: '14-01-2027', depositBankName: 'JPMORGAN CHASE',
      houseBank: 'JPMC', accountId: '0660013409', partnerBankId: 'CHASUS33', fiscalYear: '2026',
      docNo: '5100002009', client: '100', iclGivenCoCode: 'US10', plannedEndDate: '14-01-2027',
      slcStructure: 'Structured', approved: true, rejected: false,
      dmsData: makeDmsDataWithUpload('13-01-2026', 'icl_request_22001509.pdf', 'DMSD0197532'),
    },
    {
      iclRequestNo: '22001510', entityId: 'AE13', entityString: 'AE13 - Olam International DMCC',
      requestorCoName: 'Olam International DMCC', iclReqStatus: '01', amount: 250.0, currency: 'USD',
      requestDate: '20-01-2026', ottkNo: '101010', dttkNo: '201110', dealId: '12002010',
      startDate: '22-01-2026', endDate: '22-01-2027', depositBankName: 'CITI BANK',
      houseBank: 'CITI', accountId: '0660013410', partnerBankId: 'CITIAEAD', fiscalYear: '2026',
      docNo: '5100002010', client: '100', iclGivenCoCode: 'AE13', plannedEndDate: '22-01-2027',
      slcStructure: 'Standard', approved: false, rejected: false, dmsData: makeDmsData(),
    },
    {
      iclRequestNo: '22001511', entityId: 'SG21', entityString: 'SG21 - Olam International Pte Ltd',
      requestorCoName: 'Olam International Pte Ltd', iclReqStatus: '05', amount: 640.0, currency: 'USD',
      requestDate: '25-12-2025', ottkNo: '101011', dttkNo: '201111', dealId: '12002011',
      startDate: '27-12-2025', endDate: '27-12-2026', depositBankName: 'HSBC BANK',
      houseBank: 'HSBC', accountId: '0660013411', partnerBankId: 'HSBCSGSG', fiscalYear: '2025',
      docNo: '5100002011', client: '100', iclGivenCoCode: 'SG21', plannedEndDate: '27-12-2026',
      slcStructure: 'Standard', approved: false, rejected: false, dmsData: makeDmsData(),
    },
    {
      iclRequestNo: '22001512', entityId: 'US10', entityString: 'US10 - Olam Americas Corp',
      requestorCoName: 'Olam Americas Corp', iclReqStatus: '21', amount: 2000.0, currency: 'USD',
      requestDate: '08-11-2025', ottkNo: '101012', dttkNo: '201112', dealId: '12002012',
      startDate: '10-11-2025', endDate: '10-11-2026', depositBankName: 'BANK OF AMERICA',
      houseBank: 'BOFA', accountId: '0660013412', partnerBankId: 'BOFAUS3N', fiscalYear: '2025',
      docNo: '5100002012', client: '100', iclGivenCoCode: 'US10', plannedEndDate: '10-11-2026',
      slcStructure: 'Standard', approved: false, rejected: false, dmsData: makeDmsData(),
    },
  ]
}
