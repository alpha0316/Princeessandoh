export type ProjectLinkType = 'web' | 'x' | 'appstore' | 'playstore' | 'custom'

export type ProjectLink = {
  type: ProjectLinkType
  url: string
  label: string
  /** Required when type is 'custom' — path to the link's own icon (e.g. a
   * group/community icon that isn't one of the built-in platform icons). */
  icon?: string
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
  /** Muted, looping screen recording of the app in use (Mobbin-style).
   * When set it replaces the screenshot slider on the card; `images[0]`
   * doubles as its poster frame while it loads. */
  demoVideo?: string
  /** First frame of `demoVideo` (small WebP) shown until it starts playing. */
  demoPoster?: string
  /** Play the recording as the first item before continuing through images[1…]. */
  demoVideoFirst?: boolean
  /** CSS object-position for web screenshots (which crop with object-fit:
   * cover) — e.g. 'top left' to preserve a sidebar instead of the default
   * top-center crop. Ignored for mobile phone frames (object-fit: contain). */
  imagePosition?: string
  /** Bullet points shown in the desktop detail overlay's sidebar panel. */
  features?: string[]
}
