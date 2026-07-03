import { useState } from 'react'
import avatarImg from '../../assets/image 1.png'

const FONT = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'

type AboutModalProps = {
  open: boolean
  onClose: () => void
}

const socialLinks = [
  {
    id: 'twitter',
    href: 'https://x.com/pr_alphaa',
    tooltip: 'Check out my Twitter',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.766l7.73-8.835L1.254 2.25H8.08l4.259 5.632 5.905-5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    id: 'pinterest',
    href: 'https://pin.it/40FtwCncU',
    tooltip: 'Check out my Pinterest',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
      </svg>
    ),
  },
  {
    id: 'behance',
    href: 'https://www.behance.net/princeessandoh1',
    tooltip: 'View my Behance',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22 7h-7V5h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14H15.97c.13 3.211 3.483 3.312 4.588 2.029h3.168zm-7.686-4h4.965c-.105-1.547-1.136-2.219-2.477-2.219-1.466 0-2.277.768-2.488 2.219zm-9.574 6.988H0V5.021h6.953c5.476.081 5.58 5.444 2.72 6.906 3.461 1.26 3.577 8.061-3.207 8.061zM3 11h3.584c2.508 0 2.906-3-.312-3H3v3zm3.391 3H3v3.016h3.341c3.055 0 2.868-3.016.05-3.016z" />
      </svg>
    ),
  },
]

export default function AboutModal({ open, onClose }: AboutModalProps) {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null)

  if (!open) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(17,24,39,0.55)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: FONT,
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{
        background: '#fff',
        borderRadius: 24,
        boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
        width: '90%',
        maxWidth: 720,
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '36px 40px 40px 40px',
        position: 'relative',
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 18,
            right: 18,
            background: 'rgba(0,0,0,0.04)',
            border: 'none',
            borderRadius: '50%',
            width: 32,
            height: 32,
            fontSize: 20,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            lineHeight: 1,
          }}
          aria-label="Close"
        >×</button>

        {/* Profile + social links */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 28 }}>
          <img
            src={avatarImg}
            alt="Prince Essandoh"
            style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', marginBottom: 10 }}
          />
          <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 3 }}>Essandoh Prince Takyi</div>
          <div style={{ color: '#888', fontSize: 13, marginBottom: 14 }}>4 Years into Product, Design And Engineering</div>
          <div style={{ display: 'flex', gap: 10 }}>
            {socialLinks.map((link) => (
              <div key={link.id} style={{ position: 'relative' }}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() => setActiveTooltip(link.id)}
                  onMouseLeave={() => setActiveTooltip(null)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: '#f3f4f6',
                    color: '#111',
                    textDecoration: 'none',
                    transition: 'background 0.15s',
                  }}
                  onMouseOver={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = '#e5e7eb' }}
                  onMouseOut={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = '#f3f4f6' }}
                >
                  {link.icon}
                </a>
                {activeTooltip === link.id && (
                  <div style={{
                    position: 'absolute',
                    bottom: 'calc(100% + 8px)',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: '#111',
                    color: '#fff',
                    fontSize: 12,
                    padding: '5px 10px',
                    borderRadius: 6,
                    whiteSpace: 'nowrap',
                    pointerEvents: 'none',
                    zIndex: 10,
                  }}>
                    {link.tooltip}
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: 0,
                      height: 0,
                      borderLeft: '5px solid transparent',
                      borderRight: '5px solid transparent',
                      borderTop: '5px solid #111',
                    }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid #f0f0f0', marginBottom: 24 }} />

        {/* CV header — two columns */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, gap: 16 }}>
          <div>
            <h2 style={{ fontWeight: 700, fontSize: 22, marginBottom: 2, letterSpacing: '-0.01em' }}>ESSANDOH PRINCE TAKYI</h2>
            <div style={{ color: '#34A853', fontWeight: 600, fontSize: 14 }}>UIUX Designer</div>
          </div>
          <div style={{ textAlign: 'right', color: '#374151', fontSize: 13, flexShrink: 0 }}>
            <div>Email: <a href="mailto:princeessandoh316@gmail.com" style={{ color: '#2563eb', textDecoration: 'underline' }}>Princeessandoh316@gmail.com</a></div>
            <div>Phone: 0559488201 / 0200910403</div>
          </div>
        </div>

        <div style={{ color: '#111', fontSize: 14, marginBottom: 20, lineHeight: 1.65 }}>
          I am a Talented UIUX Designer with <strong>4 year experience</strong> in crafting problem solving and aesthetic products. Exploring the intersection of form and function, I bring a distinctive perspective to every project, ensuring a harmonious fusion of aesthetics and usability that resonates with users on a profound level.
        </div>

        <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 10, color: '#555', textTransform: 'uppercase', letterSpacing: '0.06em' }}>UIUX Design Work Experience</div>
        <ul style={{ paddingLeft: 0, marginBottom: 20, listStyle: 'none' }}>
          {[
            {
              title: 'UIUX Designer, Uzeka',
              location: 'Angola',
              period: 'August 2024 – Present',
              bullets: [
                'Led the end-to-end design of Uzeka, their scanner and vendor app together with operations dashboard, defining event-based workflows, real-time activity tracking, and role-based navigation for organizers and agents.',
                'Led end-to-end product design for a multi-platform event ecosystem — 49K+ tickets sold, 50K+ active users, and 583 events, across consumer, vendor, and scanner applications.',
              ],
            },
            {
              title: 'UIUX Designer, Doryne',
              location: '',
              period: 'Jan 2026 – Present',
              bullets: [
                'Designing functional interface with my business partner for vendors, riders and consumer. An all in one ecosystem where vendors or restaurant owners upload orders to the app, update their stocks, monitor their finances and assign orders to their riders.',
                'Creating multiple more revenue options for riders and couriers in the process. We currently have about 5 vendors with over 10 riders on KNUST campus with almost 500 users.',
              ],
            },
            {
              title: 'UIUX Designer, TastyPad',
              location: 'India',
              period: 'April 2025 – May 2026',
              bullets: [
                'Designed a social-driven food platform integrating restaurants, recipes, articles, meal, fitness plans and user activity into a unified experience.',
                'Integrated gamification elements such as progress bars, achievement badges, and reward-based milestones, driving user interaction and maintaining plan engagement.',
              ],
            },
            {
              title: 'UIUX Designer, NEXA LABS — WholeHealth, Citadel',
              location: '',
              period: 'August 2024 – June 2025',
              bullets: [
                'Designed a comprehensive digital health platform integrating insurance, diagnostics, and telemedicine. Designed user and admin experiences including claims processing, payment lifecycle, and personalized health journeys.',
                'Designed the end-to-end medication tracking experience, including adherence logging, refill flows, and prescription-linked behaviors, turning complex healthcare logic into a simple and intuitive user journey.',
                'Led end-to-end product design for Citadel, architecting a scalable, event-driven ERP platform across CRM, HR, Wiki, and Fleet modules, aligning UX, system logic, and cross-module data flows into a unified operational system.',
              ],
            },
            {
              title: 'UIUX Designer & Developer, Shuttle App',
              location: 'Personal Project',
              period: 'Jan 2024 – Present',
              bullets: [
                'Led end-to-end product design for the Shuttle App, defining core system architecture, user flows, and real-time tracking experiences across rider and student interfaces.',
                'We have successfully onboarded 6 shuttles to our platform and looking forward to launching soon.',
              ],
            },
            {
              title: 'Product Designer & Developer, Gas App',
              location: 'Personal Project',
              period: 'Sept 2024 – Present',
              bullets: [
                'Designed an intuitive booking system with a clear, step-by-step interface that allows users to easily select and confirm their bookings.',
                'Implemented booking forms and confirmation screens using React Native, ensuring data validation and clear error messaging.',
              ],
            },
            {
              title: 'UIUX Designer, Dine QR',
              location: '',
              period: 'Sept 2023 – Jan 2024',
              bullets: [
                'Designed visually appealing and user-friendly interfaces for a food ordering app and a digital inventory management system for restaurants.',
                'Collaborated with cross-functional teams, including developers, to ensure designs met both design and technical requirements.',
              ],
            },
            {
              title: 'UIUX Designer, Bismuth',
              location: 'USA',
              period: 'June 2023 – Jan 2024',
              bullets: [
                'As the UIUX Designer on Cocycle, I led the end-to-end user experience, translating a complex sustainability and donation ecosystem into a clear, intuitive interface.',
                'My work focused on simplifying data visualization, improving trust through transparency, and creating an engaging experience that motivates consistent, sustainable giving.',
              ],
            },
          ].map((job) => (
            <li key={job.title} style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>
                {job.title}{job.location ? `, ${job.location}.` : '.'}
                <span style={{ fontWeight: 400, color: '#888', fontSize: 13, marginLeft: 8 }}>{job.period}</span>
              </div>
              <ul style={{ margin: '4px 0 0 0', paddingLeft: 18, color: '#444', fontSize: 13, lineHeight: 1.6 }}>
                {job.bullets.map((b, i) => <li key={i}>{b}</li>)}
              </ul>
            </li>
          ))}
        </ul>

        <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 6, color: '#555', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Education</div>
        <div style={{ color: '#444', fontSize: 14, marginBottom: 20, lineHeight: 1.65 }}>
          BsC. Computer Science, Kwame Nkrumah University of Science and Technology.
        </div>

        <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 6, color: '#555', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Skills</div>
        <div style={{ color: '#444', fontSize: 14, lineHeight: 1.65 }}>
          Figma, UIUX Design, Product Design, React, React Native, HTML, CSS, Tailwind, Graphic Design, Illustration, Animation, Prototyping, Motion Design, Front End Development, Design Engineering, Communication, Leadership, Reliable
        </div>
      </div>
    </div>
  )
}
