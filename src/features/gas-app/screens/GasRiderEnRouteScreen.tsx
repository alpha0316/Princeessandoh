import GasAppTrackingScreen from './GasTrackingScreen'
import type { TimelineStep } from './GasTrackingScreen'

const EN_ROUTE_STEPS: TimelineStep[] = [
  {
    icon: 'scooter',
    title: 'Rider is on the way to collect your cylinder',
    subtitle: 'En route · ~8 min away',
    subtitleTone: 'muted',
    progress: 0.45,
    iconStyle: 'solid',
  },
  {
    icon: 'pump',
    title: 'Filling Process',
    subtitle: 'Pending',
    subtitleTone: 'muted',
    iconStyle: 'ghost',
  },
  {
    icon: 'check',
    title: 'Refill Completed',
    subtitle: 'Pending',
    subtitleTone: 'muted',
    iconStyle: 'ghost',
  },
]

export default function GasRiderEnRouteScreen() {
  return (
    <GasAppTrackingScreen
      steps={EN_ROUTE_STEPS}
      headerSubtitle="Your rider has been assigned and is heading your way"
    />
  )
}
