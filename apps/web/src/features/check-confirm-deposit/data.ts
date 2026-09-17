import type { DepositPayload } from './types.ts'

/**
 * The deposit list the legacy page runs on.
 *
 * QUARANTINED PLACEHOLDER. Check_Confirm_Deposit_v8.html reads an optional global
 * CHECK_CONFIRM_PAYLOAD that nothing ever defines and falls back to this literal, so the
 * screen has never called a backend and no SAP entity exists for it yet. When a real
 * service arrives, this file is what it replaces; nothing else in the feature holds data.
 */
export const DUMMY_PAYLOAD: DepositPayload = {
  companyCodes: [
    { code: 'AE13', name: 'Olam International DMCC' },
    { code: 'AE11', name: 'Olam Global Agri Pte. Ltd' },
    { code: 'SG03', name: 'Olam Global Agri Pte. Ltd' },
  ],
  statuses: ['Contract', 'Contract Settlement'],
  records: [
    {
      companyCode: 'AE13', companyName: 'Olam International DMCC', activityCatName: 'Money Market Deposit',
      transactionTypeDesc: 'Deposit Creation', iclRequestNo: '22001595', ottkNo: '102934', transactionNo: 'TXN100234',
      dealId: '12002126', startDate: '11-07-2024', noOfDays: 180, tradeValue: 1000000, currency: 'USD',
      bankName: 'ABU DHABI COMMERCIAL BANK DUBAI', houseBank: 'BA104', accountId: '000002312123', partnerBank: 'EUR1',
      entityId: 'E021', client: '100', activeActivity: 'Yes', activityCategory: 'MMDP', productType: 'Deposit',
      refInterestRate: 0.85, spreadRate: 0.15, status: 'Contract',
    },
    {
      companyCode: 'AE13', companyName: 'Olam International DMCC', activityCatName: 'Money Market Deposit',
      transactionTypeDesc: 'Deposit Creation', iclRequestNo: '22001596', ottkNo: '102951', transactionNo: 'TXN100241',
      dealId: '12002144', startDate: '14-07-2024', noOfDays: 150, tradeValue: 850000, currency: 'USD',
      bankName: 'ABU DHABI COMMERCIAL BANK DUBAI', houseBank: 'BA104', accountId: '000002312123', partnerBank: 'EUR1',
      entityId: 'E022', client: '100', activeActivity: 'Yes', activityCategory: 'MMDP', productType: 'Deposit',
      refInterestRate: 1.0, spreadRate: 0.15, status: 'Contract',
    },
    {
      companyCode: 'AE13', companyName: 'Olam International DMCC', activityCatName: 'Money Market Deposit',
      transactionTypeDesc: 'Deposit Settlement', iclRequestNo: '22001560', ottkNo: '103002', transactionNo: 'TXN100271',
      dealId: '12002195', startDate: '08-04-2024', noOfDays: 120, tradeValue: 525000, currency: 'USD',
      bankName: 'THE COMMERCIAL BANK OF QATAR', houseBank: 'CB102', accountId: '110011494728', partnerBank: '',
      entityId: 'E029', client: '100', activeActivity: 'Yes', activityCategory: 'MMDP', productType: 'Deposit',
      refInterestRate: 0.95, spreadRate: 0.15, status: 'Contract Settlement',
    },
    {
      companyCode: 'AE11', companyName: 'Olam Global Agri Pte. Ltd', activityCatName: 'Money Market Deposit',
      transactionTypeDesc: 'Deposit Creation', iclRequestNo: '22001580', ottkNo: '102988', transactionNo: 'TXN100266',
      dealId: '12002181', startDate: '15-05-2024', noOfDays: 90, tradeValue: 398000, currency: 'USD',
      bankName: 'WESTPAC BANKING CORPORATION', houseBank: 'DBS01', accountId: '0720028210', partnerBank: 'USD1',
      entityId: 'E025', client: '100', activeActivity: 'Yes', activityCategory: 'MMDP', productType: 'Deposit',
      refInterestRate: 0.8, spreadRate: 0.15, status: 'Contract',
    },
    {
      companyCode: 'AE11', companyName: 'Olam Global Agri Pte. Ltd', activityCatName: 'Money Market Deposit',
      transactionTypeDesc: 'Deposit Settlement', iclRequestNo: '22001581', ottkNo: '102979', transactionNo: 'TXN100260',
      dealId: '12002170', startDate: '02-08-2024', noOfDays: 180, tradeValue: 1215000, currency: 'USD',
      bankName: 'BANESCO (PANAMA) S.A.', houseBank: 'CHAUS', accountId: '816659236', partnerBank: 'MUL1',
      entityId: 'E024', client: '100', activeActivity: 'Yes', activityCategory: 'MMDP', productType: 'Deposit',
      refInterestRate: 1.05, spreadRate: 0.15, status: 'Contract Settlement',
    },
    {
      companyCode: 'SG03', companyName: 'Olam Global Agri Pte. Ltd', activityCatName: 'Money Market Deposit',
      transactionTypeDesc: 'Deposit Creation', iclRequestNo: '22001597', ottkNo: '103018', transactionNo: 'TXN100279',
      dealId: '12002203', startDate: '19-08-2024', noOfDays: 180, tradeValue: 762000, currency: 'USD',
      bankName: 'ABU DHABI COMMERCIAL BANK DUBAI', houseBank: 'SCB01', accountId: '0105944491', partnerBank: 'USD1',
      entityId: 'E021', client: '100', activeActivity: 'Yes', activityCategory: 'MMDP', productType: 'Deposit',
      refInterestRate: 0.93, spreadRate: 0.15, status: 'Contract',
    },
    {
      companyCode: 'SG03', companyName: 'Olam Global Agri Pte. Ltd', activityCatName: 'Money Market Deposit',
      transactionTypeDesc: 'Deposit Creation', iclRequestNo: '22001598', ottkNo: '103027', transactionNo: 'TXN100284',
      dealId: '12002211', startDate: '05-09-2024', noOfDays: 120, tradeValue: 915000, currency: 'USD',
      bankName: 'QATAR NATIONAL BANK (QPSC)', houseBank: 'JPM01', accountId: '6581117386', partnerBank: '',
      entityId: 'E023', client: '100', activeActivity: 'Yes', activityCategory: 'MMDP', productType: 'Deposit',
      refInterestRate: 0.88, spreadRate: 0.15, status: 'Contract',
    },
  ],
}
