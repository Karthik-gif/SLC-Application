/**
 * Seed data lifted from the inline payload of SBLC_Initiate_Termination_Modern_v4.html.
 *
 * Placeholder only: the legacy page carried this payload in the page itself and never called
 * a service, so nothing here has an SAP source yet. This file is what a real service replaces.
 */
import type { Company, SblcColumn, SblcRow, Settings } from './types.ts'

export const SETTINGS: Settings = {
  pageSize: 12,
  nextDmsCode: 6100001001,
  dateFormat: 'DD-MM-YYYY',
  defaultAdditionalSelection: 'Pending Termination'
}

/**
 * The original dropped every company whose code starts with 9 before showing the help list,
 * so they are absent here rather than filtered again at runtime.
 */
export const COMPANIES: Company[] = [
  {
    code: '0001',
    name: 'SAP SE',
    city: 'Walldorf',
    currency: 'EUR'
  },
  {
    code: '1000',
    name: 'Template',
    city: 'Mumbai',
    currency: 'INR'
  },
  {
    code: 'AE11',
    name: 'OLAM GlobalAgri Pte. Ltd',
    city: 'Singapore',
    currency: 'AED'
  },
  {
    code: 'AE13',
    name: 'Olam International DMCC',
    city: 'Dubai',
    currency: 'AED'
  },
  {
    code: 'SG03',
    name: 'OLAM GlobalAgri Pte. Ltd',
    city: 'Singapore',
    currency: 'USD'
  }
]

export const REQUEST_TYPES: string[] = [
  '01 - SBLC',
  '02 - SBLC TSF'
]

export const ADDITIONAL_SELECTIONS: string[] = [
  'Pending Termination',
  'Terminated'
]

export const COLUMNS: SblcColumn[] = [
  {
    key: 'dealId',
    label: 'Deal ID',
    width: 86
  },
  {
    key: 'sblcStatus',
    label: 'SBLC Status',
    width: 82
  },
  {
    key: 'sblcRequestStatusDescription',
    label: 'SBLC Request Status Description',
    width: 196
  },
  {
    key: 'companyName',
    label: 'Company Name',
    width: 190
  },
  {
    key: 'sblcTransaction',
    label: 'SBLC Transaction',
    width: 122
  },
  {
    key: 'productTypeDescription',
    label: 'Product Type Description',
    width: 154
  },
  {
    key: 'sblcBeneficiary',
    label: 'SBLC Beneficiary',
    width: 120
  },
  {
    key: 'sblcRequestNumber',
    label: 'SBLC Request Number',
    width: 132
  },
  {
    key: 'startDate',
    label: 'Start Date',
    width: 92,
    type: 'date'
  },
  {
    key: 'endDate',
    label: 'End Date',
    width: 92,
    type: 'date'
  },
  {
    key: 'sblcAmount',
    label: 'SBLC Amount',
    width: 112,
    type: 'amount'
  },
  {
    key: 'ottkNo',
    label: 'OTTK No',
    width: 84
  },
  {
    key: 'sblcRequestTypeDescription',
    label: 'SBLC Request Type Description',
    width: 184
  },
  {
    key: 'lcAmountValue',
    label: 'LC Amount Value',
    width: 112,
    type: 'amount'
  },
  {
    key: 'entityString',
    label: 'Entity String',
    width: 174
  },
  {
    key: 'requestDate',
    label: 'Request Date',
    width: 96,
    type: 'date'
  },
  {
    key: 'expectedEndDate',
    label: 'Expected End Date',
    width: 116,
    type: 'date'
  },
  {
    key: 'currency',
    label: 'Currency',
    width: 76
  },
  {
    key: 'issuingBank',
    label: 'Issuing Bank',
    width: 118
  },
  {
    key: 'requestorCoName',
    label: 'Requestor Co Name',
    width: 178
  },
  {
    key: 'requestorBankName',
    label: 'Requestor Bank Name',
    width: 176
  },
  {
    key: 'expectedDate',
    label: 'Expected Date',
    width: 98,
    type: 'date'
  },
  {
    key: 'requestedBy',
    label: 'Requested By',
    width: 112
  },
  {
    key: 'sblcInitiateTermination',
    label: 'SBLC Initiate Termination',
    width: 154
  },
  {
    key: 'sblcTerminationDate',
    label: 'SBLC Termination Date',
    width: 142,
    type: 'date'
  },
  {
    key: 'terminationCurrency',
    label: 'Currency',
    width: 76
  }
]

export const SBLC_ROWS: SblcRow[] = [
  {
    companyCode: 'AE13',
    dealId: '12000880',
    sblcStatus: '04',
    sblcRequestStatusDescription: 'TSF Approval / SBLC Created',
    companyName: 'AE13 - Olam International DMCC',
    sblcTransaction: '2803000846',
    productTypeDescription: '22B - SBLC',
    sblcBeneficiary: '660013541',
    sblcRequestNumber: '26000800',
    startDate: '08-09-2025',
    endDate: '28-01-2028',
    sblcAmount: 190,
    ottkNo: '100676',
    sblcRequestTypeDescription: '01 - SBLC',
    lcAmountValue: 190,
    entityString: 'E021 - OGA-DMCC-PAN',
    requestDate: '08-09-2025',
    expectedEndDate: '28-01-2028',
    currency: 'USD',
    issuingBank: 'SCB UAE',
    requestorCoName: 'Olam International DMCC',
    requestorBankName: 'Standard Chartered Bank UAE',
    expectedDate: '28-01-2028',
    requestedBy: 'ALOR',
    sblcInitiateTermination: 'Pending',
    sblcTerminationDate: '',
    terminationCurrency: 'USD',
    terminationState: 'PENDING',
    dms: [
      {
        docType: 'D01',
        docTypeDesc: 'SBLC Bank',
        docDate: '',
        fileName: '',
        dmsCode: '',
        uploaded: false
      },
      {
        docType: 'D02',
        docTypeDesc: 'SBLC - SWIFT Confirmation Issuance',
        docDate: '',
        fileName: '',
        dmsCode: '',
        uploaded: false
      },
      {
        docType: 'D03',
        docTypeDesc: 'SBLC - SWIFT Confirmation Termination',
        docDate: '',
        fileName: '',
        dmsCode: '',
        uploaded: false
      }
    ]
  },
  {
    companyCode: 'AE13',
    dealId: '13000312',
    sblcStatus: '04',
    sblcRequestStatusDescription: 'TSF Approval / SBLC Created',
    companyName: 'AE13 - Olam International DMCC',
    sblcTransaction: '2803000789',
    productTypeDescription: '22B - SBLC',
    sblcBeneficiary: '660012897',
    sblcRequestNumber: '26000739',
    startDate: '03-09-2025',
    endDate: '05-03-2027',
    sblcAmount: 28331,
    ottkNo: '300312',
    sblcRequestTypeDescription: '02 - SBLC TSF',
    lcAmountValue: 28331,
    entityString: 'E021 - OGA-DMCC-PAN',
    requestDate: '03-09-2025',
    expectedEndDate: '05-03-2027',
    currency: 'USD',
    issuingBank: 'SCB UAE',
    requestorCoName: 'Olam International DMCC',
    requestorBankName: 'Standard Chartered Bank UAE',
    expectedDate: '05-03-2027',
    requestedBy: 'Treasury User',
    sblcInitiateTermination: 'Pending',
    sblcTerminationDate: '',
    terminationCurrency: 'USD',
    terminationState: 'PENDING',
    dms: [
      {
        docType: 'D01',
        docTypeDesc: 'SBLC Bank',
        docDate: '',
        fileName: '',
        dmsCode: '',
        uploaded: false
      },
      {
        docType: 'D02',
        docTypeDesc: 'SBLC - SWIFT Confirmation Issuance',
        docDate: '',
        fileName: '',
        dmsCode: '',
        uploaded: false
      },
      {
        docType: 'D03',
        docTypeDesc: 'SBLC - SWIFT Confirmation Termination',
        docDate: '',
        fileName: '',
        dmsCode: '',
        uploaded: false
      }
    ]
  },
  {
    companyCode: 'AE13',
    dealId: '13000314',
    sblcStatus: '04',
    sblcRequestStatusDescription: 'TSF Approval / SBLC Created',
    companyName: 'AE13 - Olam International DMCC',
    sblcTransaction: '2803000790',
    productTypeDescription: '22B - SBLC',
    sblcBeneficiary: '660012897',
    sblcRequestNumber: '26000741',
    startDate: '03-09-2025',
    endDate: '17-02-2027',
    sblcAmount: 83677,
    ottkNo: '300314',
    sblcRequestTypeDescription: '02 - SBLC TSF',
    lcAmountValue: 83677,
    entityString: 'E021 - OGA-DMCC-PAN',
    requestDate: '03-09-2025',
    expectedEndDate: '17-02-2027',
    currency: 'USD',
    issuingBank: 'SCB UAE',
    requestorCoName: 'Olam International DMCC',
    requestorBankName: 'Standard Chartered Bank UAE',
    expectedDate: '17-02-2027',
    requestedBy: 'ALOR',
    sblcInitiateTermination: 'Pending',
    sblcTerminationDate: '',
    terminationCurrency: 'USD',
    terminationState: 'PENDING',
    dms: [
      {
        docType: 'D01',
        docTypeDesc: 'SBLC Bank',
        docDate: '',
        fileName: '',
        dmsCode: '',
        uploaded: false
      },
      {
        docType: 'D02',
        docTypeDesc: 'SBLC - SWIFT Confirmation Issuance',
        docDate: '',
        fileName: '',
        dmsCode: '',
        uploaded: false
      },
      {
        docType: 'D03',
        docTypeDesc: 'SBLC - SWIFT Confirmation Termination',
        docDate: '',
        fileName: '',
        dmsCode: '',
        uploaded: false
      }
    ]
  },
  {
    companyCode: 'AE13',
    dealId: '13000316',
    sblcStatus: '04',
    sblcRequestStatusDescription: 'TSF Approval / SBLC Created',
    companyName: 'AE13 - Olam International DMCC',
    sblcTransaction: '2803000791',
    productTypeDescription: '22B - SBLC',
    sblcBeneficiary: '660012903',
    sblcRequestNumber: '26000742',
    startDate: '03-09-2025',
    endDate: '18-01-2027',
    sblcAmount: 60398,
    ottkNo: '300316',
    sblcRequestTypeDescription: '02 - SBLC TSF',
    lcAmountValue: 60398,
    entityString: 'E021 - OGA-DMCC-PAN',
    requestDate: '03-09-2025',
    expectedEndDate: '18-01-2027',
    currency: 'USD',
    issuingBank: 'SCB UAE',
    requestorCoName: 'Olam International DMCC',
    requestorBankName: 'Standard Chartered Bank UAE',
    expectedDate: '18-01-2027',
    requestedBy: 'Treasury User',
    sblcInitiateTermination: 'Pending',
    sblcTerminationDate: '',
    terminationCurrency: 'USD',
    terminationState: 'PENDING',
    dms: [
      {
        docType: 'D01',
        docTypeDesc: 'SBLC Bank',
        docDate: '',
        fileName: '',
        dmsCode: '',
        uploaded: false
      },
      {
        docType: 'D02',
        docTypeDesc: 'SBLC - SWIFT Confirmation Issuance',
        docDate: '',
        fileName: '',
        dmsCode: '',
        uploaded: false
      },
      {
        docType: 'D03',
        docTypeDesc: 'SBLC - SWIFT Confirmation Termination',
        docDate: '',
        fileName: '',
        dmsCode: '',
        uploaded: false
      }
    ]
  },
  {
    companyCode: 'AE13',
    dealId: '13000317',
    sblcStatus: '04',
    sblcRequestStatusDescription: 'TSF Approval / SBLC Created',
    companyName: 'AE13 - Olam International DMCC',
    sblcTransaction: '2803000792',
    productTypeDescription: '22B - SBLC',
    sblcBeneficiary: '660012903',
    sblcRequestNumber: '26000743',
    startDate: '03-09-2025',
    endDate: '04-02-2027',
    sblcAmount: 45107,
    ottkNo: '300317',
    sblcRequestTypeDescription: '01 - SBLC',
    lcAmountValue: 45107,
    entityString: 'E021 - OGA-DMCC-PAN',
    requestDate: '03-09-2025',
    expectedEndDate: '04-02-2027',
    currency: 'USD',
    issuingBank: 'SCB UAE',
    requestorCoName: 'Olam International DMCC',
    requestorBankName: 'Standard Chartered Bank UAE',
    expectedDate: '04-02-2027',
    requestedBy: 'ALOR',
    sblcInitiateTermination: 'Pending',
    sblcTerminationDate: '',
    terminationCurrency: 'USD',
    terminationState: 'PENDING',
    dms: [
      {
        docType: 'D01',
        docTypeDesc: 'SBLC Bank',
        docDate: '',
        fileName: '',
        dmsCode: '',
        uploaded: false
      },
      {
        docType: 'D02',
        docTypeDesc: 'SBLC - SWIFT Confirmation Issuance',
        docDate: '',
        fileName: '',
        dmsCode: '',
        uploaded: false
      },
      {
        docType: 'D03',
        docTypeDesc: 'SBLC - SWIFT Confirmation Termination',
        docDate: '',
        fileName: '',
        dmsCode: '',
        uploaded: false
      }
    ]
  },
  {
    companyCode: 'AE13',
    dealId: '13000318',
    sblcStatus: '04',
    sblcRequestStatusDescription: 'TSF Approval / SBLC Created',
    companyName: 'AE13 - Olam International DMCC',
    sblcTransaction: '2803000813',
    productTypeDescription: '22B - SBLC',
    sblcBeneficiary: '660012897',
    sblcRequestNumber: '26000776',
    startDate: '03-09-2025',
    endDate: '05-01-2027',
    sblcAmount: 31219,
    ottkNo: '300319',
    sblcRequestTypeDescription: '02 - SBLC TSF',
    lcAmountValue: 31219,
    entityString: 'E021 - OGA-DMCC-PAN',
    requestDate: '03-09-2025',
    expectedEndDate: '05-01-2027',
    currency: 'USD',
    issuingBank: 'SCB UAE',
    requestorCoName: 'Olam International DMCC',
    requestorBankName: 'Standard Chartered Bank UAE',
    expectedDate: '05-01-2027',
    requestedBy: 'Treasury User',
    sblcInitiateTermination: 'Pending',
    sblcTerminationDate: '',
    terminationCurrency: 'USD',
    terminationState: 'PENDING',
    dms: [
      {
        docType: 'D01',
        docTypeDesc: 'SBLC Bank',
        docDate: '',
        fileName: '',
        dmsCode: '',
        uploaded: false
      },
      {
        docType: 'D02',
        docTypeDesc: 'SBLC - SWIFT Confirmation Issuance',
        docDate: '',
        fileName: '',
        dmsCode: '',
        uploaded: false
      },
      {
        docType: 'D03',
        docTypeDesc: 'SBLC - SWIFT Confirmation Termination',
        docDate: '',
        fileName: '',
        dmsCode: '',
        uploaded: false
      }
    ]
  },
  {
    companyCode: 'AE13',
    dealId: '13000319',
    sblcStatus: '04',
    sblcRequestStatusDescription: 'TSF Approval / SBLC Created',
    companyName: 'AE13 - Olam International DMCC',
    sblcTransaction: '2803000794',
    productTypeDescription: '22B - SBLC',
    sblcBeneficiary: '660012906',
    sblcRequestNumber: '26000745',
    startDate: '03-09-2025',
    endDate: '25-11-2026',
    sblcAmount: 48559,
    ottkNo: '300319',
    sblcRequestTypeDescription: '02 - SBLC TSF',
    lcAmountValue: 48559,
    entityString: 'E021 - OGA-DMCC-PAN',
    requestDate: '03-09-2025',
    expectedEndDate: '25-11-2026',
    currency: 'USD',
    issuingBank: 'SCB UAE',
    requestorCoName: 'Olam International DMCC',
    requestorBankName: 'Standard Chartered Bank UAE',
    expectedDate: '25-11-2026',
    requestedBy: 'ALOR',
    sblcInitiateTermination: 'Pending',
    sblcTerminationDate: '',
    terminationCurrency: 'USD',
    terminationState: 'PENDING',
    dms: [
      {
        docType: 'D01',
        docTypeDesc: 'SBLC Bank',
        docDate: '',
        fileName: '',
        dmsCode: '',
        uploaded: false
      },
      {
        docType: 'D02',
        docTypeDesc: 'SBLC - SWIFT Confirmation Issuance',
        docDate: '',
        fileName: '',
        dmsCode: '',
        uploaded: false
      },
      {
        docType: 'D03',
        docTypeDesc: 'SBLC - SWIFT Confirmation Termination',
        docDate: '',
        fileName: '',
        dmsCode: '',
        uploaded: false
      }
    ]
  },
  {
    companyCode: 'AE13',
    dealId: '13000322',
    sblcStatus: '04',
    sblcRequestStatusDescription: 'TSF Approval / SBLC Created',
    companyName: 'AE13 - Olam International DMCC',
    sblcTransaction: '2803000795',
    productTypeDescription: '22B - SBLC',
    sblcBeneficiary: '660012906',
    sblcRequestNumber: '26000746',
    startDate: '03-09-2025',
    endDate: '18-12-2026',
    sblcAmount: 21833,
    ottkNo: '300322',
    sblcRequestTypeDescription: '02 - SBLC TSF',
    lcAmountValue: 21833,
    entityString: 'E021 - OGA-DMCC-PAN',
    requestDate: '03-09-2025',
    expectedEndDate: '18-12-2026',
    currency: 'USD',
    issuingBank: 'SCB UAE',
    requestorCoName: 'Olam International DMCC',
    requestorBankName: 'Standard Chartered Bank UAE',
    expectedDate: '18-12-2026',
    requestedBy: 'Treasury User',
    sblcInitiateTermination: 'Pending',
    sblcTerminationDate: '',
    terminationCurrency: 'USD',
    terminationState: 'PENDING',
    dms: [
      {
        docType: 'D01',
        docTypeDesc: 'SBLC Bank',
        docDate: '',
        fileName: '',
        dmsCode: '',
        uploaded: false
      },
      {
        docType: 'D02',
        docTypeDesc: 'SBLC - SWIFT Confirmation Issuance',
        docDate: '',
        fileName: '',
        dmsCode: '',
        uploaded: false
      },
      {
        docType: 'D03',
        docTypeDesc: 'SBLC - SWIFT Confirmation Termination',
        docDate: '',
        fileName: '',
        dmsCode: '',
        uploaded: false
      }
    ]
  },
  {
    companyCode: 'AE13',
    dealId: '13000323',
    sblcStatus: '04',
    sblcRequestStatusDescription: 'TSF Approval / SBLC Created',
    companyName: 'AE13 - Olam International DMCC',
    sblcTransaction: '2803000799',
    productTypeDescription: '22B - SBLC',
    sblcBeneficiary: '660012906',
    sblcRequestNumber: '26000751',
    startDate: '03-09-2025',
    endDate: '08-10-2026',
    sblcAmount: 77603,
    ottkNo: '300323',
    sblcRequestTypeDescription: '01 - SBLC',
    lcAmountValue: 77603,
    entityString: 'E021 - OGA-DMCC-PAN',
    requestDate: '03-09-2025',
    expectedEndDate: '08-10-2026',
    currency: 'USD',
    issuingBank: 'SCB UAE',
    requestorCoName: 'Olam International DMCC',
    requestorBankName: 'Standard Chartered Bank UAE',
    expectedDate: '08-10-2026',
    requestedBy: 'ALOR',
    sblcInitiateTermination: 'Pending',
    sblcTerminationDate: '',
    terminationCurrency: 'USD',
    terminationState: 'PENDING',
    dms: [
      {
        docType: 'D01',
        docTypeDesc: 'SBLC Bank',
        docDate: '',
        fileName: '',
        dmsCode: '',
        uploaded: false
      },
      {
        docType: 'D02',
        docTypeDesc: 'SBLC - SWIFT Confirmation Issuance',
        docDate: '',
        fileName: '',
        dmsCode: '',
        uploaded: false
      },
      {
        docType: 'D03',
        docTypeDesc: 'SBLC - SWIFT Confirmation Termination',
        docDate: '',
        fileName: '',
        dmsCode: '',
        uploaded: false
      }
    ]
  },
  {
    companyCode: 'AE13',
    dealId: '13000326',
    sblcStatus: '04',
    sblcRequestStatusDescription: 'TSF Approval / SBLC Created',
    companyName: 'AE13 - Olam International DMCC',
    sblcTransaction: '2803000801',
    productTypeDescription: '22B - SBLC',
    sblcBeneficiary: '660012897',
    sblcRequestNumber: '26000752',
    startDate: '03-09-2025',
    endDate: '22-09-2026',
    sblcAmount: 95396,
    ottkNo: '300325',
    sblcRequestTypeDescription: '02 - SBLC TSF',
    lcAmountValue: 95396,
    entityString: 'E021 - OGA-DMCC-PAN',
    requestDate: '03-09-2025',
    expectedEndDate: '22-09-2026',
    currency: 'USD',
    issuingBank: 'SCB UAE',
    requestorCoName: 'Olam International DMCC',
    requestorBankName: 'Standard Chartered Bank UAE',
    expectedDate: '22-09-2026',
    requestedBy: 'Treasury User',
    sblcInitiateTermination: 'Pending',
    sblcTerminationDate: '',
    terminationCurrency: 'USD',
    terminationState: 'PENDING',
    dms: [
      {
        docType: 'D01',
        docTypeDesc: 'SBLC Bank',
        docDate: '',
        fileName: '',
        dmsCode: '',
        uploaded: false
      },
      {
        docType: 'D02',
        docTypeDesc: 'SBLC - SWIFT Confirmation Issuance',
        docDate: '',
        fileName: '',
        dmsCode: '',
        uploaded: false
      },
      {
        docType: 'D03',
        docTypeDesc: 'SBLC - SWIFT Confirmation Termination',
        docDate: '',
        fileName: '',
        dmsCode: '',
        uploaded: false
      }
    ]
  },
  {
    companyCode: 'AE13',
    dealId: '13000329',
    sblcStatus: '04',
    sblcRequestStatusDescription: 'TSF Approval / SBLC Created',
    companyName: 'AE13 - Olam International DMCC',
    sblcTransaction: '2803000804',
    productTypeDescription: '22B - SBLC',
    sblcBeneficiary: '660012906',
    sblcRequestNumber: '26000755',
    startDate: '03-09-2025',
    endDate: '07-01-2027',
    sblcAmount: 74516,
    ottkNo: '300328',
    sblcRequestTypeDescription: '02 - SBLC TSF',
    lcAmountValue: 74516,
    entityString: 'E021 - OGA-DMCC-PAN',
    requestDate: '03-09-2025',
    expectedEndDate: '07-01-2027',
    currency: 'USD',
    issuingBank: 'SCB UAE',
    requestorCoName: 'Olam International DMCC',
    requestorBankName: 'Standard Chartered Bank UAE',
    expectedDate: '07-01-2027',
    requestedBy: 'ALOR',
    sblcInitiateTermination: 'Pending',
    sblcTerminationDate: '',
    terminationCurrency: 'USD',
    terminationState: 'PENDING',
    dms: [
      {
        docType: 'D01',
        docTypeDesc: 'SBLC Bank',
        docDate: '',
        fileName: '',
        dmsCode: '',
        uploaded: false
      },
      {
        docType: 'D02',
        docTypeDesc: 'SBLC - SWIFT Confirmation Issuance',
        docDate: '',
        fileName: '',
        dmsCode: '',
        uploaded: false
      },
      {
        docType: 'D03',
        docTypeDesc: 'SBLC - SWIFT Confirmation Termination',
        docDate: '',
        fileName: '',
        dmsCode: '',
        uploaded: false
      }
    ]
  },
  {
    companyCode: 'AE13',
    dealId: '13000333',
    sblcStatus: '04',
    sblcRequestStatusDescription: 'TSF Approval / SBLC Created',
    companyName: 'AE13 - Olam International DMCC',
    sblcTransaction: '2803000808',
    productTypeDescription: '22B - SBLC',
    sblcBeneficiary: '660012897',
    sblcRequestNumber: '26000758',
    startDate: '03-09-2025',
    endDate: '21-09-2026',
    sblcAmount: 82459,
    ottkNo: '300331',
    sblcRequestTypeDescription: '02 - SBLC TSF',
    lcAmountValue: 82459,
    entityString: 'E021 - OGA-DMCC-PAN',
    requestDate: '03-09-2025',
    expectedEndDate: '21-09-2026',
    currency: 'USD',
    issuingBank: 'SCB UAE',
    requestorCoName: 'Olam International DMCC',
    requestorBankName: 'Standard Chartered Bank UAE',
    expectedDate: '21-09-2026',
    requestedBy: 'Treasury User',
    sblcInitiateTermination: 'Pending',
    sblcTerminationDate: '',
    terminationCurrency: 'USD',
    terminationState: 'PENDING',
    dms: [
      {
        docType: 'D01',
        docTypeDesc: 'SBLC Bank',
        docDate: '',
        fileName: '',
        dmsCode: '',
        uploaded: false
      },
      {
        docType: 'D02',
        docTypeDesc: 'SBLC - SWIFT Confirmation Issuance',
        docDate: '',
        fileName: '',
        dmsCode: '',
        uploaded: false
      },
      {
        docType: 'D03',
        docTypeDesc: 'SBLC - SWIFT Confirmation Termination',
        docDate: '',
        fileName: '',
        dmsCode: '',
        uploaded: false
      }
    ]
  },
  {
    companyCode: 'AE13',
    dealId: '13000773',
    sblcStatus: '04',
    sblcRequestStatusDescription: 'TSF Approval / SBLC Created',
    companyName: 'AE13 - Olam International DMCC',
    sblcTransaction: '2803000809',
    productTypeDescription: '22B - SBLC',
    sblcBeneficiary: '660013365',
    sblcRequestNumber: '26000763',
    startDate: '03-09-2025',
    endDate: '11-02-2027',
    sblcAmount: 12977,
    ottkNo: '300336',
    sblcRequestTypeDescription: '01 - SBLC',
    lcAmountValue: 12977,
    entityString: 'E021 - OGA-DMCC-PAN',
    requestDate: '03-09-2025',
    expectedEndDate: '11-02-2027',
    currency: 'USD',
    issuingBank: 'SCB UAE',
    requestorCoName: 'Olam International DMCC',
    requestorBankName: 'Standard Chartered Bank UAE',
    expectedDate: '11-02-2027',
    requestedBy: 'ALOR',
    sblcInitiateTermination: 'Pending',
    sblcTerminationDate: '',
    terminationCurrency: 'USD',
    terminationState: 'PENDING',
    dms: [
      {
        docType: 'D01',
        docTypeDesc: 'SBLC Bank',
        docDate: '',
        fileName: '',
        dmsCode: '',
        uploaded: false
      },
      {
        docType: 'D02',
        docTypeDesc: 'SBLC - SWIFT Confirmation Issuance',
        docDate: '',
        fileName: '',
        dmsCode: '',
        uploaded: false
      },
      {
        docType: 'D03',
        docTypeDesc: 'SBLC - SWIFT Confirmation Termination',
        docDate: '',
        fileName: '',
        dmsCode: '',
        uploaded: false
      }
    ]
  },
  {
    companyCode: 'AE13',
    dealId: '13000334',
    sblcStatus: '04',
    sblcRequestStatusDescription: 'TSF Approval / SBLC Created',
    companyName: 'AE13 - Olam International DMCC',
    sblcTransaction: '2803000810',
    productTypeDescription: '22B - SBLC',
    sblcBeneficiary: '660012897',
    sblcRequestNumber: '26000764',
    startDate: '03-09-2025',
    endDate: '14-12-2027',
    sblcAmount: 148,
    ottkNo: '100567',
    sblcRequestTypeDescription: '02 - SBLC TSF',
    lcAmountValue: 148,
    entityString: 'E021 - OGA-DMCC-PAN',
    requestDate: '03-09-2025',
    expectedEndDate: '14-12-2027',
    currency: 'USD',
    issuingBank: 'SCB UAE',
    requestorCoName: 'Olam International DMCC',
    requestorBankName: 'Standard Chartered Bank UAE',
    expectedDate: '14-12-2027',
    requestedBy: 'Treasury User',
    sblcInitiateTermination: 'Pending',
    sblcTerminationDate: '',
    terminationCurrency: 'USD',
    terminationState: 'PENDING',
    dms: [
      {
        docType: 'D01',
        docTypeDesc: 'SBLC Bank',
        docDate: '',
        fileName: '',
        dmsCode: '',
        uploaded: false
      },
      {
        docType: 'D02',
        docTypeDesc: 'SBLC - SWIFT Confirmation Issuance',
        docDate: '',
        fileName: '',
        dmsCode: '',
        uploaded: false
      },
      {
        docType: 'D03',
        docTypeDesc: 'SBLC - SWIFT Confirmation Termination',
        docDate: '',
        fileName: '',
        dmsCode: '',
        uploaded: false
      }
    ]
  },
  {
    companyCode: 'AE13',
    dealId: '12000774',
    sblcStatus: '04',
    sblcRequestStatusDescription: 'TSF Approval / SBLC Created',
    companyName: 'AE13 - Olam International DMCC',
    sblcTransaction: '2803000811',
    productTypeDescription: '22B - SBLC',
    sblcBeneficiary: '660013411',
    sblcRequestNumber: '26000765',
    startDate: '03-09-2025',
    endDate: '29-04-2028',
    sblcAmount: 98951,
    ottkNo: '100568',
    sblcRequestTypeDescription: '02 - SBLC TSF',
    lcAmountValue: 98951,
    entityString: 'E021 - OGA-DMCC-PAN',
    requestDate: '03-09-2025',
    expectedEndDate: '29-04-2028',
    currency: 'USD',
    issuingBank: 'SCB UAE',
    requestorCoName: 'Olam International DMCC',
    requestorBankName: 'Standard Chartered Bank UAE',
    expectedDate: '29-04-2028',
    requestedBy: 'ALOR',
    sblcInitiateTermination: 'Pending',
    sblcTerminationDate: '',
    terminationCurrency: 'USD',
    terminationState: 'PENDING',
    dms: [
      {
        docType: 'D01',
        docTypeDesc: 'SBLC Bank',
        docDate: '',
        fileName: '',
        dmsCode: '',
        uploaded: false
      },
      {
        docType: 'D02',
        docTypeDesc: 'SBLC - SWIFT Confirmation Issuance',
        docDate: '',
        fileName: '',
        dmsCode: '',
        uploaded: false
      },
      {
        docType: 'D03',
        docTypeDesc: 'SBLC - SWIFT Confirmation Termination',
        docDate: '',
        fileName: '',
        dmsCode: '',
        uploaded: false
      }
    ]
  },
  {
    companyCode: 'AE13',
    dealId: '13000335',
    sblcStatus: '04',
    sblcRequestStatusDescription: 'TSF Approval / SBLC Created',
    companyName: 'AE13 - Olam International DMCC',
    sblcTransaction: '2803000812',
    productTypeDescription: '22B - SBLC',
    sblcBeneficiary: '660012897',
    sblcRequestNumber: '26000766',
    startDate: '03-09-2025',
    endDate: '10-01-2027',
    sblcAmount: 19562,
    ottkNo: '100568',
    sblcRequestTypeDescription: '02 - SBLC TSF',
    lcAmountValue: 19562,
    entityString: 'E021 - OGA-DMCC-PAN',
    requestDate: '03-09-2025',
    expectedEndDate: '10-01-2027',
    currency: 'USD',
    issuingBank: 'SCB UAE',
    requestorCoName: 'Olam International DMCC',
    requestorBankName: 'Standard Chartered Bank UAE',
    expectedDate: '10-01-2027',
    requestedBy: 'Treasury User',
    sblcInitiateTermination: 'Pending',
    sblcTerminationDate: '',
    terminationCurrency: 'USD',
    terminationState: 'PENDING',
    dms: [
      {
        docType: 'D01',
        docTypeDesc: 'SBLC Bank',
        docDate: '',
        fileName: '',
        dmsCode: '',
        uploaded: false
      },
      {
        docType: 'D02',
        docTypeDesc: 'SBLC - SWIFT Confirmation Issuance',
        docDate: '',
        fileName: '',
        dmsCode: '',
        uploaded: false
      },
      {
        docType: 'D03',
        docTypeDesc: 'SBLC - SWIFT Confirmation Termination',
        docDate: '',
        fileName: '',
        dmsCode: '',
        uploaded: false
      }
    ]
  },
  {
    companyCode: 'AE13',
    dealId: '13000337',
    sblcStatus: '04',
    sblcRequestStatusDescription: 'TSF Approval / SBLC Created',
    companyName: 'AE13 - Olam International DMCC',
    sblcTransaction: '2803000814',
    productTypeDescription: '22B - SBLC',
    sblcBeneficiary: '660013411',
    sblcRequestNumber: '26000768',
    startDate: '04-09-2025',
    endDate: '04-08-2027',
    sblcAmount: 21089,
    ottkNo: '100569',
    sblcRequestTypeDescription: '01 - SBLC',
    lcAmountValue: 21089,
    entityString: 'E021 - OGA-DMCC-PAN',
    requestDate: '04-09-2025',
    expectedEndDate: '04-08-2027',
    currency: 'USD',
    issuingBank: 'SCB UAE',
    requestorCoName: 'Olam International DMCC',
    requestorBankName: 'Standard Chartered Bank UAE',
    expectedDate: '04-08-2027',
    requestedBy: 'ALOR',
    sblcInitiateTermination: 'Pending',
    sblcTerminationDate: '',
    terminationCurrency: 'USD',
    terminationState: 'PENDING',
    dms: [
      {
        docType: 'D01',
        docTypeDesc: 'SBLC Bank',
        docDate: '',
        fileName: '',
        dmsCode: '',
        uploaded: false
      },
      {
        docType: 'D02',
        docTypeDesc: 'SBLC - SWIFT Confirmation Issuance',
        docDate: '',
        fileName: '',
        dmsCode: '',
        uploaded: false
      },
      {
        docType: 'D03',
        docTypeDesc: 'SBLC - SWIFT Confirmation Termination',
        docDate: '',
        fileName: '',
        dmsCode: '',
        uploaded: false
      }
    ]
  },
  {
    companyCode: 'AE13',
    dealId: '12000775',
    sblcStatus: '04',
    sblcRequestStatusDescription: 'TSF Approval / SBLC Created',
    companyName: 'AE13 - Olam International DMCC',
    sblcTransaction: '2803000815',
    productTypeDescription: '22B - SBLC',
    sblcBeneficiary: '660013411',
    sblcRequestNumber: '26000769',
    startDate: '04-09-2025',
    endDate: '19-01-2027',
    sblcAmount: 186,
    ottkNo: '100569',
    sblcRequestTypeDescription: '02 - SBLC TSF',
    lcAmountValue: 186,
    entityString: 'E021 - OGA-DMCC-PAN',
    requestDate: '04-09-2025',
    expectedEndDate: '19-01-2027',
    currency: 'USD',
    issuingBank: 'SCB UAE',
    requestorCoName: 'Olam International DMCC',
    requestorBankName: 'Standard Chartered Bank UAE',
    expectedDate: '19-01-2027',
    requestedBy: 'Treasury User',
    sblcInitiateTermination: 'Pending',
    sblcTerminationDate: '',
    terminationCurrency: 'USD',
    terminationState: 'PENDING',
    dms: [
      {
        docType: 'D01',
        docTypeDesc: 'SBLC Bank',
        docDate: '',
        fileName: '',
        dmsCode: '',
        uploaded: false
      },
      {
        docType: 'D02',
        docTypeDesc: 'SBLC - SWIFT Confirmation Issuance',
        docDate: '',
        fileName: '',
        dmsCode: '',
        uploaded: false
      },
      {
        docType: 'D03',
        docTypeDesc: 'SBLC - SWIFT Confirmation Termination',
        docDate: '',
        fileName: '',
        dmsCode: '',
        uploaded: false
      }
    ]
  },
  {
    companyCode: 'AE13',
    dealId: '12000771',
    sblcStatus: '04',
    sblcRequestStatusDescription: 'TSF Approval / SBLC Created',
    companyName: 'AE13 - Olam International DMCC',
    sblcTransaction: '2803000820',
    productTypeDescription: '22B - SBLC',
    sblcBeneficiary: '660013541',
    sblcRequestNumber: '26000774',
    startDate: '04-09-2025',
    endDate: '28-10-2027',
    sblcAmount: 269,
    ottkNo: '100659',
    sblcRequestTypeDescription: '02 - SBLC TSF',
    lcAmountValue: 269,
    entityString: 'E021 - OGA-DMCC-PAN',
    requestDate: '04-09-2025',
    expectedEndDate: '28-10-2027',
    currency: 'USD',
    issuingBank: 'SCB UAE',
    requestorCoName: 'Olam International DMCC',
    requestorBankName: 'Standard Chartered Bank UAE',
    expectedDate: '28-10-2027',
    requestedBy: 'ALOR',
    sblcInitiateTermination: 'Pending',
    sblcTerminationDate: '',
    terminationCurrency: 'USD',
    terminationState: 'PENDING',
    dms: [
      {
        docType: 'D01',
        docTypeDesc: 'SBLC Bank',
        docDate: '',
        fileName: '',
        dmsCode: '',
        uploaded: false
      },
      {
        docType: 'D02',
        docTypeDesc: 'SBLC - SWIFT Confirmation Issuance',
        docDate: '',
        fileName: '',
        dmsCode: '',
        uploaded: false
      },
      {
        docType: 'D03',
        docTypeDesc: 'SBLC - SWIFT Confirmation Termination',
        docDate: '',
        fileName: '',
        dmsCode: '',
        uploaded: false
      }
    ]
  },
  {
    companyCode: 'AE13',
    dealId: '12000811',
    sblcStatus: '04',
    sblcRequestStatusDescription: 'TSF Approval / SBLC Created',
    companyName: 'AE13 - Olam International DMCC',
    sblcTransaction: '2803000824',
    productTypeDescription: '22B - SBLC',
    sblcBeneficiary: '660013358',
    sblcRequestNumber: '26000778',
    startDate: '05-09-2025',
    endDate: '17-09-2027',
    sblcAmount: 151,
    ottkNo: '100609',
    sblcRequestTypeDescription: '02 - SBLC TSF',
    lcAmountValue: 151,
    entityString: 'E021 - OGA-DMCC-PAN',
    requestDate: '05-09-2025',
    expectedEndDate: '17-09-2027',
    currency: 'USD',
    issuingBank: 'SCB UAE',
    requestorCoName: 'Olam International DMCC',
    requestorBankName: 'Standard Chartered Bank UAE',
    expectedDate: '17-09-2027',
    requestedBy: 'Treasury User',
    sblcInitiateTermination: 'Pending',
    sblcTerminationDate: '',
    terminationCurrency: 'USD',
    terminationState: 'PENDING',
    dms: [
      {
        docType: 'D01',
        docTypeDesc: 'SBLC Bank',
        docDate: '',
        fileName: '',
        dmsCode: '',
        uploaded: false
      },
      {
        docType: 'D02',
        docTypeDesc: 'SBLC - SWIFT Confirmation Issuance',
        docDate: '',
        fileName: '',
        dmsCode: '',
        uploaded: false
      },
      {
        docType: 'D03',
        docTypeDesc: 'SBLC - SWIFT Confirmation Termination',
        docDate: '',
        fileName: '',
        dmsCode: '',
        uploaded: false
      }
    ]
  },
  {
    companyCode: 'AE13',
    dealId: '12000815',
    sblcStatus: '04',
    sblcRequestStatusDescription: 'TSF Approval / SBLC Created',
    companyName: 'AE13 - Olam International DMCC',
    sblcTransaction: '2803000825',
    productTypeDescription: '22B - SBLC',
    sblcBeneficiary: '660013541',
    sblcRequestNumber: '26000779',
    startDate: '05-09-2025',
    endDate: '27-07-2027',
    sblcAmount: 115,
    ottkNo: '100611',
    sblcRequestTypeDescription: '01 - SBLC',
    lcAmountValue: 115,
    entityString: 'E021 - OGA-DMCC-PAN',
    requestDate: '05-09-2025',
    expectedEndDate: '27-07-2027',
    currency: 'USD',
    issuingBank: 'SCB UAE',
    requestorCoName: 'Olam International DMCC',
    requestorBankName: 'Standard Chartered Bank UAE',
    expectedDate: '27-07-2027',
    requestedBy: 'ALOR',
    sblcInitiateTermination: 'Pending',
    sblcTerminationDate: '',
    terminationCurrency: 'USD',
    terminationState: 'PENDING',
    dms: [
      {
        docType: 'D01',
        docTypeDesc: 'SBLC Bank',
        docDate: '',
        fileName: '',
        dmsCode: '',
        uploaded: false
      },
      {
        docType: 'D02',
        docTypeDesc: 'SBLC - SWIFT Confirmation Issuance',
        docDate: '',
        fileName: '',
        dmsCode: '',
        uploaded: false
      },
      {
        docType: 'D03',
        docTypeDesc: 'SBLC - SWIFT Confirmation Termination',
        docDate: '',
        fileName: '',
        dmsCode: '',
        uploaded: false
      }
    ]
  },
  {
    companyCode: 'AE13',
    dealId: '12000817',
    sblcStatus: '04',
    sblcRequestStatusDescription: 'TSF Approval / SBLC Created',
    companyName: 'AE13 - Olam International DMCC',
    sblcTransaction: '2803000828',
    productTypeDescription: '22B - SBLC',
    sblcBeneficiary: '660013365',
    sblcRequestNumber: '26000781',
    startDate: '05-09-2025',
    endDate: '25-12-2027',
    sblcAmount: 265,
    ottkNo: '100621',
    sblcRequestTypeDescription: '02 - SBLC TSF',
    lcAmountValue: 265,
    entityString: 'E021 - OGA-DMCC-PAN',
    requestDate: '05-09-2025',
    expectedEndDate: '25-12-2027',
    currency: 'USD',
    issuingBank: 'SCB UAE',
    requestorCoName: 'Olam International DMCC',
    requestorBankName: 'Standard Chartered Bank UAE',
    expectedDate: '25-12-2027',
    requestedBy: 'Treasury User',
    sblcInitiateTermination: 'Pending',
    sblcTerminationDate: '',
    terminationCurrency: 'USD',
    terminationState: 'PENDING',
    dms: [
      {
        docType: 'D01',
        docTypeDesc: 'SBLC Bank',
        docDate: '',
        fileName: '',
        dmsCode: '',
        uploaded: false
      },
      {
        docType: 'D02',
        docTypeDesc: 'SBLC - SWIFT Confirmation Issuance',
        docDate: '',
        fileName: '',
        dmsCode: '',
        uploaded: false
      },
      {
        docType: 'D03',
        docTypeDesc: 'SBLC - SWIFT Confirmation Termination',
        docDate: '',
        fileName: '',
        dmsCode: '',
        uploaded: false
      }
    ]
  },
  {
    companyCode: 'AE13',
    dealId: '12000827',
    sblcStatus: '04',
    sblcRequestStatusDescription: 'TSF Approval / SBLC Created',
    companyName: 'AE13 - Olam International DMCC',
    sblcTransaction: '2803000832',
    productTypeDescription: '22B - SBLC',
    sblcBeneficiary: '660013365',
    sblcRequestNumber: '26000785',
    startDate: '05-09-2025',
    endDate: '23-12-2027',
    sblcAmount: 179,
    ottkNo: '100622',
    sblcRequestTypeDescription: '02 - SBLC TSF',
    lcAmountValue: 179,
    entityString: 'E021 - OGA-DMCC-PAN',
    requestDate: '05-09-2025',
    expectedEndDate: '23-12-2027',
    currency: 'USD',
    issuingBank: 'SCB UAE',
    requestorCoName: 'Olam International DMCC',
    requestorBankName: 'Standard Chartered Bank UAE',
    expectedDate: '23-12-2027',
    requestedBy: 'ALOR',
    sblcInitiateTermination: 'Pending',
    sblcTerminationDate: '',
    terminationCurrency: 'USD',
    terminationState: 'PENDING',
    dms: [
      {
        docType: 'D01',
        docTypeDesc: 'SBLC Bank',
        docDate: '',
        fileName: '',
        dmsCode: '',
        uploaded: false
      },
      {
        docType: 'D02',
        docTypeDesc: 'SBLC - SWIFT Confirmation Issuance',
        docDate: '',
        fileName: '',
        dmsCode: '',
        uploaded: false
      },
      {
        docType: 'D03',
        docTypeDesc: 'SBLC - SWIFT Confirmation Termination',
        docDate: '',
        fileName: '',
        dmsCode: '',
        uploaded: false
      }
    ]
  },
  {
    companyCode: 'AE13',
    dealId: '12000828',
    sblcStatus: '04',
    sblcRequestStatusDescription: 'TSF Approval / SBLC Created',
    companyName: 'AE13 - Olam International DMCC',
    sblcTransaction: '2803000830',
    productTypeDescription: '22B - SBLC',
    sblcBeneficiary: '660013365',
    sblcRequestNumber: '26000784',
    startDate: '05-09-2025',
    endDate: '14-03-2028',
    sblcAmount: 134,
    ottkNo: '100624',
    sblcRequestTypeDescription: '02 - SBLC TSF',
    lcAmountValue: 134,
    entityString: 'E021 - OGA-DMCC-PAN',
    requestDate: '05-09-2025',
    expectedEndDate: '14-03-2028',
    currency: 'USD',
    issuingBank: 'SCB UAE',
    requestorCoName: 'Olam International DMCC',
    requestorBankName: 'Standard Chartered Bank UAE',
    expectedDate: '14-03-2028',
    requestedBy: 'Treasury User',
    sblcInitiateTermination: 'Pending',
    sblcTerminationDate: '',
    terminationCurrency: 'USD',
    terminationState: 'PENDING',
    dms: [
      {
        docType: 'D01',
        docTypeDesc: 'SBLC Bank',
        docDate: '',
        fileName: '',
        dmsCode: '',
        uploaded: false
      },
      {
        docType: 'D02',
        docTypeDesc: 'SBLC - SWIFT Confirmation Issuance',
        docDate: '',
        fileName: '',
        dmsCode: '',
        uploaded: false
      },
      {
        docType: 'D03',
        docTypeDesc: 'SBLC - SWIFT Confirmation Termination',
        docDate: '',
        fileName: '',
        dmsCode: '',
        uploaded: false
      }
    ]
  },
  {
    companyCode: 'AE13',
    dealId: '12000830',
    sblcStatus: '04',
    sblcRequestStatusDescription: 'TSF Approval / SBLC Created',
    companyName: 'AE13 - Olam International DMCC',
    sblcTransaction: '2803000833',
    productTypeDescription: '22B - SBLC',
    sblcBeneficiary: '660013411',
    sblcRequestNumber: '26000787',
    startDate: '05-09-2025',
    endDate: '25-05-2027',
    sblcAmount: 268,
    ottkNo: '100626',
    sblcRequestTypeDescription: '01 - SBLC',
    lcAmountValue: 268,
    entityString: 'E021 - OGA-DMCC-PAN',
    requestDate: '05-09-2025',
    expectedEndDate: '25-05-2027',
    currency: 'USD',
    issuingBank: 'SCB UAE',
    requestorCoName: 'Olam International DMCC',
    requestorBankName: 'Standard Chartered Bank UAE',
    expectedDate: '25-05-2027',
    requestedBy: 'ALOR',
    sblcInitiateTermination: 'Pending',
    sblcTerminationDate: '',
    terminationCurrency: 'USD',
    terminationState: 'PENDING',
    dms: [
      {
        docType: 'D01',
        docTypeDesc: 'SBLC Bank',
        docDate: '',
        fileName: '',
        dmsCode: '',
        uploaded: false
      },
      {
        docType: 'D02',
        docTypeDesc: 'SBLC - SWIFT Confirmation Issuance',
        docDate: '',
        fileName: '',
        dmsCode: '',
        uploaded: false
      },
      {
        docType: 'D03',
        docTypeDesc: 'SBLC - SWIFT Confirmation Termination',
        docDate: '',
        fileName: '',
        dmsCode: '',
        uploaded: false
      }
    ]
  },
  {
    companyCode: 'AE13',
    dealId: '12000832',
    sblcStatus: '04',
    sblcRequestStatusDescription: 'TSF Approval / SBLC Created',
    companyName: 'AE13 - Olam International DMCC',
    sblcTransaction: '2803000834',
    productTypeDescription: '22B - SBLC',
    sblcBeneficiary: '660013411',
    sblcRequestNumber: '26000788',
    startDate: '05-09-2025',
    endDate: '13-06-2027',
    sblcAmount: 152,
    ottkNo: '100647',
    sblcRequestTypeDescription: '02 - SBLC TSF',
    lcAmountValue: 152,
    entityString: 'E021 - OGA-DMCC-PAN',
    requestDate: '05-09-2025',
    expectedEndDate: '13-06-2027',
    currency: 'USD',
    issuingBank: 'SCB UAE',
    requestorCoName: 'Olam International DMCC',
    requestorBankName: 'Standard Chartered Bank UAE',
    expectedDate: '13-06-2027',
    requestedBy: 'Treasury User',
    sblcInitiateTermination: 'Pending',
    sblcTerminationDate: '',
    terminationCurrency: 'USD',
    terminationState: 'PENDING',
    dms: [
      {
        docType: 'D01',
        docTypeDesc: 'SBLC Bank',
        docDate: '',
        fileName: '',
        dmsCode: '',
        uploaded: false
      },
      {
        docType: 'D02',
        docTypeDesc: 'SBLC - SWIFT Confirmation Issuance',
        docDate: '',
        fileName: '',
        dmsCode: '',
        uploaded: false
      },
      {
        docType: 'D03',
        docTypeDesc: 'SBLC - SWIFT Confirmation Termination',
        docDate: '',
        fileName: '',
        dmsCode: '',
        uploaded: false
      }
    ]
  },
  {
    companyCode: 'AE13',
    dealId: '12000833',
    sblcStatus: '04',
    sblcRequestStatusDescription: 'TSF Approval / SBLC Created',
    companyName: 'AE13 - Olam International DMCC',
    sblcTransaction: '2803000835',
    productTypeDescription: '22B - SBLC',
    sblcBeneficiary: '660013411',
    sblcRequestNumber: '26000789',
    startDate: '05-09-2025',
    endDate: '29-06-2027',
    sblcAmount: 297,
    ottkNo: '100628',
    sblcRequestTypeDescription: '02 - SBLC TSF',
    lcAmountValue: 297,
    entityString: 'E021 - OGA-DMCC-PAN',
    requestDate: '05-09-2025',
    expectedEndDate: '29-06-2027',
    currency: 'USD',
    issuingBank: 'SCB UAE',
    requestorCoName: 'Olam International DMCC',
    requestorBankName: 'Standard Chartered Bank UAE',
    expectedDate: '29-06-2027',
    requestedBy: 'ALOR',
    sblcInitiateTermination: 'Pending',
    sblcTerminationDate: '',
    terminationCurrency: 'USD',
    terminationState: 'PENDING',
    dms: [
      {
        docType: 'D01',
        docTypeDesc: 'SBLC Bank',
        docDate: '',
        fileName: '',
        dmsCode: '',
        uploaded: false
      },
      {
        docType: 'D02',
        docTypeDesc: 'SBLC - SWIFT Confirmation Issuance',
        docDate: '',
        fileName: '',
        dmsCode: '',
        uploaded: false
      },
      {
        docType: 'D03',
        docTypeDesc: 'SBLC - SWIFT Confirmation Termination',
        docDate: '',
        fileName: '',
        dmsCode: '',
        uploaded: false
      }
    ]
  },
  {
    companyCode: 'AE13',
    dealId: '12000834',
    sblcStatus: '04',
    sblcRequestStatusDescription: 'TSF Approval / SBLC Created',
    companyName: 'AE13 - Olam International DMCC',
    sblcTransaction: '2803000834',
    productTypeDescription: '22B - SBLC',
    sblcBeneficiary: '660013411',
    sblcRequestNumber: '26000790',
    startDate: '05-09-2025',
    endDate: '30-05-2027',
    sblcAmount: 117,
    ottkNo: '100646',
    sblcRequestTypeDescription: '02 - SBLC TSF',
    lcAmountValue: 117,
    entityString: 'E021 - OGA-DMCC-PAN',
    requestDate: '05-09-2025',
    expectedEndDate: '30-05-2027',
    currency: 'USD',
    issuingBank: 'SCB UAE',
    requestorCoName: 'Olam International DMCC',
    requestorBankName: 'Standard Chartered Bank UAE',
    expectedDate: '30-05-2027',
    requestedBy: 'Treasury User',
    sblcInitiateTermination: 'Pending',
    sblcTerminationDate: '',
    terminationCurrency: 'USD',
    terminationState: 'PENDING',
    dms: [
      {
        docType: 'D01',
        docTypeDesc: 'SBLC Bank',
        docDate: '',
        fileName: '',
        dmsCode: '',
        uploaded: false
      },
      {
        docType: 'D02',
        docTypeDesc: 'SBLC - SWIFT Confirmation Issuance',
        docDate: '',
        fileName: '',
        dmsCode: '',
        uploaded: false
      },
      {
        docType: 'D03',
        docTypeDesc: 'SBLC - SWIFT Confirmation Termination',
        docDate: '',
        fileName: '',
        dmsCode: '',
        uploaded: false
      }
    ]
  },
  {
    companyCode: 'SG03',
    dealId: '14000001',
    sblcStatus: '04',
    sblcRequestStatusDescription: 'TSF Approval / SBLC Created',
    companyName: 'SG03 - OLAM GlobalAgri Pte. Ltd',
    sblcTransaction: '2804000900',
    productTypeDescription: '22B - SBLC',
    sblcBeneficiary: '660013541',
    sblcRequestNumber: '26000900',
    startDate: '08-09-2025',
    endDate: '28-01-2028',
    sblcAmount: 190,
    ottkNo: '400700',
    sblcRequestTypeDescription: '01 - SBLC',
    lcAmountValue: 190,
    entityString: 'E021 - OGA-DMCC-PAN',
    requestDate: '08-09-2025',
    expectedEndDate: '28-01-2028',
    currency: 'USD',
    issuingBank: 'SCB UAE',
    requestorCoName: 'OLAM GlobalAgri Pte. Ltd',
    requestorBankName: 'Standard Chartered Bank UAE',
    expectedDate: '28-01-2028',
    requestedBy: 'ALOR',
    sblcInitiateTermination: 'Pending',
    sblcTerminationDate: '',
    terminationCurrency: 'USD',
    terminationState: 'PENDING',
    dms: [
      {
        docType: 'D01',
        docTypeDesc: 'SBLC Bank',
        docDate: '',
        fileName: '',
        dmsCode: '',
        uploaded: false
      },
      {
        docType: 'D02',
        docTypeDesc: 'SBLC - SWIFT Confirmation Issuance',
        docDate: '',
        fileName: '',
        dmsCode: '',
        uploaded: false
      },
      {
        docType: 'D03',
        docTypeDesc: 'SBLC - SWIFT Confirmation Termination',
        docDate: '',
        fileName: '',
        dmsCode: '',
        uploaded: false
      }
    ]
  },
  {
    companyCode: 'SG03',
    dealId: '14000002',
    sblcStatus: '04',
    sblcRequestStatusDescription: 'TSF Approval / SBLC Created',
    companyName: 'SG03 - OLAM GlobalAgri Pte. Ltd',
    sblcTransaction: '2804000901',
    productTypeDescription: '22B - SBLC',
    sblcBeneficiary: '660012897',
    sblcRequestNumber: '26000901',
    startDate: '03-09-2025',
    endDate: '05-03-2027',
    sblcAmount: 28331,
    ottkNo: '400701',
    sblcRequestTypeDescription: '02 - SBLC TSF',
    lcAmountValue: 28331,
    entityString: 'E021 - OGA-DMCC-PAN',
    requestDate: '03-09-2025',
    expectedEndDate: '05-03-2027',
    currency: 'USD',
    issuingBank: 'SCB UAE',
    requestorCoName: 'OLAM GlobalAgri Pte. Ltd',
    requestorBankName: 'Standard Chartered Bank UAE',
    expectedDate: '05-03-2027',
    requestedBy: 'Treasury User',
    sblcInitiateTermination: 'Pending',
    sblcTerminationDate: '',
    terminationCurrency: 'USD',
    terminationState: 'PENDING',
    dms: [
      {
        docType: 'D01',
        docTypeDesc: 'SBLC Bank',
        docDate: '',
        fileName: '',
        dmsCode: '',
        uploaded: false
      },
      {
        docType: 'D02',
        docTypeDesc: 'SBLC - SWIFT Confirmation Issuance',
        docDate: '',
        fileName: '',
        dmsCode: '',
        uploaded: false
      },
      {
        docType: 'D03',
        docTypeDesc: 'SBLC - SWIFT Confirmation Termination',
        docDate: '',
        fileName: '',
        dmsCode: '',
        uploaded: false
      }
    ]
  },
  {
    companyCode: 'SG03',
    dealId: '14000003',
    sblcStatus: '04',
    sblcRequestStatusDescription: 'TSF Approval / SBLC Created',
    companyName: 'SG03 - OLAM GlobalAgri Pte. Ltd',
    sblcTransaction: '2804000902',
    productTypeDescription: '22B - SBLC',
    sblcBeneficiary: '660012897',
    sblcRequestNumber: '26000902',
    startDate: '03-09-2025',
    endDate: '17-02-2027',
    sblcAmount: 83677,
    ottkNo: '400702',
    sblcRequestTypeDescription: '02 - SBLC TSF',
    lcAmountValue: 83677,
    entityString: 'E021 - OGA-DMCC-PAN',
    requestDate: '03-09-2025',
    expectedEndDate: '17-02-2027',
    currency: 'USD',
    issuingBank: 'SCB UAE',
    requestorCoName: 'OLAM GlobalAgri Pte. Ltd',
    requestorBankName: 'Standard Chartered Bank UAE',
    expectedDate: '17-02-2027',
    requestedBy: 'ALOR',
    sblcInitiateTermination: 'Pending',
    sblcTerminationDate: '',
    terminationCurrency: 'USD',
    terminationState: 'PENDING',
    dms: [
      {
        docType: 'D01',
        docTypeDesc: 'SBLC Bank',
        docDate: '',
        fileName: '',
        dmsCode: '',
        uploaded: false
      },
      {
        docType: 'D02',
        docTypeDesc: 'SBLC - SWIFT Confirmation Issuance',
        docDate: '',
        fileName: '',
        dmsCode: '',
        uploaded: false
      },
      {
        docType: 'D03',
        docTypeDesc: 'SBLC - SWIFT Confirmation Termination',
        docDate: '',
        fileName: '',
        dmsCode: '',
        uploaded: false
      }
    ]
  },
  {
    companyCode: 'SG03',
    dealId: '14000004',
    sblcStatus: '04',
    sblcRequestStatusDescription: 'TSF Approval / SBLC Created',
    companyName: 'SG03 - OLAM GlobalAgri Pte. Ltd',
    sblcTransaction: '2804000903',
    productTypeDescription: '22B - SBLC',
    sblcBeneficiary: '660012903',
    sblcRequestNumber: '26000903',
    startDate: '03-09-2025',
    endDate: '18-01-2027',
    sblcAmount: 60398,
    ottkNo: '400703',
    sblcRequestTypeDescription: '02 - SBLC TSF',
    lcAmountValue: 60398,
    entityString: 'E021 - OGA-DMCC-PAN',
    requestDate: '03-09-2025',
    expectedEndDate: '18-01-2027',
    currency: 'USD',
    issuingBank: 'SCB UAE',
    requestorCoName: 'OLAM GlobalAgri Pte. Ltd',
    requestorBankName: 'Standard Chartered Bank UAE',
    expectedDate: '18-01-2027',
    requestedBy: 'Treasury User',
    sblcInitiateTermination: 'Pending',
    sblcTerminationDate: '',
    terminationCurrency: 'USD',
    terminationState: 'PENDING',
    dms: [
      {
        docType: 'D01',
        docTypeDesc: 'SBLC Bank',
        docDate: '',
        fileName: '',
        dmsCode: '',
        uploaded: false
      },
      {
        docType: 'D02',
        docTypeDesc: 'SBLC - SWIFT Confirmation Issuance',
        docDate: '',
        fileName: '',
        dmsCode: '',
        uploaded: false
      },
      {
        docType: 'D03',
        docTypeDesc: 'SBLC - SWIFT Confirmation Termination',
        docDate: '',
        fileName: '',
        dmsCode: '',
        uploaded: false
      }
    ]
  },
  {
    companyCode: 'SG03',
    dealId: '14000005',
    sblcStatus: '04',
    sblcRequestStatusDescription: 'TSF Approval / SBLC Created',
    companyName: 'SG03 - OLAM GlobalAgri Pte. Ltd',
    sblcTransaction: '2804000904',
    productTypeDescription: '22B - SBLC',
    sblcBeneficiary: '660012903',
    sblcRequestNumber: '26000904',
    startDate: '03-09-2025',
    endDate: '04-02-2027',
    sblcAmount: 45107,
    ottkNo: '400704',
    sblcRequestTypeDescription: '01 - SBLC',
    lcAmountValue: 45107,
    entityString: 'E021 - OGA-DMCC-PAN',
    requestDate: '03-09-2025',
    expectedEndDate: '04-02-2027',
    currency: 'USD',
    issuingBank: 'SCB UAE',
    requestorCoName: 'OLAM GlobalAgri Pte. Ltd',
    requestorBankName: 'Standard Chartered Bank UAE',
    expectedDate: '04-02-2027',
    requestedBy: 'ALOR',
    sblcInitiateTermination: 'Pending',
    sblcTerminationDate: '',
    terminationCurrency: 'USD',
    terminationState: 'PENDING',
    dms: [
      {
        docType: 'D01',
        docTypeDesc: 'SBLC Bank',
        docDate: '',
        fileName: '',
        dmsCode: '',
        uploaded: false
      },
      {
        docType: 'D02',
        docTypeDesc: 'SBLC - SWIFT Confirmation Issuance',
        docDate: '',
        fileName: '',
        dmsCode: '',
        uploaded: false
      },
      {
        docType: 'D03',
        docTypeDesc: 'SBLC - SWIFT Confirmation Termination',
        docDate: '',
        fileName: '',
        dmsCode: '',
        uploaded: false
      }
    ]
  },
  {
    companyCode: 'SG03',
    dealId: '14000006',
    sblcStatus: '04',
    sblcRequestStatusDescription: 'TSF Approval / SBLC Created',
    companyName: 'SG03 - OLAM GlobalAgri Pte. Ltd',
    sblcTransaction: '2804000905',
    productTypeDescription: '22B - SBLC',
    sblcBeneficiary: '660012897',
    sblcRequestNumber: '26000905',
    startDate: '03-09-2025',
    endDate: '05-01-2027',
    sblcAmount: 31219,
    ottkNo: '400705',
    sblcRequestTypeDescription: '02 - SBLC TSF',
    lcAmountValue: 31219,
    entityString: 'E021 - OGA-DMCC-PAN',
    requestDate: '03-09-2025',
    expectedEndDate: '05-01-2027',
    currency: 'USD',
    issuingBank: 'SCB UAE',
    requestorCoName: 'OLAM GlobalAgri Pte. Ltd',
    requestorBankName: 'Standard Chartered Bank UAE',
    expectedDate: '05-01-2027',
    requestedBy: 'Treasury User',
    sblcInitiateTermination: 'Pending',
    sblcTerminationDate: '',
    terminationCurrency: 'USD',
    terminationState: 'PENDING',
    dms: [
      {
        docType: 'D01',
        docTypeDesc: 'SBLC Bank',
        docDate: '',
        fileName: '',
        dmsCode: '',
        uploaded: false
      },
      {
        docType: 'D02',
        docTypeDesc: 'SBLC - SWIFT Confirmation Issuance',
        docDate: '',
        fileName: '',
        dmsCode: '',
        uploaded: false
      },
      {
        docType: 'D03',
        docTypeDesc: 'SBLC - SWIFT Confirmation Termination',
        docDate: '',
        fileName: '',
        dmsCode: '',
        uploaded: false
      }
    ]
  }
]
