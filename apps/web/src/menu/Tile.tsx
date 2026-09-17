/** The hub's tile. Markup mirrors renderProgramTile() / renderFolderTile() in
 * legacy/Menu Path.html element for element — menu-path.css is that page's own stylesheet,
 * so changing the structure changes the appearance. */

export const FOLDER_SVG =
  'M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z'

export function Tile({ icon, title, desc, tag, folder, onClick }: {
  icon: string
  title: string
  desc: string
  tag: string
  folder?: boolean
  onClick: () => void
}) {
  return (
    <div className={folder ? 'tile folder' : 'tile'} onClick={onClick}>
      <div className="tile-icon">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d={icon} />
        </svg>
      </div>
      <div className="tile-title">{title}</div>
      <div className="tile-desc">{desc}</div>
      <div className="tile-foot">
        <span className="tile-tag">{tag}</span>
        <span className="tile-arrow">&#8594;</span>
      </div>
    </div>
  )
}
