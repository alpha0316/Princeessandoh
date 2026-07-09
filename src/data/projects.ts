import type { Project } from '../types/project'

// Screenshots live in public/v2 - SVG/<App>/<Screen>.svg — encodeURI handles
// the spaces in those folder/file names.
const asset = (path: string) => encodeURI(`/v2 - SVG/${path}`)

// Logos and links are still TODO — add `logo` (path to an icon) and entries
// in `links` ({ type: 'web' | 'x' | 'appstore' | 'playstore', url }) per app
// once they're ready.
export const projects: Project[] = [
  {
    id: 'somu',
    name: 'Somu',
    description: 'Digital Groups Saving App',
    images: [
      asset('Somu/Home.svg'),
      asset('Somu/Group Page.svg'),
      asset('Somu/Pro Plan.svg'),
    ],
    links: [
      { type: 'web', url: '#' },
      { type: 'x', url: '#' },
      { type: 'appstore', url: '#' },
    ],
    platform: 'mobile',
  },
  {
    id: 'giftpal',
    name: 'GiftPal',
    description: 'A beautiful unboxing moment — every gift arrives as a delightful surprise.',
    images: [
      asset('GiftPal/Onboarding.svg'),
      asset('GiftPal/Swipe.svg'),
      asset('GiftPal/Add Note.svg'),
    ],
    links: [],
    platform: 'mobile',
  },
  {
    id: 'uzeka',
    name: 'Uzeka',
    description: 'Discover events around you and find your next ticket in seconds.',
    images: [
      asset('Uzeka/Onboarding.svg'),
      asset('Uzeka/Vendor.svg'),
    ],
    links: [],
    platform: 'mobile',
  },
  {
    id: 'whole-health-telemedicine',
    name: 'Whole Health Telemedicine',
    description: 'Track medication adherence and stay on top of your care plan.',
    images: [
      asset('Whole Health Telemedicine/Reminder.svg'),
      asset('Whole Health Telemedicine/Your Medication.svg'),
      asset('Whole Health Telemedicine/Submitted.svg'),
    ],
    links: [],
    platform: 'mobile',
  },
  {
    id: 'shuttle-app',
    name: 'Shuttle App',
    description: 'Real-time campus shuttle tracking for Ghanaian universities.',
    images: [
      asset('Shuttle App/Track.svg'),
      asset('Shuttle App/Grid.svg'),
      asset('Shuttle App/Posts.svg'),
    ],
    links: [],
    platform: 'mobile',
  },
  {
    id: 'gas-app',
    name: 'GasApp',
    description: 'Your hassle-free solution for convenient LPG refills.',
    images: [
      asset('Gas App/Onboarding.svg'),
      asset('Gas App/Options.svg'),
      asset('Gas App/Process.svg'),
    ],
    links: [],
    platform: 'mobile',
  },
]
