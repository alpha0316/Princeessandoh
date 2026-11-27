import type { Project } from '../types/project'

// Screenshots live in public/v2 - SVG/<App>/<Screen>.svg — encodeURI handles
// the spaces in those folder/file names.
const asset = (path: string) => `/v2-svg/${path}`

// Logos and links are still TODO — add `logo` (path to an icon) and entries
// in `links` ({ type: 'web' | 'x' | 'appstore' | 'playstore' | 'custom', url,
// label, icon? }) per app once they're ready. `custom` needs its own `icon`.
export const projects: Project[] = [
  {
    id: 'uzeka',
    name: 'Uzeka',
    description: 'Discover events around you and find your next ticket in seconds.',
    logo: asset('Uzeka/Other Product Logos/uzeka main logo.svg'),
    images: [
      asset('Uzeka/Onboarding.webp'),
      asset('Uzeka/Vendor.webp'),
      asset('Uzeka/Web App.webp'),
    ],
    links: [
      { type: 'web', url: 'https://web-v2.uzeka.app/', label: 'Website' },
      { type: 'appstore', url: 'https://apps.apple.com/gh/app/uzeka/id1611958098', label: 'App Store' },
    ],
    platform: 'mobile',
    demoVideo: '/videos/uzeka.mp4',
    demoPoster: '/videos/uzeka-poster.webp',
  },
  {
    id: 'gears',
    name: 'Gears',
    description: 'Find trusted mechanics, detailers, auto shops, and fuel stations near you.',
    // App icon from gears.live.
    logo: asset('Gears/Gears Logo.png'),
    images: [
      asset('Gears/Home.webp'),
      asset('Gears/Bookmarks.webp'),
      asset('Gears/Business Details.webp'),
    ],
    links: [
      { type: 'web', url: 'https://www.gears.live/', label: 'Website' },
    ],
    platform: 'mobile',
    demoVideo: '/videos/gears.mp4',
    demoPoster: '/videos/gears-poster.webp',
  },
  {
    id: 'gas-app',
    name: 'GasApp',
    description: 'Your hassle-free solution for convenient LPG refills.',
    logo: asset('Gas App/Gas App Logo.png'),
    images: [
      asset('Gas App/Onboarding.webp'),
      asset('Gas App/Options.webp'),
      asset('Gas App/Process.webp'),
    ],
    links: [
      { type: 'web', url: 'https://web-app-teal-nine.vercel.app/', label: 'Website' },
    ],
    platform: 'mobile',
    demoVideo: '/videos/gas-app-loop.mp4',
    demoPoster: '/videos/gas-app-loop-poster.webp',
  },
  {
    id: 'giftpal',
    name: 'GiftPal',
    description: 'A beautiful unboxing moment — every gift arrives as a delightful surprise.',
    logo: asset('GiftPal/GiftPal Logo.png'),
    images: [
      asset('GiftPal/Onboarding.webp'),
      asset('GiftPal/Swipe.webp'),
      asset('GiftPal/Add Note.webp'),
      asset('GiftPal/Mobile Home Mockup/Product Page.png'),
    ],
    links: [
      { type: 'web', url: 'https://giftpal.co/', label: 'Website' },
      { type: 'appstore', url: 'https://apps.apple.com/gh/app/mygiftpal/id6821663731', label: 'App Store' },
    ],
    platform: 'mobile',
    demoVideo: '/videos/giftpal-loop.mp4',
    demoPoster: '/videos/giftpal-loop-poster.webp',
  },
  {
    id: 'whole-health-telemedicine',
    name: 'Whole Health Telemedicine',
    description: 'Track medication adherence and stay on top of your care plan.',
    images: [
      asset('Whole Health Telemedicine/Reminder.webp'),
      asset('Whole Health Telemedicine/Your Medication.webp'),
      asset('Whole Health Telemedicine/Submitted.webp'),
    ],
    links: [],
    platform: 'mobile',
    // WholeHealth Pharmacy App walkthrough (part 1; originals in media-src/).
    demoVideo: '/videos/whole-health.mp4',
    demoPoster: '/videos/whole-health-poster.webp',
  },
  {
    id: 'somu',
    name: 'Somu',
    description: 'Digital Groups Saving App',
    logo: asset('Somu/SomuLogo.png'),
    images: [
      asset('Somu/Home.webp'),
      asset('Somu/Group Page.webp'),
      asset('Somu/Pro Plan.webp'),
    ],
    links: [
      { type: 'web', url: '#', label: 'Website' },
      // { type: 'x', url: '#', label: 'X' },
      // { type: 'appstore', url: '#', label: 'App Store' },
    ],
    platform: 'mobile',
    // Two screen recordings joined (originals in media-src/somu-part*.mov).
    demoVideo: '/videos/somu.mp4',
    demoPoster: '/videos/somu-poster.webp',
  },
  {
    id: 'uzeka-vendor',
    name: 'Uzeka Vendor',
    description: 'Sell tickets and products face to face, and track stock and revenue live.',
    logo: asset('Uzeka/Other Product Logos/Vendor 2.svg'),
    images: ['/videos/uzeka-vendor-poster.webp'],
    links: [],
    platform: 'mobile',
    // Original in media-src/uzeka-vendor.mov.
    demoVideo: '/videos/uzeka-vendor.mp4',
    demoPoster: '/videos/uzeka-vendor-poster.webp',
  },
  {
    id: 'gas-app-rider',
    name: 'GasApp Rider',
    description: 'Pick up cylinders, refill at the station, and deliver — with live routes and earnings.',
    logo: asset('Gas App/Gas App Logo.png'),
    images: ['/videos/gas-app-rider-poster.webp'],
    links: [],
    platform: 'mobile',
    // Original in media-src/gas-app-rider.mov.
    demoVideo: '/videos/gas-app-rider.mp4',
    demoPoster: '/videos/gas-app-rider-poster.webp',
  },
  {
    id: 'shuttle-app',
    name: 'Shuttle App',
    description: 'Real-time campus shuttle tracking for Ghanaian universities.',
    logo: asset('Shuttle App/Shuttle App Logo.png'),
    images: [
      asset('Shuttle App/Track.webp'),
      asset('Shuttle App/Grid.webp'),
      asset('Shuttle App/Posts.webp'),
    ],
    links: [],
    platform: 'mobile',
  },
  {
    id: 'somu-web',
    name: 'Somu',
    description: 'Digital Groups Saving App',
    logo: asset('Somu/SomuLogo.png'),
    images: [
      asset('Somu/Web/Home.webp'),
      asset('Somu/Web/Dashboard.webp'),
      asset('Somu/Web/Explore.webp'),
    ],
    links: [
      { type: 'web', url: '#', label: 'Website' },
      // { type: 'x', url: '#', label: 'X' },
      // { type: 'appstore', url: '#', label: 'App Store' },
    ],
    platform: 'web',
    demoVideo: '/videos/somu-web-walkthrough.mp4',
    demoPoster: '/videos/somu-web-walkthrough-poster.webp',
    demoVideoFirst: true,
  },
  {
    id: 'gas-app-admin',
    name: 'Gas App Admin',
    description: 'An operations dashboard for managing gas orders, customers, riders, and filling stations.',
    logo: asset('Gas App/Gas App Logo.png'),
    images: ['/videos/gas-app-admin-poster.webp'],
    links: [],
    platform: 'web',
    demoVideo: '/videos/gas-app-admin.mp4',
    demoPoster: '/videos/gas-app-admin-poster.webp',
  },
  {
    id: 'alpha-beverage',
    name: 'ALPHA Beverage Co.',
    description: 'A digital storefront for ALPHA Hibiscus Sobolo, brewed in Kumasi.',
    // Site icon from alpha-bev.vercel.app.
    logo: asset('Alpha Beverage/Alpha Logo.svg'),
    images: ['/videos/alpha-beverage-poster.webp'],
    links: [{ type: 'web', url: 'https://alpha-bev.vercel.app/', label: 'Website' }],
    platform: 'web',
    demoVideo: '/videos/alpha-beverage.mp4',
    demoPoster: '/videos/alpha-beverage-poster.webp',
  },
  {
    id: 'doryne',
    name: 'Doryne',
    description: 'On-demand errand delivery built for students.',
    logo: asset('Doryne/Doryne Logo.png'),
    // Video only for now; screenshots (public/v2-svg/Doryne/*.webp) left out.
    images: ['/videos/doryne-poster.webp'],
    links: [],
    platform: 'web',
    demoVideo: '/videos/doryne.mp4',
    demoPoster: '/videos/doryne-poster.webp',
  },
  {
    id: 'nnib',
    name: 'NNIB',
    description: 'Operational dashboard for policies, claims, and underwriting.',
    // Video only for now; screenshots (public/v2-svg/NNIB/*.webp) left out.
    images: ['/videos/nnib-poster.webp'],
    links: [],
    platform: 'web',
    demoVideo: '/videos/nnib.mp4',
    demoPoster: '/videos/nnib-poster.webp',
  },
  {
    id: 'uwata',
    name: 'Uwata',
    description: 'AI-assisted invoicing — start from scratch, a screenshot, or a voice note.',
    // Video only for now; screenshots (public/v2-svg/Uwata/*.webp) left out.
    images: ['/videos/uwata-poster.webp'],
    links: [],
    platform: 'web',
    demoVideo: '/videos/uwata.mp4',
    demoPoster: '/videos/uwata-poster.webp',
  },
]
