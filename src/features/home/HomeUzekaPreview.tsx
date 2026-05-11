import { PhoneMockupFrame } from '../shuttle/components/PhoneMockupFrame'
import { UzekaHomeScreen } from '../uzeka/UzekaHomeScreen'
import { UzekaMergeScreen } from '../uzeka/UzekaMergeScreen'
import { UzekaOnboardingScreen } from '../uzeka/UzekaOnboardingScreen'

const previews = [
  UzekaOnboardingScreen,
  UzekaMergeScreen,
  UzekaHomeScreen,
]

export default function HomeUzekaPreview() {
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
