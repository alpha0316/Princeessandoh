import { PhoneMockupFrame } from '../shuttle/components/PhoneMockupFrame'

// Gas + Scale are wide; phone peeks at the right edge and is reachable via horizontal scroll
const GAP = 24
const W_GAS   = 440
const W_SCALE = 440
const W_PHONE = 274 // CARD_H=572 × (FRAME_W=227/FRAME_H=474)

const CARD_H = 572

function IframeCard({ src, width, title }: { src: string; width: number; title: string }) {
  return (
    <div style={{
      width,
      height: CARD_H,
      borderRadius: 24,
      flexShrink: 0,
      overflow: 'hidden',
      position: 'relative',
    }}>
      <iframe
        src={src}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
        title={title}
      />
    </div>
  )
}

export default function GasSensorPreview() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: GAP,
      padding: '20px 24px',
      height: 612,
    }}>
      <IframeCard src="/gas-sensor-3d.html" width={W_GAS} title="3D Gas Cylinder" />
      <IframeCard src="/gas-sensor-scale.html" width={W_SCALE} title="Sensor Device Scale" />
      <PhoneMockupFrame width={W_PHONE}>
        <iframe
          src="/gas-sensor-app.html"
          style={{ width: '100%', height: '100%', border: 'none' }}
          title="Gas Monitor App"
        />
      </PhoneMockupFrame>
    </div>
  )
}
