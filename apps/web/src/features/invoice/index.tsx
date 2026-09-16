import { AppPlaceholder } from '../AppPlaceholder.tsx'

/**
 * Amend BLs & Finalise Invoices
 *
 * To convert from legacy/Invoice.html (legacy port 8769).
 * Replace AppPlaceholder with the real screens; the route and shell already exist.
 */
export default function InvoiceApp() {
  return (
    <AppPlaceholder
      title={"Amend BLs & Finalise Invoices"}
      subtitle={"no backend configured"}
      legacyFile={"legacy/Invoice.html"}
      services={[]}
      note={"Legacy page reads a global FTI_DEALS that nothing defines, falling back to DUMMY.deals. Its SAP contract is undefined."}
    />
  )
}
