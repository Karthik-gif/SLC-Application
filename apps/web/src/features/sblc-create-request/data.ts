import type { AmountMultipliers, RequestColumn, SblcColumn, SblcRecord, SeriesConfig } from './types.ts'

/**
 * The model the legacy Create SBLC Request page runs on.
 *
 * QUARANTINED placeholder data. Create_SBLC_Request_Modern_v5.html embedded this entire
 * model in an inline <script type="application/json"> block and never called a service, so
 * there is no SAP entity behind it yet. When one exists this file is what it replaces —
 * nothing else in the feature carries literals from the original.
 */

export const REQUEST_TYPES: readonly string[] = [
  "SBLC Treasury",
  "SBLC TSF"
]

/** Request numbers are minted client side by walking this series past the numbers in use. */
export const REQUEST_NUMBER: SeriesConfig = {
  "start": 26000571,
  "step": 1
}

/** Records that arrive without an SBLC transaction number get one from this series. */
export const SBLC_TRANSACTION: SeriesConfig = {
  "start": 5153400000,
  "step": 95
}

/** Suffixes the amount field accepts: 5M, 2.5CR, 800K. */
export const AMOUNT_MULTIPLIERS: AmountMultipliers = {
  "K": 1000,
  "L": 100000,
  "M": 1000000,
  "CR": 10000000,
  "B": 1000000000
}

export const SBLC_COLUMNS: readonly SblcColumn[] = [
  {
    "key": "slcStructure",
    "label": "SLC Structure",
    "width": 120,
    "type": "text"
  },
  {
    "key": "entityString",
    "label": "Entity String",
    "width": 170,
    "type": "text"
  },
  {
    "key": "ottkBankDesc",
    "label": "OTTK Bank Desc",
    "width": 295,
    "type": "text"
  },
  {
    "key": "ottkNo",
    "label": "OTTK No",
    "width": 95,
    "type": "text"
  },
  {
    "key": "ottkValue",
    "label": "OTTK Value",
    "width": 125,
    "type": "number"
  },
  {
    "key": "ottkCurr",
    "label": "OTTK Curr",
    "width": 90,
    "type": "text"
  },
  {
    "key": "trader",
    "label": "Trader",
    "width": 110,
    "type": "text"
  },
  {
    "key": "ottkStatDesc",
    "label": "OTTK Stat Desc",
    "width": 205,
    "type": "text"
  },
  {
    "key": "dealId",
    "label": "Deal ID",
    "width": 105,
    "type": "text"
  },
  {
    "key": "dttkNo",
    "label": "DTTK No",
    "width": 95,
    "type": "text"
  },
  {
    "key": "proposedSblcAmt",
    "label": "Proposed SBLC Amt",
    "width": 145,
    "type": "number"
  },
  {
    "key": "sblcTxn",
    "label": "SBLC Txn",
    "width": 115,
    "type": "text"
  },
  {
    "key": "sblcAmt",
    "label": "SBLC Amt",
    "width": 125,
    "type": "number"
  }
]

export const REQUEST_COLUMNS: readonly RequestColumn[] = [
  {
    "key": "startDate",
    "label": "Start Date",
    "width": 105,
    "type": "date"
  },
  {
    "key": "endDate",
    "label": "End Date",
    "width": 105,
    "type": "date"
  },
  {
    "key": "expEndDate",
    "label": "Exp. End Date",
    "width": 110,
    "type": "date"
  },
  {
    "key": "amount",
    "label": "Amount",
    "width": 155,
    "type": "number"
  },
  {
    "key": "requestType",
    "label": "SBLC Request Type",
    "width": 155,
    "type": "requestType"
  },
  {
    "key": "companyCode",
    "label": "Co.Code",
    "width": 90,
    "type": "text"
  },
  {
    "key": "beneficiary",
    "label": "Beneficiary",
    "width": 115,
    "type": "text"
  },
  {
    "key": "beneficiaryName",
    "label": "Beneficiary Name",
    "width": 235,
    "type": "text"
  },
  {
    "key": "requestNo",
    "label": "Request No",
    "width": 115,
    "type": "text"
  },
  {
    "key": "create",
    "label": "Create",
    "width": 95,
    "type": "action"
  }
]

export const SBLC_RECORDS: readonly SblcRecord[] = [
  {
    "id": 1,
    "tsfStructure": "Structured LCs",
    "slcStructure": "LC Prepayment",
    "entityString": "E021 - OGA-DMCC-PAN",
    "entityId": "E021",
    "ottkBankDesc": "0660013385 - GULF BANK KSCP",
    "ottkNo": "100486",
    "ottkValue": 30000000,
    "ottkCurr": "USD",
    "trader": "Rahul Yadav",
    "ottkStatDesc": "06 - Fully Assigned to Deal ID",
    "ottkStatus": "06",
    "dealId": "12000691",
    "dttkNo": "200540",
    "proposedSblcAmt": 30000000,
    "sblcTxn": "5153400000",
    "sblcAmt": 30000000,
    "companyCode": "AE13",
    "companyName": "Olam International DMCC",
    "businessArea": "0615",
    "businessAreaName": "OLAM INTERNATIONAL DMCC",
    "requestRows": [
      {
        "startDate": "24-03-2025",
        "endDate": "08-05-2025",
        "expEndDate": "08-05-2025",
        "amount": 29989856,
        "requestType": "SBLC Treasury",
        "companyCode": "AE13",
        "beneficiary": "0660013385",
        "beneficiaryName": "GULF BANK KSCP",
        "requestNo": "26000571",
        "id": "A",
        "variants": [
          {
            "startDate": "24-03-2025",
            "endDate": "08-05-2025",
            "expEndDate": "08-05-2025",
            "amount": 29989856,
            "requestType": "SBLC Treasury",
            "companyCode": "AE13",
            "beneficiary": "0660013385",
            "beneficiaryName": "GULF BANK KSCP",
            "requestNo": "26000571"
          },
          {
            "startDate": "09-05-2025",
            "endDate": "23-06-2025",
            "expEndDate": "23-06-2025",
            "amount": 12600000,
            "requestType": "SBLC TSF",
            "companyCode": "AE13",
            "beneficiary": "0660013385",
            "beneficiaryName": "GULF BANK KSCP",
            "requestNo": ""
          }
        ]
      }
    ],
    "requestNo": "26000571"
  },
  {
    "id": 2,
    "tsfStructure": "Structured LCs",
    "slcStructure": "LC Prepayment",
    "entityString": "E022 - OGA-SG",
    "entityId": "E022",
    "ottkBankDesc": "0660013368 - BANESCO (PANAMA) S.A.",
    "ottkNo": "100487",
    "ottkValue": 10000000,
    "ottkCurr": "USD",
    "trader": "Ignacio",
    "ottkStatDesc": "06 - Fully Assigned to Deal ID",
    "ottkStatus": "06",
    "dealId": "12000692",
    "dttkNo": "200541",
    "proposedSblcAmt": 10000000,
    "sblcTxn": "",
    "sblcAmt": "",
    "companyCode": "AE13",
    "companyName": "Olam International DMCC",
    "businessArea": "0615",
    "businessAreaName": "OLAM INTERNATIONAL DMCC",
    "requestRows": [
      {
        "startDate": "24-03-2025",
        "endDate": "08-05-2025",
        "expEndDate": "08-05-2025",
        "amount": 9989856,
        "requestType": "SBLC Treasury",
        "companyCode": "AE13",
        "beneficiary": "0660013368",
        "beneficiaryName": "BANESCO (PANAMA) S.A.",
        "requestNo": "",
        "id": "A",
        "variants": [
          {
            "startDate": "24-03-2025",
            "endDate": "08-05-2025",
            "expEndDate": "08-05-2025",
            "amount": 9989856,
            "requestType": "SBLC Treasury",
            "companyCode": "AE13",
            "beneficiary": "0660013368",
            "beneficiaryName": "BANESCO (PANAMA) S.A.",
            "requestNo": ""
          },
          {
            "startDate": "09-05-2025",
            "endDate": "23-06-2025",
            "expEndDate": "23-06-2025",
            "amount": 4200000,
            "requestType": "SBLC TSF",
            "companyCode": "AE13",
            "beneficiary": "0660013368",
            "beneficiaryName": "BANESCO (PANAMA) S.A.",
            "requestNo": ""
          }
        ]
      }
    ],
    "requestNo": ""
  },
  {
    "id": 3,
    "tsfStructure": "Structured LCs",
    "slcStructure": "LC Prepayment",
    "entityString": "E023 - OGA-CT",
    "entityId": "E023",
    "ottkBankDesc": "0660013362 - ITAU UNIBANCO S.A., NASSAU BRANCH",
    "ottkNo": "100488",
    "ottkValue": 50000000,
    "ottkCurr": "USD",
    "trader": "Riccardo R",
    "ottkStatDesc": "06 - Fully Assigned to Deal ID",
    "ottkStatus": "06",
    "dealId": "12000693",
    "dttkNo": "200542",
    "proposedSblcAmt": 50000000,
    "sblcTxn": "",
    "sblcAmt": "",
    "companyCode": "SG03",
    "companyName": "Olam Global Agri Pte. Ltd",
    "businessArea": "0630",
    "businessAreaName": "OLAM GLOBAL AGRI PTE. LTD",
    "requestRows": [
      {
        "startDate": "24-03-2025",
        "endDate": "08-05-2025",
        "expEndDate": "08-05-2025",
        "amount": 49989856,
        "requestType": "SBLC Treasury",
        "companyCode": "SG03",
        "beneficiary": "0660013362",
        "beneficiaryName": "ITAU UNIBANCO S.A., NASSAU BRANCH",
        "requestNo": "",
        "id": "A",
        "variants": [
          {
            "startDate": "24-03-2025",
            "endDate": "08-05-2025",
            "expEndDate": "08-05-2025",
            "amount": 49989856,
            "requestType": "SBLC Treasury",
            "companyCode": "SG03",
            "beneficiary": "0660013362",
            "beneficiaryName": "ITAU UNIBANCO S.A., NASSAU BRANCH",
            "requestNo": ""
          },
          {
            "startDate": "09-05-2025",
            "endDate": "23-06-2025",
            "expEndDate": "23-06-2025",
            "amount": 21000000,
            "requestType": "SBLC TSF",
            "companyCode": "SG03",
            "beneficiary": "0660013362",
            "beneficiaryName": "ITAU UNIBANCO S.A., NASSAU BRANCH",
            "requestNo": ""
          }
        ]
      }
    ],
    "requestNo": ""
  },
  {
    "id": 4,
    "tsfStructure": "Structured LCs",
    "slcStructure": "LC Prepayment",
    "entityString": "E021 - OGA-DMCC-PAN",
    "entityId": "E021",
    "ottkBankDesc": "0660013462 - GLOBAL BANK CORPORATION AND SUBSIDI",
    "ottkNo": "100489",
    "ottkValue": 25000000,
    "ottkCurr": "USD",
    "trader": "Omer Khan",
    "ottkStatDesc": "04 - Partially Assigned",
    "ottkStatus": "04",
    "dealId": "12000694",
    "dttkNo": "200543",
    "proposedSblcAmt": 25000000,
    "sblcTxn": "",
    "sblcAmt": "",
    "companyCode": "AE11",
    "companyName": "Olam Global Agri",
    "businessArea": "0605",
    "businessAreaName": "OLAM GLOBAL AGRI",
    "requestRows": [
      {
        "startDate": "24-03-2025",
        "endDate": "08-05-2025",
        "expEndDate": "08-05-2025",
        "amount": 24989856,
        "requestType": "SBLC Treasury",
        "companyCode": "AE11",
        "beneficiary": "0660013462",
        "beneficiaryName": "GLOBAL BANK CORPORATION AND SUBSIDI",
        "requestNo": "",
        "id": "A",
        "variants": [
          {
            "startDate": "24-03-2025",
            "endDate": "08-05-2025",
            "expEndDate": "08-05-2025",
            "amount": 24989856,
            "requestType": "SBLC Treasury",
            "companyCode": "AE11",
            "beneficiary": "0660013462",
            "beneficiaryName": "GLOBAL BANK CORPORATION AND SUBSIDI",
            "requestNo": ""
          },
          {
            "startDate": "09-05-2025",
            "endDate": "23-06-2025",
            "expEndDate": "23-06-2025",
            "amount": 10500000,
            "requestType": "SBLC TSF",
            "companyCode": "AE11",
            "beneficiary": "0660013462",
            "beneficiaryName": "GLOBAL BANK CORPORATION AND SUBSIDI",
            "requestNo": ""
          }
        ]
      }
    ],
    "requestNo": ""
  },
  {
    "id": 5,
    "tsfStructure": "Structured LCs",
    "slcStructure": "LC Prepayment",
    "entityString": "E022 - OGA-SG",
    "entityId": "E022",
    "ottkBankDesc": "0660013379 - BANCO ABC BRASIL S.A.",
    "ottkNo": "100490",
    "ottkValue": 20000000,
    "ottkCurr": "USD",
    "trader": "Andre",
    "ottkStatDesc": "06 - Fully Assigned to Deal ID",
    "ottkStatus": "06",
    "dealId": "12000695",
    "dttkNo": "200544",
    "proposedSblcAmt": 20000000,
    "sblcTxn": "",
    "sblcAmt": "",
    "companyCode": "AE13",
    "companyName": "Olam International DMCC",
    "businessArea": "0615",
    "businessAreaName": "OLAM INTERNATIONAL DMCC",
    "requestRows": [
      {
        "startDate": "24-03-2025",
        "endDate": "08-05-2025",
        "expEndDate": "08-05-2025",
        "amount": 19989856,
        "requestType": "SBLC Treasury",
        "companyCode": "AE13",
        "beneficiary": "0660013379",
        "beneficiaryName": "BANCO ABC BRASIL S.A.",
        "requestNo": "",
        "id": "A",
        "variants": [
          {
            "startDate": "24-03-2025",
            "endDate": "08-05-2025",
            "expEndDate": "08-05-2025",
            "amount": 19989856,
            "requestType": "SBLC Treasury",
            "companyCode": "AE13",
            "beneficiary": "0660013379",
            "beneficiaryName": "BANCO ABC BRASIL S.A.",
            "requestNo": ""
          },
          {
            "startDate": "09-05-2025",
            "endDate": "23-06-2025",
            "expEndDate": "23-06-2025",
            "amount": 8400000,
            "requestType": "SBLC TSF",
            "companyCode": "AE13",
            "beneficiary": "0660013379",
            "beneficiaryName": "BANCO ABC BRASIL S.A.",
            "requestNo": ""
          }
        ]
      }
    ],
    "requestNo": ""
  },
  {
    "id": 6,
    "tsfStructure": "Structured LCs",
    "slcStructure": "LC Prepayment",
    "entityString": "E023 - OGA-CT",
    "entityId": "E023",
    "ottkBankDesc": "0660013457 - BANCO DE BOGOTA S.A.",
    "ottkNo": "100491",
    "ottkValue": 8000000,
    "ottkCurr": "USD",
    "trader": "Akshay M",
    "ottkStatDesc": "06 - Fully Assigned to Deal ID",
    "ottkStatus": "06",
    "dealId": "12000696",
    "dttkNo": "200545",
    "proposedSblcAmt": 8000000,
    "sblcTxn": "5153400095",
    "sblcAmt": 7999098.9,
    "companyCode": "AE13",
    "companyName": "Olam International DMCC",
    "businessArea": "0615",
    "businessAreaName": "OLAM INTERNATIONAL DMCC",
    "requestRows": [
      {
        "startDate": "24-03-2025",
        "endDate": "08-05-2025",
        "expEndDate": "08-05-2025",
        "amount": 7989856,
        "requestType": "SBLC Treasury",
        "companyCode": "AE13",
        "beneficiary": "0660013457",
        "beneficiaryName": "BANCO DE BOGOTA S.A.",
        "requestNo": "",
        "id": "A",
        "variants": [
          {
            "startDate": "24-03-2025",
            "endDate": "08-05-2025",
            "expEndDate": "08-05-2025",
            "amount": 7989856,
            "requestType": "SBLC Treasury",
            "companyCode": "AE13",
            "beneficiary": "0660013457",
            "beneficiaryName": "BANCO DE BOGOTA S.A.",
            "requestNo": ""
          },
          {
            "startDate": "09-05-2025",
            "endDate": "23-06-2025",
            "expEndDate": "23-06-2025",
            "amount": 3360000,
            "requestType": "SBLC TSF",
            "companyCode": "AE13",
            "beneficiary": "0660013457",
            "beneficiaryName": "BANCO DE BOGOTA S.A.",
            "requestNo": ""
          }
        ]
      }
    ],
    "requestNo": ""
  },
  {
    "id": 7,
    "tsfStructure": "Structured LCs",
    "slcStructure": "LC Prepayment",
    "entityString": "E021 - OGA-DMCC-PAN",
    "entityId": "E021",
    "ottkBankDesc": "0660013365 - BANCO SAFRA S.A.",
    "ottkNo": "100492",
    "ottkValue": 15000000,
    "ottkCurr": "USD",
    "trader": "Rahul Yadav",
    "ottkStatDesc": "06 - Fully Assigned to Deal ID",
    "ottkStatus": "06",
    "dealId": "12000697",
    "dttkNo": "200546",
    "proposedSblcAmt": 15000000,
    "sblcTxn": "",
    "sblcAmt": "",
    "companyCode": "SG03",
    "companyName": "Olam Global Agri Pte. Ltd",
    "businessArea": "0630",
    "businessAreaName": "OLAM GLOBAL AGRI PTE. LTD",
    "requestRows": [
      {
        "startDate": "24-03-2025",
        "endDate": "08-05-2025",
        "expEndDate": "08-05-2025",
        "amount": 14989856,
        "requestType": "SBLC Treasury",
        "companyCode": "SG03",
        "beneficiary": "0660013365",
        "beneficiaryName": "BANCO SAFRA S.A.",
        "requestNo": "",
        "id": "A",
        "variants": [
          {
            "startDate": "24-03-2025",
            "endDate": "08-05-2025",
            "expEndDate": "08-05-2025",
            "amount": 14989856,
            "requestType": "SBLC Treasury",
            "companyCode": "SG03",
            "beneficiary": "0660013365",
            "beneficiaryName": "BANCO SAFRA S.A.",
            "requestNo": ""
          },
          {
            "startDate": "09-05-2025",
            "endDate": "23-06-2025",
            "expEndDate": "23-06-2025",
            "amount": 6300000,
            "requestType": "SBLC TSF",
            "companyCode": "SG03",
            "beneficiary": "0660013365",
            "beneficiaryName": "BANCO SAFRA S.A.",
            "requestNo": ""
          }
        ]
      }
    ],
    "requestNo": ""
  },
  {
    "id": 8,
    "tsfStructure": "Structured LCs",
    "slcStructure": "LC Prepayment",
    "entityString": "E022 - OGA-SG",
    "entityId": "E022",
    "ottkBankDesc": "0660013464 - BANCO DO BRASIL S.A.",
    "ottkNo": "100493",
    "ottkValue": 40000000,
    "ottkCurr": "USD",
    "trader": "Ignacio",
    "ottkStatDesc": "04 - Partially Assigned",
    "ottkStatus": "04",
    "dealId": "12000698",
    "dttkNo": "200547",
    "proposedSblcAmt": 40000000,
    "sblcTxn": "",
    "sblcAmt": "",
    "companyCode": "AE11",
    "companyName": "Olam Global Agri",
    "businessArea": "0605",
    "businessAreaName": "OLAM GLOBAL AGRI",
    "requestRows": [
      {
        "startDate": "24-03-2025",
        "endDate": "08-05-2025",
        "expEndDate": "08-05-2025",
        "amount": 39989856,
        "requestType": "SBLC Treasury",
        "companyCode": "AE11",
        "beneficiary": "0660013464",
        "beneficiaryName": "BANCO DO BRASIL S.A.",
        "requestNo": "26000592",
        "id": "A",
        "variants": [
          {
            "startDate": "24-03-2025",
            "endDate": "08-05-2025",
            "expEndDate": "08-05-2025",
            "amount": 39989856,
            "requestType": "SBLC Treasury",
            "companyCode": "AE11",
            "beneficiary": "0660013464",
            "beneficiaryName": "BANCO DO BRASIL S.A.",
            "requestNo": "26000592"
          },
          {
            "startDate": "09-05-2025",
            "endDate": "23-06-2025",
            "expEndDate": "23-06-2025",
            "amount": 16800000,
            "requestType": "SBLC TSF",
            "companyCode": "AE11",
            "beneficiary": "0660013464",
            "beneficiaryName": "BANCO DO BRASIL S.A.",
            "requestNo": ""
          }
        ]
      }
    ],
    "requestNo": "26000592"
  },
  {
    "id": 9,
    "tsfStructure": "Structured LCs",
    "slcStructure": "LC Prepayment",
    "entityString": "E023 - OGA-CT",
    "entityId": "E023",
    "ottkBankDesc": "0660013377 - BANCO BRADESCO S.A.",
    "ottkNo": "100494",
    "ottkValue": 100000000,
    "ottkCurr": "USD",
    "trader": "Riccardo R",
    "ottkStatDesc": "06 - Fully Assigned to Deal ID",
    "ottkStatus": "06",
    "dealId": "12000699",
    "dttkNo": "200548",
    "proposedSblcAmt": 100000000,
    "sblcTxn": "",
    "sblcAmt": "",
    "companyCode": "AE13",
    "companyName": "Olam International DMCC",
    "businessArea": "0615",
    "businessAreaName": "OLAM INTERNATIONAL DMCC",
    "requestRows": [
      {
        "startDate": "24-03-2025",
        "endDate": "08-05-2025",
        "expEndDate": "08-05-2025",
        "amount": 99989856,
        "requestType": "SBLC Treasury",
        "companyCode": "AE13",
        "beneficiary": "0660013377",
        "beneficiaryName": "BANCO BRADESCO S.A.",
        "requestNo": "",
        "id": "A",
        "variants": [
          {
            "startDate": "24-03-2025",
            "endDate": "08-05-2025",
            "expEndDate": "08-05-2025",
            "amount": 99989856,
            "requestType": "SBLC Treasury",
            "companyCode": "AE13",
            "beneficiary": "0660013377",
            "beneficiaryName": "BANCO BRADESCO S.A.",
            "requestNo": ""
          },
          {
            "startDate": "09-05-2025",
            "endDate": "23-06-2025",
            "expEndDate": "23-06-2025",
            "amount": 42000000,
            "requestType": "SBLC TSF",
            "companyCode": "AE13",
            "beneficiary": "0660013377",
            "beneficiaryName": "BANCO BRADESCO S.A.",
            "requestNo": ""
          }
        ]
      }
    ],
    "requestNo": ""
  },
  {
    "id": 10,
    "tsfStructure": "Structured LCs",
    "slcStructure": "LC Prepayment",
    "entityString": "E021 - OGA-DMCC-PAN",
    "entityId": "E021",
    "ottkBankDesc": "0660013455 - BANCO CONTINENTAL S.A.E.C.A",
    "ottkNo": "100495",
    "ottkValue": 30000000,
    "ottkCurr": "USD",
    "trader": "Omer Khan",
    "ottkStatDesc": "06 - Fully Assigned to Deal ID",
    "ottkStatus": "06",
    "dealId": "12000700",
    "dttkNo": "200549",
    "proposedSblcAmt": 30000000,
    "sblcTxn": "",
    "sblcAmt": "",
    "companyCode": "AE13",
    "companyName": "Olam International DMCC",
    "businessArea": "0615",
    "businessAreaName": "OLAM INTERNATIONAL DMCC",
    "requestRows": [
      {
        "startDate": "24-03-2025",
        "endDate": "08-05-2025",
        "expEndDate": "08-05-2025",
        "amount": 29989856,
        "requestType": "SBLC Treasury",
        "companyCode": "AE13",
        "beneficiary": "0660013455",
        "beneficiaryName": "BANCO CONTINENTAL S.A.E.C.A",
        "requestNo": "",
        "id": "A",
        "variants": [
          {
            "startDate": "24-03-2025",
            "endDate": "08-05-2025",
            "expEndDate": "08-05-2025",
            "amount": 29989856,
            "requestType": "SBLC Treasury",
            "companyCode": "AE13",
            "beneficiary": "0660013455",
            "beneficiaryName": "BANCO CONTINENTAL S.A.E.C.A",
            "requestNo": ""
          },
          {
            "startDate": "09-05-2025",
            "endDate": "23-06-2025",
            "expEndDate": "23-06-2025",
            "amount": 12600000,
            "requestType": "SBLC TSF",
            "companyCode": "AE13",
            "beneficiary": "0660013455",
            "beneficiaryName": "BANCO CONTINENTAL S.A.E.C.A",
            "requestNo": ""
          }
        ]
      }
    ],
    "requestNo": ""
  },
  {
    "id": 11,
    "tsfStructure": "Structured LCs",
    "slcStructure": "LC Prepayment",
    "entityString": "E022 - OGA-SG",
    "entityId": "E022",
    "ottkBankDesc": "0660013680 - BANCO DO BRASIL S A",
    "ottkNo": "100496",
    "ottkValue": 10000000,
    "ottkCurr": "USD",
    "trader": "Andre",
    "ottkStatDesc": "06 - Fully Assigned to Deal ID",
    "ottkStatus": "06",
    "dealId": "12000701",
    "dttkNo": "200550",
    "proposedSblcAmt": 10000000,
    "sblcTxn": "5153400190",
    "sblcAmt": 9999549.45,
    "companyCode": "SG03",
    "companyName": "Olam Global Agri Pte. Ltd",
    "businessArea": "0630",
    "businessAreaName": "OLAM GLOBAL AGRI PTE. LTD",
    "requestRows": [
      {
        "startDate": "24-03-2025",
        "endDate": "08-05-2025",
        "expEndDate": "08-05-2025",
        "amount": 9989856,
        "requestType": "SBLC Treasury",
        "companyCode": "SG03",
        "beneficiary": "0660013680",
        "beneficiaryName": "BANCO DO BRASIL S A",
        "requestNo": "",
        "id": "A",
        "variants": [
          {
            "startDate": "24-03-2025",
            "endDate": "08-05-2025",
            "expEndDate": "08-05-2025",
            "amount": 9989856,
            "requestType": "SBLC Treasury",
            "companyCode": "SG03",
            "beneficiary": "0660013680",
            "beneficiaryName": "BANCO DO BRASIL S A",
            "requestNo": ""
          },
          {
            "startDate": "09-05-2025",
            "endDate": "23-06-2025",
            "expEndDate": "23-06-2025",
            "amount": 4200000,
            "requestType": "SBLC TSF",
            "companyCode": "SG03",
            "beneficiary": "0660013680",
            "beneficiaryName": "BANCO DO BRASIL S A",
            "requestNo": ""
          }
        ]
      }
    ],
    "requestNo": ""
  },
  {
    "id": 12,
    "tsfStructure": "Structured LCs",
    "slcStructure": "LC Prepayment",
    "entityString": "E023 - OGA-CT",
    "entityId": "E023",
    "ottkBankDesc": "0660015668 - BANK OF SHANGHAI, SHANGHAI",
    "ottkNo": "100497",
    "ottkValue": 50000000,
    "ottkCurr": "USD",
    "trader": "Akshay M",
    "ottkStatDesc": "04 - Partially Assigned",
    "ottkStatus": "04",
    "dealId": "12000702",
    "dttkNo": "200551",
    "proposedSblcAmt": 50000000,
    "sblcTxn": "",
    "sblcAmt": "",
    "companyCode": "AE11",
    "companyName": "Olam Global Agri",
    "businessArea": "0605",
    "businessAreaName": "OLAM GLOBAL AGRI",
    "requestRows": [
      {
        "startDate": "24-03-2025",
        "endDate": "08-05-2025",
        "expEndDate": "08-05-2025",
        "amount": 49989856,
        "requestType": "SBLC Treasury",
        "companyCode": "AE11",
        "beneficiary": "0660015668",
        "beneficiaryName": "BANK OF SHANGHAI, SHANGHAI",
        "requestNo": "",
        "id": "A",
        "variants": [
          {
            "startDate": "24-03-2025",
            "endDate": "08-05-2025",
            "expEndDate": "08-05-2025",
            "amount": 49989856,
            "requestType": "SBLC Treasury",
            "companyCode": "AE11",
            "beneficiary": "0660015668",
            "beneficiaryName": "BANK OF SHANGHAI, SHANGHAI",
            "requestNo": ""
          },
          {
            "startDate": "09-05-2025",
            "endDate": "23-06-2025",
            "expEndDate": "23-06-2025",
            "amount": 21000000,
            "requestType": "SBLC TSF",
            "companyCode": "AE11",
            "beneficiary": "0660015668",
            "beneficiaryName": "BANK OF SHANGHAI, SHANGHAI",
            "requestNo": ""
          }
        ]
      }
    ],
    "requestNo": ""
  },
  {
    "id": 13,
    "tsfStructure": "Structured LCs",
    "slcStructure": "LC Prepayment",
    "entityString": "E021 - OGA-DMCC-PAN",
    "entityId": "E021",
    "ottkBankDesc": "0660014519 - BANCO DAYCOVAL S.A.",
    "ottkNo": "100498",
    "ottkValue": 25000000,
    "ottkCurr": "USD",
    "trader": "Rahul Yadav",
    "ottkStatDesc": "06 - Fully Assigned to Deal ID",
    "ottkStatus": "06",
    "dealId": "12000703",
    "dttkNo": "200552",
    "proposedSblcAmt": 25000000,
    "sblcTxn": "",
    "sblcAmt": "",
    "companyCode": "AE13",
    "companyName": "Olam International DMCC",
    "businessArea": "0615",
    "businessAreaName": "OLAM INTERNATIONAL DMCC",
    "requestRows": [
      {
        "startDate": "24-03-2025",
        "endDate": "08-05-2025",
        "expEndDate": "08-05-2025",
        "amount": 24989856,
        "requestType": "SBLC Treasury",
        "companyCode": "AE13",
        "beneficiary": "0660014519",
        "beneficiaryName": "BANCO DAYCOVAL S.A.",
        "requestNo": "",
        "id": "A",
        "variants": [
          {
            "startDate": "24-03-2025",
            "endDate": "08-05-2025",
            "expEndDate": "08-05-2025",
            "amount": 24989856,
            "requestType": "SBLC Treasury",
            "companyCode": "AE13",
            "beneficiary": "0660014519",
            "beneficiaryName": "BANCO DAYCOVAL S.A.",
            "requestNo": ""
          },
          {
            "startDate": "09-05-2025",
            "endDate": "23-06-2025",
            "expEndDate": "23-06-2025",
            "amount": 10500000,
            "requestType": "SBLC TSF",
            "companyCode": "AE13",
            "beneficiary": "0660014519",
            "beneficiaryName": "BANCO DAYCOVAL S.A.",
            "requestNo": ""
          }
        ]
      }
    ],
    "requestNo": ""
  },
  {
    "id": 14,
    "tsfStructure": "Structured LCs",
    "slcStructure": "LC Prepayment",
    "entityString": "E022 - OGA-SG",
    "entityId": "E022",
    "ottkBankDesc": "0660013376 - BANCO SANTANDER (BRASIL) S.A.",
    "ottkNo": "100499",
    "ottkValue": 20000000,
    "ottkCurr": "USD",
    "trader": "Ignacio",
    "ottkStatDesc": "06 - Fully Assigned to Deal ID",
    "ottkStatus": "06",
    "dealId": "12000704",
    "dttkNo": "200553",
    "proposedSblcAmt": 20000000,
    "sblcTxn": "",
    "sblcAmt": "",
    "companyCode": "AE13",
    "companyName": "Olam International DMCC",
    "businessArea": "0615",
    "businessAreaName": "OLAM INTERNATIONAL DMCC",
    "requestRows": [
      {
        "startDate": "24-03-2025",
        "endDate": "08-05-2025",
        "expEndDate": "08-05-2025",
        "amount": 19989856,
        "requestType": "SBLC Treasury",
        "companyCode": "AE13",
        "beneficiary": "0660013376",
        "beneficiaryName": "BANCO SANTANDER (BRASIL) S.A.",
        "requestNo": "",
        "id": "A",
        "variants": [
          {
            "startDate": "24-03-2025",
            "endDate": "08-05-2025",
            "expEndDate": "08-05-2025",
            "amount": 19989856,
            "requestType": "SBLC Treasury",
            "companyCode": "AE13",
            "beneficiary": "0660013376",
            "beneficiaryName": "BANCO SANTANDER (BRASIL) S.A.",
            "requestNo": ""
          },
          {
            "startDate": "09-05-2025",
            "endDate": "23-06-2025",
            "expEndDate": "23-06-2025",
            "amount": 8400000,
            "requestType": "SBLC TSF",
            "companyCode": "AE13",
            "beneficiary": "0660013376",
            "beneficiaryName": "BANCO SANTANDER (BRASIL) S.A.",
            "requestNo": ""
          }
        ]
      }
    ],
    "requestNo": ""
  },
  {
    "id": 15,
    "tsfStructure": "Structured LCs",
    "slcStructure": "LC Prepayment",
    "entityString": "E023 - OGA-CT",
    "entityId": "E023",
    "ottkBankDesc": "0660013385 - GULF BANK KSCP",
    "ottkNo": "100500",
    "ottkValue": 8000000,
    "ottkCurr": "USD",
    "trader": "Riccardo R",
    "ottkStatDesc": "06 - Fully Assigned to Deal ID",
    "ottkStatus": "06",
    "dealId": "12000705",
    "dttkNo": "200554",
    "proposedSblcAmt": 8000000,
    "sblcTxn": "",
    "sblcAmt": "",
    "companyCode": "SG03",
    "companyName": "Olam Global Agri Pte. Ltd",
    "businessArea": "0630",
    "businessAreaName": "OLAM GLOBAL AGRI PTE. LTD",
    "requestRows": [
      {
        "startDate": "24-03-2025",
        "endDate": "08-05-2025",
        "expEndDate": "08-05-2025",
        "amount": 7989856,
        "requestType": "SBLC Treasury",
        "companyCode": "SG03",
        "beneficiary": "0660013385",
        "beneficiaryName": "GULF BANK KSCP",
        "requestNo": "26000613",
        "id": "A",
        "variants": [
          {
            "startDate": "24-03-2025",
            "endDate": "08-05-2025",
            "expEndDate": "08-05-2025",
            "amount": 7989856,
            "requestType": "SBLC Treasury",
            "companyCode": "SG03",
            "beneficiary": "0660013385",
            "beneficiaryName": "GULF BANK KSCP",
            "requestNo": "26000613"
          },
          {
            "startDate": "09-05-2025",
            "endDate": "23-06-2025",
            "expEndDate": "23-06-2025",
            "amount": 3360000,
            "requestType": "SBLC TSF",
            "companyCode": "SG03",
            "beneficiary": "0660013385",
            "beneficiaryName": "GULF BANK KSCP",
            "requestNo": ""
          }
        ]
      }
    ],
    "requestNo": "26000613"
  },
  {
    "id": 16,
    "tsfStructure": "Structured LCs",
    "slcStructure": "LC Prepayment",
    "entityString": "E021 - OGA-DMCC-PAN",
    "entityId": "E021",
    "ottkBankDesc": "0660013368 - BANESCO (PANAMA) S.A.",
    "ottkNo": "100501",
    "ottkValue": 15000000,
    "ottkCurr": "USD",
    "trader": "Omer Khan",
    "ottkStatDesc": "04 - Partially Assigned",
    "ottkStatus": "04",
    "dealId": "12000706",
    "dttkNo": "200555",
    "proposedSblcAmt": 15000000,
    "sblcTxn": "5153400285",
    "sblcAmt": 15000000,
    "companyCode": "AE11",
    "companyName": "Olam Global Agri",
    "businessArea": "0605",
    "businessAreaName": "OLAM GLOBAL AGRI",
    "requestRows": [
      {
        "startDate": "24-03-2025",
        "endDate": "08-05-2025",
        "expEndDate": "08-05-2025",
        "amount": 14989856,
        "requestType": "SBLC Treasury",
        "companyCode": "AE11",
        "beneficiary": "0660013368",
        "beneficiaryName": "BANESCO (PANAMA) S.A.",
        "requestNo": "",
        "id": "A",
        "variants": [
          {
            "startDate": "24-03-2025",
            "endDate": "08-05-2025",
            "expEndDate": "08-05-2025",
            "amount": 14989856,
            "requestType": "SBLC Treasury",
            "companyCode": "AE11",
            "beneficiary": "0660013368",
            "beneficiaryName": "BANESCO (PANAMA) S.A.",
            "requestNo": ""
          },
          {
            "startDate": "09-05-2025",
            "endDate": "23-06-2025",
            "expEndDate": "23-06-2025",
            "amount": 6300000,
            "requestType": "SBLC TSF",
            "companyCode": "AE11",
            "beneficiary": "0660013368",
            "beneficiaryName": "BANESCO (PANAMA) S.A.",
            "requestNo": ""
          }
        ]
      }
    ],
    "requestNo": ""
  },
  {
    "id": 17,
    "tsfStructure": "Structured LCs",
    "slcStructure": "LC Prepayment",
    "entityString": "E022 - OGA-SG",
    "entityId": "E022",
    "ottkBankDesc": "0660013362 - ITAU UNIBANCO S.A., NASSAU BRANCH",
    "ottkNo": "100502",
    "ottkValue": 40000000,
    "ottkCurr": "USD",
    "trader": "Andre",
    "ottkStatDesc": "06 - Fully Assigned to Deal ID",
    "ottkStatus": "06",
    "dealId": "12000707",
    "dttkNo": "200556",
    "proposedSblcAmt": 40000000,
    "sblcTxn": "",
    "sblcAmt": "",
    "companyCode": "AE13",
    "companyName": "Olam International DMCC",
    "businessArea": "0615",
    "businessAreaName": "OLAM INTERNATIONAL DMCC",
    "requestRows": [
      {
        "startDate": "24-03-2025",
        "endDate": "08-05-2025",
        "expEndDate": "08-05-2025",
        "amount": 39989856,
        "requestType": "SBLC Treasury",
        "companyCode": "AE13",
        "beneficiary": "0660013362",
        "beneficiaryName": "ITAU UNIBANCO S.A., NASSAU BRANCH",
        "requestNo": "",
        "id": "A",
        "variants": [
          {
            "startDate": "24-03-2025",
            "endDate": "08-05-2025",
            "expEndDate": "08-05-2025",
            "amount": 39989856,
            "requestType": "SBLC Treasury",
            "companyCode": "AE13",
            "beneficiary": "0660013362",
            "beneficiaryName": "ITAU UNIBANCO S.A., NASSAU BRANCH",
            "requestNo": ""
          },
          {
            "startDate": "09-05-2025",
            "endDate": "23-06-2025",
            "expEndDate": "23-06-2025",
            "amount": 16800000,
            "requestType": "SBLC TSF",
            "companyCode": "AE13",
            "beneficiary": "0660013362",
            "beneficiaryName": "ITAU UNIBANCO S.A., NASSAU BRANCH",
            "requestNo": ""
          }
        ]
      }
    ],
    "requestNo": ""
  },
  {
    "id": 18,
    "tsfStructure": "Structured LCs",
    "slcStructure": "LC Prepayment",
    "entityString": "E023 - OGA-CT",
    "entityId": "E023",
    "ottkBankDesc": "0660013462 - GLOBAL BANK CORPORATION AND SUBSIDI",
    "ottkNo": "100503",
    "ottkValue": 100000000,
    "ottkCurr": "USD",
    "trader": "Akshay M",
    "ottkStatDesc": "06 - Fully Assigned to Deal ID",
    "ottkStatus": "06",
    "dealId": "12000708",
    "dttkNo": "200557",
    "proposedSblcAmt": 100000000,
    "sblcTxn": "",
    "sblcAmt": "",
    "companyCode": "AE13",
    "companyName": "Olam International DMCC",
    "businessArea": "0615",
    "businessAreaName": "OLAM INTERNATIONAL DMCC",
    "requestRows": [
      {
        "startDate": "24-03-2025",
        "endDate": "08-05-2025",
        "expEndDate": "08-05-2025",
        "amount": 99989856,
        "requestType": "SBLC Treasury",
        "companyCode": "AE13",
        "beneficiary": "0660013462",
        "beneficiaryName": "GLOBAL BANK CORPORATION AND SUBSIDI",
        "requestNo": "",
        "id": "A",
        "variants": [
          {
            "startDate": "24-03-2025",
            "endDate": "08-05-2025",
            "expEndDate": "08-05-2025",
            "amount": 99989856,
            "requestType": "SBLC Treasury",
            "companyCode": "AE13",
            "beneficiary": "0660013462",
            "beneficiaryName": "GLOBAL BANK CORPORATION AND SUBSIDI",
            "requestNo": ""
          },
          {
            "startDate": "09-05-2025",
            "endDate": "23-06-2025",
            "expEndDate": "23-06-2025",
            "amount": 42000000,
            "requestType": "SBLC TSF",
            "companyCode": "AE13",
            "beneficiary": "0660013462",
            "beneficiaryName": "GLOBAL BANK CORPORATION AND SUBSIDI",
            "requestNo": ""
          }
        ]
      }
    ],
    "requestNo": ""
  },
  {
    "id": 19,
    "tsfStructure": "Structured LCs",
    "slcStructure": "LC Prepayment",
    "entityString": "E021 - OGA-DMCC-PAN",
    "entityId": "E021",
    "ottkBankDesc": "0660013379 - BANCO ABC BRASIL S.A.",
    "ottkNo": "100504",
    "ottkValue": 30000000,
    "ottkCurr": "USD",
    "trader": "Rahul Yadav",
    "ottkStatDesc": "06 - Fully Assigned to Deal ID",
    "ottkStatus": "06",
    "dealId": "12000709",
    "dttkNo": "200558",
    "proposedSblcAmt": 30000000,
    "sblcTxn": "",
    "sblcAmt": "",
    "companyCode": "SG03",
    "companyName": "Olam Global Agri Pte. Ltd",
    "businessArea": "0630",
    "businessAreaName": "OLAM GLOBAL AGRI PTE. LTD",
    "requestRows": [
      {
        "startDate": "24-03-2025",
        "endDate": "08-05-2025",
        "expEndDate": "08-05-2025",
        "amount": 29989856,
        "requestType": "SBLC Treasury",
        "companyCode": "SG03",
        "beneficiary": "0660013379",
        "beneficiaryName": "BANCO ABC BRASIL S.A.",
        "requestNo": "",
        "id": "A",
        "variants": [
          {
            "startDate": "24-03-2025",
            "endDate": "08-05-2025",
            "expEndDate": "08-05-2025",
            "amount": 29989856,
            "requestType": "SBLC Treasury",
            "companyCode": "SG03",
            "beneficiary": "0660013379",
            "beneficiaryName": "BANCO ABC BRASIL S.A.",
            "requestNo": ""
          },
          {
            "startDate": "09-05-2025",
            "endDate": "23-06-2025",
            "expEndDate": "23-06-2025",
            "amount": 12600000,
            "requestType": "SBLC TSF",
            "companyCode": "SG03",
            "beneficiary": "0660013379",
            "beneficiaryName": "BANCO ABC BRASIL S.A.",
            "requestNo": ""
          }
        ]
      }
    ],
    "requestNo": ""
  },
  {
    "id": 20,
    "tsfStructure": "Structured LCs",
    "slcStructure": "LC Prepayment",
    "entityString": "E022 - OGA-SG",
    "entityId": "E022",
    "ottkBankDesc": "0660013457 - BANCO DE BOGOTA S.A.",
    "ottkNo": "100505",
    "ottkValue": 10000000,
    "ottkCurr": "USD",
    "trader": "Ignacio",
    "ottkStatDesc": "04 - Partially Assigned",
    "ottkStatus": "04",
    "dealId": "12000710",
    "dttkNo": "200559",
    "proposedSblcAmt": 10000000,
    "sblcTxn": "",
    "sblcAmt": "",
    "companyCode": "AE11",
    "companyName": "Olam Global Agri",
    "businessArea": "0605",
    "businessAreaName": "OLAM GLOBAL AGRI",
    "requestRows": [
      {
        "startDate": "24-03-2025",
        "endDate": "08-05-2025",
        "expEndDate": "08-05-2025",
        "amount": 9989856,
        "requestType": "SBLC Treasury",
        "companyCode": "AE11",
        "beneficiary": "0660013457",
        "beneficiaryName": "BANCO DE BOGOTA S.A.",
        "requestNo": "",
        "id": "A",
        "variants": [
          {
            "startDate": "24-03-2025",
            "endDate": "08-05-2025",
            "expEndDate": "08-05-2025",
            "amount": 9989856,
            "requestType": "SBLC Treasury",
            "companyCode": "AE11",
            "beneficiary": "0660013457",
            "beneficiaryName": "BANCO DE BOGOTA S.A.",
            "requestNo": ""
          },
          {
            "startDate": "09-05-2025",
            "endDate": "23-06-2025",
            "expEndDate": "23-06-2025",
            "amount": 4200000,
            "requestType": "SBLC TSF",
            "companyCode": "AE11",
            "beneficiary": "0660013457",
            "beneficiaryName": "BANCO DE BOGOTA S.A.",
            "requestNo": ""
          }
        ]
      }
    ],
    "requestNo": ""
  },
  {
    "id": 21,
    "tsfStructure": "Structured LCs",
    "slcStructure": "LC Prepayment",
    "entityString": "E023 - OGA-CT",
    "entityId": "E023",
    "ottkBankDesc": "0660013365 - BANCO SAFRA S.A.",
    "ottkNo": "100506",
    "ottkValue": 50000000,
    "ottkCurr": "USD",
    "trader": "Riccardo R",
    "ottkStatDesc": "06 - Fully Assigned to Deal ID",
    "ottkStatus": "06",
    "dealId": "12000711",
    "dttkNo": "200560",
    "proposedSblcAmt": 50000000,
    "sblcTxn": "5153400380",
    "sblcAmt": 49999098.9,
    "companyCode": "AE13",
    "companyName": "Olam International DMCC",
    "businessArea": "0615",
    "businessAreaName": "OLAM INTERNATIONAL DMCC",
    "requestRows": [
      {
        "startDate": "24-03-2025",
        "endDate": "08-05-2025",
        "expEndDate": "08-05-2025",
        "amount": 49989856,
        "requestType": "SBLC Treasury",
        "companyCode": "AE13",
        "beneficiary": "0660013365",
        "beneficiaryName": "BANCO SAFRA S.A.",
        "requestNo": "",
        "id": "A",
        "variants": [
          {
            "startDate": "24-03-2025",
            "endDate": "08-05-2025",
            "expEndDate": "08-05-2025",
            "amount": 49989856,
            "requestType": "SBLC Treasury",
            "companyCode": "AE13",
            "beneficiary": "0660013365",
            "beneficiaryName": "BANCO SAFRA S.A.",
            "requestNo": ""
          },
          {
            "startDate": "09-05-2025",
            "endDate": "23-06-2025",
            "expEndDate": "23-06-2025",
            "amount": 21000000,
            "requestType": "SBLC TSF",
            "companyCode": "AE13",
            "beneficiary": "0660013365",
            "beneficiaryName": "BANCO SAFRA S.A.",
            "requestNo": ""
          }
        ]
      }
    ],
    "requestNo": ""
  },
  {
    "id": 22,
    "tsfStructure": "Structured LCs",
    "slcStructure": "LC Prepayment",
    "entityString": "E021 - OGA-DMCC-PAN",
    "entityId": "E021",
    "ottkBankDesc": "0660013464 - BANCO DO BRASIL S.A.",
    "ottkNo": "100507",
    "ottkValue": 25000000,
    "ottkCurr": "USD",
    "trader": "Omer Khan",
    "ottkStatDesc": "06 - Fully Assigned to Deal ID",
    "ottkStatus": "06",
    "dealId": "12000712",
    "dttkNo": "200561",
    "proposedSblcAmt": 25000000,
    "sblcTxn": "",
    "sblcAmt": "",
    "companyCode": "AE13",
    "companyName": "Olam International DMCC",
    "businessArea": "0615",
    "businessAreaName": "OLAM INTERNATIONAL DMCC",
    "requestRows": [
      {
        "startDate": "24-03-2025",
        "endDate": "08-05-2025",
        "expEndDate": "08-05-2025",
        "amount": 24989856,
        "requestType": "SBLC Treasury",
        "companyCode": "AE13",
        "beneficiary": "0660013464",
        "beneficiaryName": "BANCO DO BRASIL S.A.",
        "requestNo": "26000634",
        "id": "A",
        "variants": [
          {
            "startDate": "24-03-2025",
            "endDate": "08-05-2025",
            "expEndDate": "08-05-2025",
            "amount": 24989856,
            "requestType": "SBLC Treasury",
            "companyCode": "AE13",
            "beneficiary": "0660013464",
            "beneficiaryName": "BANCO DO BRASIL S.A.",
            "requestNo": "26000634"
          },
          {
            "startDate": "09-05-2025",
            "endDate": "23-06-2025",
            "expEndDate": "23-06-2025",
            "amount": 10500000,
            "requestType": "SBLC TSF",
            "companyCode": "AE13",
            "beneficiary": "0660013464",
            "beneficiaryName": "BANCO DO BRASIL S.A.",
            "requestNo": ""
          }
        ]
      }
    ],
    "requestNo": "26000634"
  },
  {
    "id": 23,
    "tsfStructure": "Structured LCs",
    "slcStructure": "LC Prepayment",
    "entityString": "E022 - OGA-SG",
    "entityId": "E022",
    "ottkBankDesc": "0660013377 - BANCO BRADESCO S.A.",
    "ottkNo": "100508",
    "ottkValue": 20000000,
    "ottkCurr": "USD",
    "trader": "Andre",
    "ottkStatDesc": "06 - Fully Assigned to Deal ID",
    "ottkStatus": "06",
    "dealId": "12000713",
    "dttkNo": "200562",
    "proposedSblcAmt": 20000000,
    "sblcTxn": "",
    "sblcAmt": "",
    "companyCode": "SG03",
    "companyName": "Olam Global Agri Pte. Ltd",
    "businessArea": "0630",
    "businessAreaName": "OLAM GLOBAL AGRI PTE. LTD",
    "requestRows": [
      {
        "startDate": "24-03-2025",
        "endDate": "08-05-2025",
        "expEndDate": "08-05-2025",
        "amount": 19989856,
        "requestType": "SBLC Treasury",
        "companyCode": "SG03",
        "beneficiary": "0660013377",
        "beneficiaryName": "BANCO BRADESCO S.A.",
        "requestNo": "",
        "id": "A",
        "variants": [
          {
            "startDate": "24-03-2025",
            "endDate": "08-05-2025",
            "expEndDate": "08-05-2025",
            "amount": 19989856,
            "requestType": "SBLC Treasury",
            "companyCode": "SG03",
            "beneficiary": "0660013377",
            "beneficiaryName": "BANCO BRADESCO S.A.",
            "requestNo": ""
          },
          {
            "startDate": "09-05-2025",
            "endDate": "23-06-2025",
            "expEndDate": "23-06-2025",
            "amount": 8400000,
            "requestType": "SBLC TSF",
            "companyCode": "SG03",
            "beneficiary": "0660013377",
            "beneficiaryName": "BANCO BRADESCO S.A.",
            "requestNo": ""
          }
        ]
      }
    ],
    "requestNo": ""
  },
  {
    "id": 24,
    "tsfStructure": "Structured LCs",
    "slcStructure": "LC Prepayment",
    "entityString": "E023 - OGA-CT",
    "entityId": "E023",
    "ottkBankDesc": "0660013455 - BANCO CONTINENTAL S.A.E.C.A",
    "ottkNo": "100509",
    "ottkValue": 8000000,
    "ottkCurr": "USD",
    "trader": "Akshay M",
    "ottkStatDesc": "04 - Partially Assigned",
    "ottkStatus": "04",
    "dealId": "12000714",
    "dttkNo": "200563",
    "proposedSblcAmt": 8000000,
    "sblcTxn": "",
    "sblcAmt": "",
    "companyCode": "AE11",
    "companyName": "Olam Global Agri",
    "businessArea": "0605",
    "businessAreaName": "OLAM GLOBAL AGRI",
    "requestRows": [
      {
        "startDate": "24-03-2025",
        "endDate": "08-05-2025",
        "expEndDate": "08-05-2025",
        "amount": 7989856,
        "requestType": "SBLC Treasury",
        "companyCode": "AE11",
        "beneficiary": "0660013455",
        "beneficiaryName": "BANCO CONTINENTAL S.A.E.C.A",
        "requestNo": "",
        "id": "A",
        "variants": [
          {
            "startDate": "24-03-2025",
            "endDate": "08-05-2025",
            "expEndDate": "08-05-2025",
            "amount": 7989856,
            "requestType": "SBLC Treasury",
            "companyCode": "AE11",
            "beneficiary": "0660013455",
            "beneficiaryName": "BANCO CONTINENTAL S.A.E.C.A",
            "requestNo": ""
          },
          {
            "startDate": "09-05-2025",
            "endDate": "23-06-2025",
            "expEndDate": "23-06-2025",
            "amount": 3360000,
            "requestType": "SBLC TSF",
            "companyCode": "AE11",
            "beneficiary": "0660013455",
            "beneficiaryName": "BANCO CONTINENTAL S.A.E.C.A",
            "requestNo": ""
          }
        ]
      }
    ],
    "requestNo": ""
  },
  {
    "id": 25,
    "tsfStructure": "Structured LCs",
    "slcStructure": "LC Prepayment",
    "entityString": "E021 - OGA-DMCC-PAN",
    "entityId": "E021",
    "ottkBankDesc": "0660013680 - BANCO DO BRASIL S A",
    "ottkNo": "100510",
    "ottkValue": 15000000,
    "ottkCurr": "USD",
    "trader": "Rahul Yadav",
    "ottkStatDesc": "06 - Fully Assigned to Deal ID",
    "ottkStatus": "06",
    "dealId": "12000715",
    "dttkNo": "200564",
    "proposedSblcAmt": 15000000,
    "sblcTxn": "",
    "sblcAmt": "",
    "companyCode": "AE13",
    "companyName": "Olam International DMCC",
    "businessArea": "0615",
    "businessAreaName": "OLAM INTERNATIONAL DMCC",
    "requestRows": [
      {
        "startDate": "24-03-2025",
        "endDate": "08-05-2025",
        "expEndDate": "08-05-2025",
        "amount": 14989856,
        "requestType": "SBLC Treasury",
        "companyCode": "AE13",
        "beneficiary": "0660013680",
        "beneficiaryName": "BANCO DO BRASIL S A",
        "requestNo": "",
        "id": "A",
        "variants": [
          {
            "startDate": "24-03-2025",
            "endDate": "08-05-2025",
            "expEndDate": "08-05-2025",
            "amount": 14989856,
            "requestType": "SBLC Treasury",
            "companyCode": "AE13",
            "beneficiary": "0660013680",
            "beneficiaryName": "BANCO DO BRASIL S A",
            "requestNo": ""
          },
          {
            "startDate": "09-05-2025",
            "endDate": "23-06-2025",
            "expEndDate": "23-06-2025",
            "amount": 6300000,
            "requestType": "SBLC TSF",
            "companyCode": "AE13",
            "beneficiary": "0660013680",
            "beneficiaryName": "BANCO DO BRASIL S A",
            "requestNo": ""
          }
        ]
      }
    ],
    "requestNo": ""
  },
  {
    "id": 26,
    "tsfStructure": "Corporate Trade",
    "slcStructure": "Corporate Trade",
    "entityString": "E022 - OGA-SG",
    "entityId": "E022",
    "ottkBankDesc": "0660015668 - BANK OF SHANGHAI, SHANGHAI",
    "ottkNo": "100511",
    "ottkValue": 40000000,
    "ottkCurr": "USD",
    "trader": "Ignacio",
    "ottkStatDesc": "06 - Fully Assigned to Deal ID",
    "ottkStatus": "06",
    "dealId": "12000716",
    "dttkNo": "200565",
    "proposedSblcAmt": 40000000,
    "sblcTxn": "5153400475",
    "sblcAmt": 39999549.45,
    "companyCode": "AE13",
    "companyName": "Olam International DMCC",
    "businessArea": "0615",
    "businessAreaName": "OLAM INTERNATIONAL DMCC",
    "requestRows": [
      {
        "startDate": "24-03-2025",
        "endDate": "08-05-2025",
        "expEndDate": "08-05-2025",
        "amount": 39989856,
        "requestType": "SBLC Treasury",
        "companyCode": "AE13",
        "beneficiary": "0660015668",
        "beneficiaryName": "BANK OF SHANGHAI, SHANGHAI",
        "requestNo": "",
        "id": "A",
        "variants": [
          {
            "startDate": "24-03-2025",
            "endDate": "08-05-2025",
            "expEndDate": "08-05-2025",
            "amount": 39989856,
            "requestType": "SBLC Treasury",
            "companyCode": "AE13",
            "beneficiary": "0660015668",
            "beneficiaryName": "BANK OF SHANGHAI, SHANGHAI",
            "requestNo": ""
          },
          {
            "startDate": "09-05-2025",
            "endDate": "23-06-2025",
            "expEndDate": "23-06-2025",
            "amount": 16800000,
            "requestType": "SBLC TSF",
            "companyCode": "AE13",
            "beneficiary": "0660015668",
            "beneficiaryName": "BANK OF SHANGHAI, SHANGHAI",
            "requestNo": ""
          }
        ]
      }
    ],
    "requestNo": ""
  },
  {
    "id": 27,
    "tsfStructure": "Corporate Trade",
    "slcStructure": "Corporate Trade",
    "entityString": "E023 - OGA-CT",
    "entityId": "E023",
    "ottkBankDesc": "0660014519 - BANCO DAYCOVAL S.A.",
    "ottkNo": "100512",
    "ottkValue": 100000000,
    "ottkCurr": "USD",
    "trader": "Riccardo R",
    "ottkStatDesc": "06 - Fully Assigned to Deal ID",
    "ottkStatus": "06",
    "dealId": "12000717",
    "dttkNo": "200566",
    "proposedSblcAmt": 100000000,
    "sblcTxn": "",
    "sblcAmt": "",
    "companyCode": "SG03",
    "companyName": "Olam Global Agri Pte. Ltd",
    "businessArea": "0630",
    "businessAreaName": "OLAM GLOBAL AGRI PTE. LTD",
    "requestRows": [
      {
        "startDate": "24-03-2025",
        "endDate": "08-05-2025",
        "expEndDate": "08-05-2025",
        "amount": 99989856,
        "requestType": "SBLC Treasury",
        "companyCode": "SG03",
        "beneficiary": "0660014519",
        "beneficiaryName": "BANCO DAYCOVAL S.A.",
        "requestNo": "",
        "id": "A",
        "variants": [
          {
            "startDate": "24-03-2025",
            "endDate": "08-05-2025",
            "expEndDate": "08-05-2025",
            "amount": 99989856,
            "requestType": "SBLC Treasury",
            "companyCode": "SG03",
            "beneficiary": "0660014519",
            "beneficiaryName": "BANCO DAYCOVAL S.A.",
            "requestNo": ""
          },
          {
            "startDate": "09-05-2025",
            "endDate": "23-06-2025",
            "expEndDate": "23-06-2025",
            "amount": 42000000,
            "requestType": "SBLC TSF",
            "companyCode": "SG03",
            "beneficiary": "0660014519",
            "beneficiaryName": "BANCO DAYCOVAL S.A.",
            "requestNo": ""
          }
        ]
      }
    ],
    "requestNo": ""
  },
  {
    "id": 28,
    "tsfStructure": "Corporate Trade",
    "slcStructure": "Corporate Trade",
    "entityString": "E021 - OGA-DMCC-PAN",
    "entityId": "E021",
    "ottkBankDesc": "0660013376 - BANCO SANTANDER (BRASIL) S.A.",
    "ottkNo": "100513",
    "ottkValue": 30000000,
    "ottkCurr": "USD",
    "trader": "Omer Khan",
    "ottkStatDesc": "04 - Partially Assigned",
    "ottkStatus": "04",
    "dealId": "12000718",
    "dttkNo": "200567",
    "proposedSblcAmt": 30000000,
    "sblcTxn": "",
    "sblcAmt": "",
    "companyCode": "AE11",
    "companyName": "Olam Global Agri",
    "businessArea": "0605",
    "businessAreaName": "OLAM GLOBAL AGRI",
    "requestRows": [
      {
        "startDate": "24-03-2025",
        "endDate": "08-05-2025",
        "expEndDate": "08-05-2025",
        "amount": 29989856,
        "requestType": "SBLC Treasury",
        "companyCode": "AE11",
        "beneficiary": "0660013376",
        "beneficiaryName": "BANCO SANTANDER (BRASIL) S.A.",
        "requestNo": "",
        "id": "A",
        "variants": [
          {
            "startDate": "24-03-2025",
            "endDate": "08-05-2025",
            "expEndDate": "08-05-2025",
            "amount": 29989856,
            "requestType": "SBLC Treasury",
            "companyCode": "AE11",
            "beneficiary": "0660013376",
            "beneficiaryName": "BANCO SANTANDER (BRASIL) S.A.",
            "requestNo": ""
          },
          {
            "startDate": "09-05-2025",
            "endDate": "23-06-2025",
            "expEndDate": "23-06-2025",
            "amount": 12600000,
            "requestType": "SBLC TSF",
            "companyCode": "AE11",
            "beneficiary": "0660013376",
            "beneficiaryName": "BANCO SANTANDER (BRASIL) S.A.",
            "requestNo": ""
          }
        ]
      }
    ],
    "requestNo": ""
  },
  {
    "id": 29,
    "tsfStructure": "Corporate Trade",
    "slcStructure": "Corporate Trade",
    "entityString": "E022 - OGA-SG",
    "entityId": "E022",
    "ottkBankDesc": "0660013385 - GULF BANK KSCP",
    "ottkNo": "100514",
    "ottkValue": 10000000,
    "ottkCurr": "USD",
    "trader": "Andre",
    "ottkStatDesc": "06 - Fully Assigned to Deal ID",
    "ottkStatus": "06",
    "dealId": "12000719",
    "dttkNo": "200568",
    "proposedSblcAmt": 10000000,
    "sblcTxn": "",
    "sblcAmt": "",
    "companyCode": "AE13",
    "companyName": "Olam International DMCC",
    "businessArea": "0615",
    "businessAreaName": "OLAM INTERNATIONAL DMCC",
    "requestRows": [
      {
        "startDate": "24-03-2025",
        "endDate": "08-05-2025",
        "expEndDate": "08-05-2025",
        "amount": 9989856,
        "requestType": "SBLC Treasury",
        "companyCode": "AE13",
        "beneficiary": "0660013385",
        "beneficiaryName": "GULF BANK KSCP",
        "requestNo": "26000655",
        "id": "A",
        "variants": [
          {
            "startDate": "24-03-2025",
            "endDate": "08-05-2025",
            "expEndDate": "08-05-2025",
            "amount": 9989856,
            "requestType": "SBLC Treasury",
            "companyCode": "AE13",
            "beneficiary": "0660013385",
            "beneficiaryName": "GULF BANK KSCP",
            "requestNo": "26000655"
          },
          {
            "startDate": "09-05-2025",
            "endDate": "23-06-2025",
            "expEndDate": "23-06-2025",
            "amount": 4200000,
            "requestType": "SBLC TSF",
            "companyCode": "AE13",
            "beneficiary": "0660013385",
            "beneficiaryName": "GULF BANK KSCP",
            "requestNo": ""
          }
        ]
      }
    ],
    "requestNo": "26000655"
  },
  {
    "id": 30,
    "tsfStructure": "Corporate Trade",
    "slcStructure": "Corporate Trade",
    "entityString": "E023 - OGA-CT",
    "entityId": "E023",
    "ottkBankDesc": "0660013368 - BANESCO (PANAMA) S.A.",
    "ottkNo": "100515",
    "ottkValue": 50000000,
    "ottkCurr": "USD",
    "trader": "Akshay M",
    "ottkStatDesc": "06 - Fully Assigned to Deal ID",
    "ottkStatus": "06",
    "dealId": "12000720",
    "dttkNo": "200569",
    "proposedSblcAmt": 50000000,
    "sblcTxn": "",
    "sblcAmt": "",
    "companyCode": "AE13",
    "companyName": "Olam International DMCC",
    "businessArea": "0615",
    "businessAreaName": "OLAM INTERNATIONAL DMCC",
    "requestRows": [
      {
        "startDate": "24-03-2025",
        "endDate": "08-05-2025",
        "expEndDate": "08-05-2025",
        "amount": 49989856,
        "requestType": "SBLC Treasury",
        "companyCode": "AE13",
        "beneficiary": "0660013368",
        "beneficiaryName": "BANESCO (PANAMA) S.A.",
        "requestNo": "",
        "id": "A",
        "variants": [
          {
            "startDate": "24-03-2025",
            "endDate": "08-05-2025",
            "expEndDate": "08-05-2025",
            "amount": 49989856,
            "requestType": "SBLC Treasury",
            "companyCode": "AE13",
            "beneficiary": "0660013368",
            "beneficiaryName": "BANESCO (PANAMA) S.A.",
            "requestNo": ""
          },
          {
            "startDate": "09-05-2025",
            "endDate": "23-06-2025",
            "expEndDate": "23-06-2025",
            "amount": 21000000,
            "requestType": "SBLC TSF",
            "companyCode": "AE13",
            "beneficiary": "0660013368",
            "beneficiaryName": "BANESCO (PANAMA) S.A.",
            "requestNo": ""
          }
        ]
      }
    ],
    "requestNo": ""
  },
  {
    "id": 31,
    "tsfStructure": "Corporate Trade",
    "slcStructure": "Corporate Trade",
    "entityString": "E021 - OGA-DMCC-PAN",
    "entityId": "E021",
    "ottkBankDesc": "0660013362 - ITAU UNIBANCO S.A., NASSAU BRANCH",
    "ottkNo": "100516",
    "ottkValue": 25000000,
    "ottkCurr": "USD",
    "trader": "Rahul Yadav",
    "ottkStatDesc": "06 - Fully Assigned to Deal ID",
    "ottkStatus": "06",
    "dealId": "12000721",
    "dttkNo": "200570",
    "proposedSblcAmt": 25000000,
    "sblcTxn": "5153400570",
    "sblcAmt": 25000000,
    "companyCode": "SG03",
    "companyName": "Olam Global Agri Pte. Ltd",
    "businessArea": "0630",
    "businessAreaName": "OLAM GLOBAL AGRI PTE. LTD",
    "requestRows": [
      {
        "startDate": "24-03-2025",
        "endDate": "08-05-2025",
        "expEndDate": "08-05-2025",
        "amount": 24989856,
        "requestType": "SBLC Treasury",
        "companyCode": "SG03",
        "beneficiary": "0660013362",
        "beneficiaryName": "ITAU UNIBANCO S.A., NASSAU BRANCH",
        "requestNo": "",
        "id": "A",
        "variants": [
          {
            "startDate": "24-03-2025",
            "endDate": "08-05-2025",
            "expEndDate": "08-05-2025",
            "amount": 24989856,
            "requestType": "SBLC Treasury",
            "companyCode": "SG03",
            "beneficiary": "0660013362",
            "beneficiaryName": "ITAU UNIBANCO S.A., NASSAU BRANCH",
            "requestNo": ""
          },
          {
            "startDate": "09-05-2025",
            "endDate": "23-06-2025",
            "expEndDate": "23-06-2025",
            "amount": 10500000,
            "requestType": "SBLC TSF",
            "companyCode": "SG03",
            "beneficiary": "0660013362",
            "beneficiaryName": "ITAU UNIBANCO S.A., NASSAU BRANCH",
            "requestNo": ""
          }
        ]
      }
    ],
    "requestNo": ""
  },
  {
    "id": 32,
    "tsfStructure": "Corporate Trade",
    "slcStructure": "Corporate Trade",
    "entityString": "E022 - OGA-SG",
    "entityId": "E022",
    "ottkBankDesc": "0660013462 - GLOBAL BANK CORPORATION AND SUBSIDI",
    "ottkNo": "100517",
    "ottkValue": 20000000,
    "ottkCurr": "USD",
    "trader": "Ignacio",
    "ottkStatDesc": "04 - Partially Assigned",
    "ottkStatus": "04",
    "dealId": "12000722",
    "dttkNo": "200571",
    "proposedSblcAmt": 20000000,
    "sblcTxn": "",
    "sblcAmt": "",
    "companyCode": "AE11",
    "companyName": "Olam Global Agri",
    "businessArea": "0605",
    "businessAreaName": "OLAM GLOBAL AGRI",
    "requestRows": [
      {
        "startDate": "24-03-2025",
        "endDate": "08-05-2025",
        "expEndDate": "08-05-2025",
        "amount": 19989856,
        "requestType": "SBLC Treasury",
        "companyCode": "AE11",
        "beneficiary": "0660013462",
        "beneficiaryName": "GLOBAL BANK CORPORATION AND SUBSIDI",
        "requestNo": "",
        "id": "A",
        "variants": [
          {
            "startDate": "24-03-2025",
            "endDate": "08-05-2025",
            "expEndDate": "08-05-2025",
            "amount": 19989856,
            "requestType": "SBLC Treasury",
            "companyCode": "AE11",
            "beneficiary": "0660013462",
            "beneficiaryName": "GLOBAL BANK CORPORATION AND SUBSIDI",
            "requestNo": ""
          },
          {
            "startDate": "09-05-2025",
            "endDate": "23-06-2025",
            "expEndDate": "23-06-2025",
            "amount": 8400000,
            "requestType": "SBLC TSF",
            "companyCode": "AE11",
            "beneficiary": "0660013462",
            "beneficiaryName": "GLOBAL BANK CORPORATION AND SUBSIDI",
            "requestNo": ""
          }
        ]
      }
    ],
    "requestNo": ""
  }
]
