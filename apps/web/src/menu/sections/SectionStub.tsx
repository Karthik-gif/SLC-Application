/** A section that exists in the navigation but has nothing behind it yet. Says so plainly
 * rather than rendering a half-working screen. */
export function SectionStub({ title, sub, detail }: { title: string; sub: string; detail: string }) {
  return (
    <>
      <div className="hub-title">{title}</div>
      <div className="hub-sub">{sub}</div>
      <div className="mp-stub">{detail}</div>
    </>
  )
}
