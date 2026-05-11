import { useEffect, useState } from 'react'
import GasAppLockScreen from './GasLockScreen'
import GasAppIOSHomeScreen from './GasIOSHomeScreen'
import GasAppSplashScreen from './SplashScreen'
import GasAppOnboardingScreen from './OnboardingScreen'
import GasAppOrderIdScreen from './OrderIdScreen'

type Step = 'lockscreen' | 'ioshome' | 'splash' | 'onboarding' | 'orderid'

const TIMINGS: Record<Step, number> = {
  lockscreen: 7000,
  ioshome: 3200,
  splash: 3500,
  onboarding: 4000,
  orderid: 3500,
}

const NEXT: Record<Step, Step> = {
  lockscreen: 'ioshome',
  ioshome: 'splash',
  splash: 'onboarding',
  onboarding: 'orderid',
  orderid: 'lockscreen',
}

export default function GasOnboardingCycler() {
  const [step, setStep] = useState<Step>('lockscreen')

  useEffect(() => {
    const timer = window.setTimeout(() => setStep(NEXT[step]), TIMINGS[step])
    return () => window.clearTimeout(timer)
  }, [step])

  return (
    <>
      {step === 'lockscreen' && <GasAppLockScreen />}
      {step === 'ioshome' && <GasAppIOSHomeScreen />}
      {step === 'splash' && <GasAppSplashScreen />}
      {step === 'onboarding' && <GasAppOnboardingScreen />}
      {step === 'orderid' && <GasAppOrderIdScreen />}
    </>
  )
}
