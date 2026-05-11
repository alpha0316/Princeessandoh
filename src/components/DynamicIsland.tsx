import '../styles/app.css'

type DynamicIslandProps = {
  status?: string
}

export default function DynamicIsland({
  status = 'Available',
}: DynamicIslandProps) {
  return (
    <div className="dynamic-island-outer">
      <div className="dynamic-island" aria-live="polite">
        <span className="dynamic-icon" aria-hidden="true" />
        <span className="dynamic-text">{status}</span>
        <span className="dynamic-wave" aria-hidden="true" />
      </div>
    </div>
  )
}
