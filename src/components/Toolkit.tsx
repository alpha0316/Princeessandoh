import type { ReactNode } from 'react'
import { Code, OpenAiLogo } from '@phosphor-icons/react'
import { BRAND_ICONS, type BrandIcon } from './brandIcons'

function Brand({ icon }: { icon: BrandIcon }) {
  return (
    <svg viewBox="0 0 24 24" className="toolkit-icon" aria-hidden="true" style={{ color: icon.color }}>
      <path d={icon.path} fill="currentColor" />
    </svg>
  )
}

/** A tool name with its mark, set inline in the sentence. */
function Tool({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <span className="toolkit-tool">
      {icon}
      {children}
    </span>
  )
}

// OpenAI and Microsoft marks aren't in Simple Icons, so Codex uses
// Phosphor's OpenAI logo and VS Code a generic code glyph.
export default function Toolkit() {
  return (
    <p className="toolkit">
      As a <mark style={{
        color:'black'
      }}>design engineer</mark>, I go from <Tool icon={<Brand icon={BRAND_ICONS.figma} />}>Figma</Tool> to{' '}
      <Tool icon={<Brand icon={BRAND_ICONS.react} />}>React</Tool>, React Native &amp;{' '}
      <Tool icon={<Brand icon={BRAND_ICONS.typescript} />}>TypeScript</Tool>, add motion with{' '}
      <Tool icon={<Brand icon={BRAND_ICONS.three} />}>Three.js</Tool>, and pair with{' '}
      <Tool icon={<Brand icon={BRAND_ICONS.claude} />}>Claude</Tool> &amp;{' '}
      <Tool icon={<OpenAiLogo className="toolkit-icon" weight="fill" />}>Codex</Tool> in{' '}
      <Tool icon={<Code className="toolkit-icon" weight="bold" style={{ color: '#2F80ED' }} />}>VS Code</Tool>.
    </p>
  )
}
