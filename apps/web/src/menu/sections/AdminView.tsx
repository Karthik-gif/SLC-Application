import { SectionStub } from './SectionStub.tsx'

export function AdminView() {
  return (
    <SectionStub
      title="Admin"
      sub="Users, roles and system configuration."
      detail="User and role administration, the application registry in config/apps.json, and the
        SAP service registry in config/services.json will be managed here. All three are edited
        by hand at the moment."
    />
  )
}
