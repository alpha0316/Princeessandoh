import { ArrowUpRight, EnvelopeSimple } from '@phosphor-icons/react'
import RollText from './RollText'

const EMAIL = 'princeessandoh316@gmail.com'
const X_URL = 'https://x.com/pr_alphaa'
const WHATSAPP_URL = 'https://wa.me/233559488201'
const RESUME_URL = 'https://drive.google.com/file/d/1aTIGguRDnC9lnXEBEI5HI_DI1Qth4cdi/view?usp=drivesdk'

/** "Get in touch" paragraph. Hovering (or focusing) the email reveals a
 * small contact card above the paragraph; on touch, tapping it just opens
 * the mail app. */
export default function SidebarContact() {
  return (
    <p className="profile-contact">
      Open to <mark style={{
        color : 'black'
      }}>new roles and freelance projects</mark>. Send a mail to{' '}
      {/* The wrapper anchors the card right on top of the email address. */}
      <span className="profile-email-wrap">
        <a className="profile-email" href={`mailto:${EMAIL}`}>
          <RollText>{EMAIL}</RollText>
        </a>
        <a className="email-card" href={`mailto:${EMAIL}`} aria-hidden="true" tabIndex={-1}>
          <span className="email-card-head">
            <img className="email-card-avatar" src="/avatar.png" alt="" />
            <span className="email-card-who">
              <strong>Essandoh Prince Takyi</strong>
              <span>Product Designer &amp; Engineer</span>
            </span>
          </span>
          <span className="email-card-row">
            <EnvelopeSimple size={16} />
            <span className="email-card-address">{EMAIL}</span>
            <ArrowUpRight size={14} className="email-card-arrow" />
          </span>
        </a>
      </span>
      . You can also find me on{' '}
      <a href={X_URL} target="_blank" rel="noopener noreferrer">
        <RollText>X (Twitter)</RollText>
      </a> or {' '}
      <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
        <RollText>WhatsApp</RollText>
      </a>. Have a look at my{' '}
      <a href={RESUME_URL} target="_blank" rel="noopener noreferrer">
        <RollText>resume</RollText>
      </a> too.
    </p>
  )
}
