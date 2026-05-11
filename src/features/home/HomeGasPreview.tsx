import { PhoneMockupFrame } from '../shuttle/components/PhoneMockupFrame'
import {
  GasAppTrackingScreen,
  GasHomeFlowSimulation,
  GasOnboardingCycler,
} from '../gas-app/screens'

const previews = [
  GasOnboardingCycler,
  GasHomeFlowSimulation,
  GasAppTrackingScreen,
]

export default function HomeGasPreview() {
  return (
    <div className="project-screens">
      {previews.map((Screen, index) => (
        <PhoneMockupFrame key={index} width={280}>
          <Screen />
        </PhoneMockupFrame>
      ))}
    </div>
  )
}
