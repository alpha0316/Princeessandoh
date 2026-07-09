export type ProjectLinkType = 'web' | 'x' | 'appstore' | 'playstore'

export type ProjectLink = {
  type: ProjectLinkType
  url: string
}

export type Project = {
  id: string
  name: string
  description: string
  /** Optional app icon/logo, shown next to the name in the hover overlay. */
  logo?: string
  /** Screenshots shown in the card, cycled while hovered. Indicator dots for
   * up to 7 images; beyond that the indicator becomes a swipeable strip. */
  images: string[]
  links: ProjectLink[]
  platform: 'mobile' | 'web'
}
