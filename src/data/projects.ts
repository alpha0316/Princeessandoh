import type { Project } from '../types/project'

// Screenshots live in public/v2 - SVG/<App>/<Screen>.svg — encodeURI handles
// the spaces in those folder/file names.
const asset = (path: string) => `/v2-svg/${path}`

// Logos and links are still TODO — add `logo` (path to an icon) and entries
// in `links` ({ type: 'web' | 'x' | 'appstore' | 'playstore' | 'custom', url,
// label, icon? }) per app once they're ready. `custom` needs its own `icon`.
export const projects: Project[] = [
  {
    id: 'somu',
    name: 'Somu',
    description: 'Digital Groups Saving App',
    images: [
      asset('Somu/Home.png'),
      asset('Somu/Group Page.svg'),
      asset('Somu/Pro Plan.png'),
    ],
    links: [
      { type: 'web', url: '#', label: 'Website' },
      { type: 'x', url: '#', label: 'X' },
      { type: 'appstore', url: '#', label: 'App Store' },
    ],
    platform: 'mobile',
  },
  {
    id: 'giftpal',
    name: 'GiftPal',
    description: 'A beautiful unboxing moment — every gift arrives as a delightful surprise.',
    images: [
      asset('GiftPal/Onboarding.png'),
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
      asset('Uzeka/Web App.svg'),
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
  {
    id: 'somu-web',
    name: 'Somu',
    description: 'Digital Groups Saving App',
    images: [
      asset('Somu/Web/Home.svg'),
      asset('Somu/Web/Dashboard.svg'),
      asset('Somu/Web/Explore.svg'),
    ],
    links: [
      { type: 'web', url: '#', label: 'Website' },
      { type: 'x', url: '#', label: 'X' },
      { type: 'appstore', url: '#', label: 'App Store' },
    ],
    platform: 'web',
  },
  {
    id: 'doryne',
    name: 'Doryne',
    description: 'On-demand errand delivery built for students.',
    images: [
      asset('Doryne/Landing Page.svg'),
      asset('Doryne/Map.svg'),
      asset('Doryne/Orders.svg'),
    ],
    links: [],
    platform: 'web',
  },
  {
    id: 'nnib',
    name: 'NNIB',
    description: 'Operational dashboard for policies, claims, and underwriting.',
    images: [
      asset('NNIB/IMG_1579.jpg'),
      asset('NNIB/IMG_1597.jpg'),
      asset('NNIB/IMG_1598.jpg'),
    ],
    links: [],
    platform: 'web',
  },
  {
    id: 'uwata',
    name: 'Uwata',
    description: 'AI-assisted invoicing — start from scratch, a screenshot, or a voice note.',
    images: [
      asset('Uwata/Auth.svg'),
      asset('Uwata/Start From Scratch.svg'),
      asset('Uwata/Type Invoice.svg'),
    ],
    links: [],
    platform: 'web',
    imagePosition: 'top left',
  },
]
