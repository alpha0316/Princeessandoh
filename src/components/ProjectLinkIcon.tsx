import { AppleLogo, GooglePlayLogo, Globe } from '@phosphor-icons/react'
import { XIcon } from './SocialIcons'
import type { ProjectLinkType } from '../types/project'

export default function ProjectLinkIcon({ type, size = 13 }: { type: ProjectLinkType; size?: number }) {
  switch (type) {
    case 'web':
      return <Globe size={size} weight="bold" />
    case 'x':
      return <XIcon size={size} />
    case 'appstore':
      return <AppleLogo size={size} weight="fill" />
    case 'playstore':
      return <GooglePlayLogo size={size} weight="fill" />
  }
}
