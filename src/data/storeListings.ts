import type { ProjectLink } from '../types/project'

/** An app's App Store / Play Store listing artwork, shown in the
 * Screenshots tab. Screenshots are the store preview images in listing
 * order (portrait, 2484×5376 sources resized to 720px wide WebP). */
export type StoreListing = {
  id: string
  name: string
  category: string
  logo: string
  screenshots: { src: string; alt: string }[]
  links: ProjectLink[]
}

const store = (path: string) => `/v2-svg/${path}`

export const storeListings: StoreListing[] = [
  {
    id: 'giftpal',
    name: 'GiftPal',
    category: 'Entertainment',
    logo: store('GiftPal/GiftPal Logo.png'),
    screenshots: [
      { src: store('GiftPal/Store/01-make-someone-feel-loved.webp'), alt: 'Make someone feel loved today' },
      { src: store('GiftPal/Store/02-find-the-perfect-gift.webp'), alt: 'Find the perfect gift — home feed' },
      { src: store('GiftPal/Store/03-your-gift-your-way.webp'), alt: 'Your gift, your way — send, group or spree' },
      { src: store('GiftPal/Store/04-curate-with-care.webp'), alt: 'Curate with care — product page' },
      { src: store('GiftPal/Store/05-review-your-gift.webp'), alt: 'Review your gift before paying' },
    ],
    links: [
      { type: 'appstore', url: 'https://apps.apple.com/gh/app/mygiftpal/id6821663731', label: 'App Store' },
    ],
  },
]
