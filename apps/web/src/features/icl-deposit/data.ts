import type { Bank, CompanyCode, IclRecord } from './types.ts'

/**
 * The dataset the legacy page runs on.
 *
 * QUARANTINED PLACEHOLDER. `ICL_Deposit_v15.html` reads a global `DASHBOARD_PAYLOAD` that
 * nothing ever defines and falls back to this literal, so the screen has never touched a
 * backend — there is no SAP entity behind any of it yet. When a service exists, this file
 * is what it replaces; nothing else in the feature holds seed values.
 */

export const COMPANY_CODES: readonly CompanyCode[] = [
  { code: 'AE13', name: 'Olam International DMCC' },
  { code: 'AE11', name: 'Olam Global Agri Pte. Ltd' },
  { code: 'SG03', name: 'Olam Global Agri Pte. Ltd' },
]

/** Carried over from the payload. The status filter is built from the rows, not from this. */
export const REQUEST_STATUSES: readonly string[] = ['Open', 'Deposit Created', 'ICL Created', 'Closed']

/** Number ranges the page hands out locally, standing in for SAP number objects. */
export const NEXT_NUMBERS = {
  depositRequest: 850001,
  depositTxn: 960001,
  requestNumber: 22001595,
}

export const RECORDS: readonly IclRecord[] = [
  {
    companyCode: 'AE13', transactionNo: 'TXN100234', requestStatus: 'Open', ottkNo: '102934',
    ottkAmount: 1000000, ottkCurr: 'USD', dealId: '12002126',
    businessArea: '0615', businessAreaName: 'OLAM INTERNATIONAL DMCC',
    lcIssuanceBank: '660000675', lcIssuanceBankName: 'ABU DHABI COMMERCIAL BANK DUBAI',
    startDate: '2024-07-11', noOfDays: 180, interestRate: 1, interestCategory: 'Fixed',
    interestFrequency: 'Upfront', depositValue: 'DTY Discounted Value',
    iclGivenComp: 'SG03', iclGivenName: 'Olam Global Agri Pte. Ltd',
    iclReceivedComp: 'AE13', iclReceivedName: 'Olam International DMCC',
    entityString: 'E021 - OGA-DMCC-PAN',
    depositId: '', depositRequest: '', depositTxn: '', requestNo: '', paymentBank: null,
  },
  {
    companyCode: 'AE13', transactionNo: 'TXN100241', requestStatus: 'Open', ottkNo: '102951',
    ottkAmount: 850000, ottkCurr: 'USD', dealId: '12002144',
    businessArea: '0615', businessAreaName: 'OLAM INTERNATIONAL DMCC',
    lcIssuanceBank: '660000675', lcIssuanceBankName: 'ABU DHABI COMMERCIAL BANK DUBAI',
    startDate: '2024-07-14', noOfDays: 150, interestRate: 1.15, interestCategory: 'Fixed',
    interestFrequency: 'Arrears', depositValue: 'DTY Discounted Value',
    iclGivenComp: 'SG03', iclGivenName: 'Olam Global Agri Pte. Ltd',
    iclReceivedComp: 'AE13', iclReceivedName: 'Olam International DMCC',
    entityString: 'E022 - OGA-AMBER-DMCC',
    depositId: '', depositRequest: '', depositTxn: '', requestNo: '', paymentBank: null,
  },
  {
    companyCode: 'AE13', transactionNo: 'TXN100255', requestStatus: 'Deposit Created', ottkNo: '102967',
    ottkAmount: 642500, ottkCurr: 'USD', dealId: '12002159',
    businessArea: '0615', businessAreaName: 'OLAM INTERNATIONAL DMCC',
    lcIssuanceBank: '6600013412', lcIssuanceBankName: 'QATAR NATIONAL BANK (QPSC)',
    startDate: '2024-06-20', noOfDays: 120, interestRate: 1.05, interestCategory: 'Fixed',
    interestFrequency: 'Upfront', depositValue: 'DTY Discounted Value',
    iclGivenComp: 'SG03', iclGivenName: 'Olam Global Agri Pte. Ltd',
    iclReceivedComp: 'AE13', iclReceivedName: 'Olam International DMCC',
    entityString: 'E023 - SEDA-DMCC-OGA',
    depositId: 'DEP84421', depositRequest: '850000', depositTxn: '', requestNo: '', paymentBank: null,
  },
  {
    companyCode: 'AE11', transactionNo: 'TXN100260', requestStatus: 'Open', ottkNo: '102979',
    ottkAmount: 1215000, ottkCurr: 'USD', dealId: '12002170',
    businessArea: '0615', businessAreaName: 'OLAM GLOBAL AGRI PTE LTD',
    lcIssuanceBank: '6600013368', lcIssuanceBankName: 'BANESCO (PANAMA) S.A.',
    startDate: '2024-08-02', noOfDays: 180, interestRate: 1.2, interestCategory: 'Fixed',
    interestFrequency: 'Upfront', depositValue: 'DTY Discounted Value',
    iclGivenComp: 'SG03', iclGivenName: 'Olam Global Agri Pte. Ltd',
    iclReceivedComp: 'AE11', iclReceivedName: 'Olam Global Agri Pte. Ltd',
    entityString: 'E024 - DMCC-OGA-PAN',
    depositId: '', depositRequest: '', depositTxn: '', requestNo: '', paymentBank: null,
  },
  {
    companyCode: 'AE11', transactionNo: 'TXN100266', requestStatus: 'ICL Created', ottkNo: '102988',
    ottkAmount: 398000, ottkCurr: 'USD', dealId: '12002181',
    businessArea: '0615', businessAreaName: 'OLAM GLOBAL AGRI PTE LTD',
    lcIssuanceBank: '6600012956', lcIssuanceBankName: 'WESTPAC BANKING CORPORATION',
    startDate: '2024-05-15', noOfDays: 90, interestRate: 0.95, interestCategory: 'Fixed',
    interestFrequency: 'Arrears', depositValue: 'DTY Discounted Value',
    iclGivenComp: 'SG03', iclGivenName: 'Olam Global Agri Pte. Ltd',
    iclReceivedComp: 'AE11', iclReceivedName: 'Olam Global Agri Pte. Ltd',
    entityString: 'E025 - OGA-OSIPL-PAN',
    depositId: 'DEP84433', depositRequest: '850012', depositTxn: '960004', requestNo: '22001580', paymentBank: null,
  },
  {
    companyCode: 'SG03', transactionNo: 'TXN100271', requestStatus: 'Closed', ottkNo: '103002',
    ottkAmount: 525000, ottkCurr: 'USD', dealId: '12002195',
    businessArea: '0720', businessAreaName: 'OLAM GLOBAL AGRI SINGAPORE',
    lcIssuanceBank: '6600013411', lcIssuanceBankName: 'THE COMMERCIAL BANK OF QATAR',
    startDate: '2024-04-08', noOfDays: 120, interestRate: 1.1, interestCategory: 'Fixed',
    interestFrequency: 'Upfront', depositValue: 'DTY Discounted Value',
    iclGivenComp: 'AE13', iclGivenName: 'Olam International DMCC',
    iclReceivedComp: 'SG03', iclReceivedName: 'Olam Global Agri Pte. Ltd',
    entityString: 'E029 - AMBER-DMCC-OGA',
    depositId: 'DEP84402', depositRequest: '849990', depositTxn: '960000', requestNo: '22001560', paymentBank: null,
  },
  {
    companyCode: 'SG03', transactionNo: 'TXN100279', requestStatus: 'Open', ottkNo: '103018',
    ottkAmount: 762000, ottkCurr: 'USD', dealId: '12002203',
    businessArea: '0720', businessAreaName: 'OLAM GLOBAL AGRI SINGAPORE',
    lcIssuanceBank: '660000675', lcIssuanceBankName: 'ABU DHABI COMMERCIAL BANK DUBAI',
    startDate: '2024-08-19', noOfDays: 180, interestRate: 1.08, interestCategory: 'Fixed',
    interestFrequency: 'Upfront', depositValue: 'DTY Discounted Value',
    iclGivenComp: 'AE13', iclGivenName: 'Olam International DMCC',
    iclReceivedComp: 'SG03', iclReceivedName: 'Olam Global Agri Pte. Ltd',
    entityString: 'E021 - OGA-DMCC-PAN',
    depositId: '', depositRequest: '', depositTxn: '', requestNo: '', paymentBank: null,
  },
]

export const BANKS: readonly Bank[] = [
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
