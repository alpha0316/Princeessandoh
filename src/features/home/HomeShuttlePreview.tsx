import { PhoneMockupFrame } from '../shuttle/components/PhoneMockupFrame'
import { getShuttleScreen } from '../shuttle/screens'

const PREVIEW_STEPS = [0, 1, 2]

export default function HomeShuttlePreview() {
  return (
    <div className="project-screens">
      {PREVIEW_STEPS.map((step) => {
        const Screen = getShuttleScreen(step)

        return (
          <PhoneMockupFrame key={step} width={280}>
            <Screen />
          </PhoneMockupFrame>
        )
      })}
    </div>
  )
}
