import { AppPlaceholder } from '../AppPlaceholder.tsx'

/**
 * Manage Trade Flows
 *
 * To convert from legacy/Manage TF.html (legacy port 8770).
 * Replace AppPlaceholder with the real screens; the route and shell already exist.
 */
export default function TfManageApp() {
  return (
    <AppPlaceholder
      title={"Manage Trade Flows"}
      subtitle={"no backend configured"}
      legacyFile={"legacy/Manage TF.html"}
      services={[]}
      note={"Legacy page runs on DUMMY_MASTER_DATA and has never called an API. Its SAP contract is undefined."}
    />
  )
}
