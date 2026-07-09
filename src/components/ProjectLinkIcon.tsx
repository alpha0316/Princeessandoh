import { AppleLogo, GooglePlayLogo, Globe } from '@phosphor-icons/react'
import { XIcon } from './SocialIcons'
import type { ProjectLink } from '../types/project'

export default function ProjectLinkIcon({ link, size = 24 }: { link: ProjectLink; size?: number }) {
  switch (link.type) {
    case 'web':
      return <Globe size={size * 0.7} weight="bold" />
    case 'x':
      return <XIcon size={size * 0.6} />
    case 'appstore':
      return <AppleLogo size={size * 0.7} weight="fill" />
    case 'playstore':
      return <GooglePlayLogo size={size * 0.7} weight="fill" />
    case 'custom':
      return <img src={link.icon} alt="" className="app-card-link-icon" />
  }
}
