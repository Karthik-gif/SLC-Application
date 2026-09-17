import type { BusinessPartner, CodeName, DocumentType, LimitRecord } from './types.ts'

/**
 * The lookups and limit rows the legacy page runs on.
 *
 * PLACEHOLDER DATA — there is no SAP source for any of it yet. The original carried these
 * literals inline as DEFAULT_DATA and only replaced them if a global DASHBOARD_PAYLOAD
 * happened to exist, which nothing ever defined, so the screen has never touched a backend.
 * When a service exists, this file is what it replaces; nothing else in the feature holds
 * seed values.
 */

export const COMPANY_CODES: readonly CodeName[] = [
  { code: 'AE13', name: 'Olam International DMCC' },
  { code: 'AE11', name: 'Olam Global Agri Pte. Ltd' },
  { code: 'SG03', name: 'Olam Global Agri Pte. Ltd' },
]

export const BANK_TYPES: readonly CodeName[] = [
  { code: '01', name: 'Origination Bank' },
  { code: '02', name: 'Distribution Bank' },
]

export const LIMIT_LEVEL_CHECKS: readonly CodeName[] = [
  { code: 'BP', name: 'BP Level' },
  { code: 'GRP', name: 'Group BP Level' },
  { code: 'BPGRP', name: 'BP & Group BP Level' },
]

export const LIMIT_TYPES: readonly CodeName[] = [
  { code: '01', name: 'Regular Limit' },
  { code: '02', name: 'Ad-Hoc Limit' },
]

export const STATUS_MAP: Readonly<Record<string, string>> = {
  '01': 'Limit Created',
  '02': 'Sent for Approval',
  '05': 'Limit Approved by Treasury Head (L3)',
  '09': 'Over-ridden with new Limit',
}

export const TRADER_MAP: Readonly<Record<string, string>> = {
  AE13: 'T20 Ramona',
  AE11: 'T15 Farah Yusof',
  SG03: 'T20 Ramona',
}

export const DOCUMENT_TYPES: readonly DocumentType[] = [
  { code: 'D01', desc: 'IDD+ Reports' },
  { code: 'D02', desc: 'Financial Statement 01' },
  { code: 'D03', desc: 'Financial Statement 02' },
  { code: 'D04', desc: 'Financial Statement 03' },
  { code: 'D05', desc: 'Financial Statement 04' },
  { code: 'D06', desc: 'Annual Report' },
  { code: 'D07', desc: 'Investor Presentation 01' },
  { code: 'D08', desc: 'Investor Presentation 02' },
  { code: 'D09', desc: 'Investor Presentation 03' },
  { code: 'D10', desc: 'Investor Presentation 04' },
  { code: 'D11', desc: 'Investor Presentation 05' },
  { code: 'D12', desc: 'Investor Presentation 06' },
]

export const BUSINESS_PARTNERS: readonly BusinessPartner[] = [
  { bankType: '02', code: '0660013444', name: 'BANKIA_Madrid' },
  { bankType: '02', code: '0660013443', name: 'BANCO SANTANDER_Madrid' },
  { bankType: '02', code: '0660013430', name: 'ABANCA_Madrid' },
  { bankType: '02', code: '0660012816', name: 'ABSA BANK_Johannesburg' },
  { bankType: '02', code: '0660013454', name: 'ACCESS BANK_London' },
  { bankType: '02', code: '0660012171', name: 'ANZ Bank_SEA' },
  { bankType: '02', code: '0660013468', name: 'ARAB BANKING CORP_Singapore' },
  { bankType: '02', code: '0660013440', name: 'AXIS BANK_Singapore' },
  { bankType: '02', code: '0660012542', name: 'Abu Dhabi Commercial_Dubai' },
  { bankType: '02', code: '0660015538', name: 'Agriculture Bank of China' },
  { bankType: '02', code: '0660013393', name: 'BACB,UK' },
  { bankType: '02', code: '0660013356', name: 'BACB_London' },
  { bankType: '02', code: '0660013455', name: 'BANCO CONTINENTAL_Paraguay' },
  { bankType: '02', code: '0660013441', name: 'BANCO DE CREDITO_Miami' },
  { bankType: '02', code: '0660013442', name: 'BANCO DE CREDITO_Santiago' },
  { bankType: '02', code: '0660013680', name: 'BANCO DO BRASIL_LONDON' },
  { bankType: '01', code: '0660013370', name: 'ACCESS BANK PLC_Nigeria' },
  { bankType: '01', code: '0660013454', name: 'ACCESS BANK_London' },
  { bankType: '01', code: '0660012542', name: 'Abu Dhabi Commercial_Dubai' },
  { bankType: '01', code: '0660015538', name: 'Agriculture Bank of China' },
  { bankType: '01', code: '0660013708', name: 'BAC International Bank_Panama' },
  { bankType: '01', code: '0660013544', name: 'BANCO BRADESCO S.A._NEW YORK' },
  { bankType: '01', code: '0660013455', name: 'BANCO CONTINENTAL_Paraguay' },
  { bankType: '01', code: '0660014570', name: 'BANCO DE AMERICA CENTRAL, S.A.' },
  { bankType: '01', code: '0660013457', name: 'BANCO DE BOGOTA_Colombia' },
  { bankType: '01', code: '0660013459', name: 'BANCO DE LA PRODUCCIO_Ecuador' },
  { bankType: '01', code: '0660013458', name: 'BANCO DEL PACIFICO_Ecuador' },
  { bankType: '01', code: '0660013680', name: 'BANCO DO BRASIL_LONDON' },
  { bankType: '01', code: '0660013464', name: 'BANCO DO BRASIL_NY' },
  { bankType: '01', code: '0660012992', name: 'BANCO DO BRASIL_Tokyo' },
]

export const GROUP_BPS: readonly CodeName[] = [
  { code: 'GRP001', name: 'Olam Treasury Group' },
  { code: 'GRP002', name: 'Regional Banking Group' },
]

/** The next free Group BP sequence number; the modal proposes GRP + this, zero padded. */
export const NEXT_GROUP_SEQ = 3

export const LIMIT_RECORDS: readonly LimitRecord[] = [
  { companyCode: 'SG03', bankType: '02', bpCode: '0660013444', bpName: 'BANKIA SA', limitType: '01', limitLevelCheck: 'BP', startDate: '2021-03-12', endDate: '2022-03-12', amount: 100000000, statusCode: '05', documents: {} },
  { companyCode: 'SG03', bankType: '02', bpCode: '0660013444', bpName: 'BANKIA SA', limitType: '01', limitLevelCheck: 'BP', startDate: '2026-09-10', endDate: '2027-09-10', amount: 100000000, statusCode: '01', documents: {} },
  { companyCode: 'SG03', bankType: '02', bpCode: '0660013443', bpName: 'BANCO SANTANDER SA', limitType: '01', limitLevelCheck: 'BP', startDate: '2022-04-04', endDate: '2023-04-04', amount: 150000000, statusCode: '09', documents: {} },
  { companyCode: 'SG03', bankType: '02', bpCode: '0660013443', bpName: 'BANCO SANTANDER SA', limitType: '01', limitLevelCheck: 'BP', startDate: '2023-04-04', endDate: '2024-04-04', amount: 150000000, statusCode: '09', documents: {} },
  { companyCode: 'SG03', bankType: '02', bpCode: '0660013443', bpName: 'BANCO SANTANDER SA', limitType: '01', limitLevelCheck: 'BP', startDate: '2024-04-04', endDate: '2025-04-04', amount: 150000000, statusCode: '09', documents: {} },
  { companyCode: 'SG03', bankType: '02', bpCode: '0660013443', bpName: 'BANCO SANTANDER SA', limitType: '01', limitLevelCheck: 'BP', startDate: '2025-04-04', endDate: '2026-04-04', amount: 150000000, statusCode: '05', documents: {} },
  { companyCode: 'SG03', bankType: '02', bpCode: '0660013430', bpName: 'ABANCA SA', limitType: '01', limitLevelCheck: 'BP', startDate: '2024-06-01', endDate: '2025-06-01', amount: 75000000, statusCode: '05', documents: {} },
  { companyCode: 'SG03', bankType: '02', bpCode: '0660012816', bpName: 'ABSA BANK LTD', limitType: '02', limitLevelCheck: 'GRP', startDate: '2025-01-15', endDate: '2025-07-15', amount: 60000000, statusCode: '01', documents: {} },
  { companyCode: 'SG03', bankType: '02', bpCode: '0660013454', bpName: 'ACCESS BANK PLC', limitType: '01', limitLevelCheck: 'BPGRP', startDate: '2023-09-20', endDate: '2024-09-20', amount: 45000000, statusCode: '09', documents: {} },
  { companyCode: 'AE13', bankType: '01', bpCode: '0660013370', bpName: 'ACCESS BANK PLC NIGERIA', limitType: '01', limitLevelCheck: 'BP', startDate: '2024-02-10', endDate: '2025-02-10', amount: 120000000, statusCode: '05', documents: {} },
  { companyCode: 'AE13', bankType: '01', bpCode: '0660013370', bpName: 'ACCESS BANK PLC NIGERIA', limitType: '01', limitLevelCheck: 'BP', startDate: '2026-09-10', endDate: '2027-09-10', amount: 120000000, statusCode: '01', documents: {} },
  { companyCode: 'AE13', bankType: '01', bpCode: '0660012542', bpName: 'ABU DHABI COMMERCIAL BANK', limitType: '01', limitLevelCheck: 'BP', startDate: '2023-05-05', endDate: '2024-05-05', amount: 200000000, statusCode: '09', documents: {} },
  { companyCode: 'AE13', bankType: '01', bpCode: '0660012542', bpName: 'ABU DHABI COMMERCIAL BANK', limitType: '01', limitLevelCheck: 'BP', startDate: '2024-05-05', endDate: '2025-05-05', amount: 200000000, statusCode: '05', documents: {} },
  { companyCode: 'AE11', bankType: '01', bpCode: '0660015538', bpName: 'AGRICULTURE BANK OF CHINA', limitType: '02', limitLevelCheck: 'GRP', startDate: '2025-03-18', endDate: '2025-09-18', amount: 85000000, statusCode: '01', documents: {} },
  { companyCode: 'AE11', bankType: '01', bpCode: '0660013544', bpName: 'BANCO BRADESCO S.A.', limitType: '01', limitLevelCheck: 'BP', startDate: '2022-08-08', endDate: '2023-08-08', amount: 95000000, statusCode: '09', documents: {} },
  { companyCode: 'AE11', bankType: '01', bpCode: '0660013544', bpName: 'BANCO BRADESCO S.A.', limitType: '01', limitLevelCheck: 'BP', startDate: '2023-08-08', endDate: '2024-08-08', amount: 95000000, statusCode: '05', documents: {} },
  { companyCode: 'SG03', bankType: '02', bpCode: '0660013444', bpName: 'BANKIA SA', limitType: '02', limitLevelCheck: 'GRP', startDate: '2026-09-11', endDate: '2027-09-11', amount: 100000000, statusCode: '01', documents: {} },
  { companyCode: 'AE11', bankType: '01', bpCode: '0660015538', bpName: 'AGRICULTURE BANK OF CHINA', limitType: '01', limitLevelCheck: 'GRP', startDate: '2026-09-11', endDate: '2027-03-11', amount: 70000000, statusCode: '01', documents: {} },
  { companyCode: 'SG03', bankType: '02', bpCode: '0660013443', bpName: 'BANCO SANTANDER SA', limitType: '01', limitLevelCheck: 'BP', startDate: '2019-01-01', endDate: '2020-01-01', amount: 150000000, statusCode: '09', documents: {} },
  { companyCode: 'AE13', bankType: '01', bpCode: '0660012542', bpName: 'ABU DHABI COMMERCIAL BANK', limitType: '01', limitLevelCheck: 'BP', startDate: '2028-01-01', endDate: '2029-01-01', amount: 200000000, statusCode: '01', documents: {} },
]
