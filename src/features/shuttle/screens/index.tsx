import ArrivedScreen from './ArrivedScreen'
import ArrivingScreen from './ArrivingScreen'
import DropoffScreen from './DropoffScreen'
import HomeShowcaseFrame from './HomeShowcaseFrame'
import SelectionToggleScreen from './SelectionToggleScreen'
import SearchScreen from './SearchScreen'
import TrackingScreen from './TrackingScreen'
import SplashScreen from './SplashScreen'
import SelectionBirdViewScreen from './SelectionBirdViewScreen'
import RouteShowcaseScreen from './RouteShowcaseScreen'

const screens = [
  HomeShowcaseFrame,         // 0 — home (5s) → widget-tap → tracking view (loops)
  SelectionBirdViewScreen,   // 1 — bird's-eye KNUST map + static selection card
  RouteShowcaseScreen,       // 2 — route selection showcase, cycling stops
  SearchScreen,         // 3
  SelectionToggleScreen,// 4
  DropoffScreen,        // 5
  TrackingScreen,       // 6
  ArrivingScreen,       // 7
  ArrivedScreen,        // 8
]

export function getShuttleScreen(step: number) {
  return screens[Math.max(0, Math.min(step, screens.length - 1))]
}

export {
  SplashScreen,
  SearchScreen,
  DropoffScreen,
  TrackingScreen,
  ArrivingScreen,
  ArrivedScreen,
}
