import { useState, useEffect } from 'react'
import avatarImg from '../../assets/image 1.png'
import Navbar from '../../components/Navbar'

type SnapsPageProps = {
  onNavigate: (id: string) => void
}

type SnapItem = {
  title: string
  image: string
  alt: string
}

const snaps: SnapItem[] = [
  {
    title: 'Event Poster Exploration',
    image: new URL('../../assets/Work/IMG_1120.PNG', import.meta.url).href,
    alt: 'Full-length event poster design',
  },
  {
    title: 'Fashion Storyboard',
    image: new URL('../../assets/Work/IMG_0759.jpg', import.meta.url).href,
    alt: 'Editorial fashion design composition',
  },
  {
    title: 'Brand Direction',
    image: new URL('../../assets/Work/IMG_0639.jpg', import.meta.url).href,
    alt: 'Brand direction layout with graphic details',
  },
  {
    title: 'Visual Moodboard',
    image: new URL('../../assets/Work/IMG_0831.jpg', import.meta.url).href,
    alt: 'Moodboard-style design collage',
  },
  {
    title: 'Campaign Concept',
    image: new URL('../../assets/Work/IMG_1030.jpg', import.meta.url).href,
    alt: 'Campaign concept layout in portrait format',
  },
  {
    title: 'Product Highlight',
    image: new URL('../../assets/Work/IMG_1104.jpg', import.meta.url).href,
    alt: 'Polished product presentation design',
  },
  {
    title: 'Creative Still',
    image: new URL('../../assets/Work/IMG_0638.jpg', import.meta.url).href,
    alt: 'Creative still frame from a recent project',
  },
  {
    title: 'Design Snapshot',
    image: new URL('../../assets/Work/IMG_0569.jpg', import.meta.url).href,
    alt: 'Recent design snapshot in portrait format',
  },
  {
    title: 'Editorial Spread',
    image: new URL('../../assets/Work/IMG_0814.JPG', import.meta.url).href,
    alt: 'Editorial spread-style visual design',
  },
  {
    title: 'Typography Study',
    image: new URL('../../assets/Work/IMG_0058.jpg', import.meta.url).href,
    alt: 'Typography and layout study',
  },
  {
    title: 'Layout Exploration',
    image: new URL('../../assets/Work/IMG_0061.jpg', import.meta.url).href,
    alt: 'Layout and composition exploration',
  },
  {
    title: 'Identity System',
    image: new URL('../../assets/Work/IMG_0263.JPG', import.meta.url).href,
    alt: 'Brand identity system design',
  },
  {
    title: 'Design Preview',
    image: new URL('../../assets/Work/IMG_0325.JPG', import.meta.url).href,
    alt: 'Project design preview',
  },
  {
    title: 'Digital Illustration',
    image: new URL('../../assets/Work/IMG_0562.jpg', import.meta.url).href,
    alt: 'Digital illustration work',
  },
  {
    title: 'Interface Detail',
    image: new URL('../../assets/Work/IMG_0636.jpg', import.meta.url).href,
    alt: 'UI interface detail shot',
  },
  {
    title: 'Motion Graphic',
    image: new URL('../../assets/Work/IMG_0758.jpg', import.meta.url).href,
    alt: 'Motion graphic still frame',
  },
  {
    title: 'Color Study',
    image: new URL('../../assets/Work/IMG_0832.jpg', import.meta.url).href,
    alt: 'Color palette and visual study',
  },
  {
    title: 'Visual System',
    image: new URL('../../assets/Work/IMG_0833.jpg', import.meta.url).href,
    alt: 'Visual design system exploration',
  },
  {
    title: 'Brand Exploration',
    image: new URL('../../assets/Work/IMG_0869.jpg', import.meta.url).href,
    alt: 'Brand exploration and identity concept',
  },
  {
    title: 'Product Design',
    image: new URL('../../assets/Work/IMG_0978.jpg', import.meta.url).href,
    alt: 'Product design layout',
  },
  {
    title: 'Campaign Visual',
    image: new URL('../../assets/Work/IMG_1032.jpg', import.meta.url).href,
    alt: 'Campaign visual concept',
  },
  {
    title: 'Creative Direction',
    image: new URL('../../assets/Work/IMG_1038.jpg', import.meta.url).href,
    alt: 'Creative direction visual',
  },
  {
    title: 'Digital Artwork',
    image: new URL('../../assets/Work/IMG_1153.PNG', import.meta.url).href,
    alt: 'Digital artwork composition',
  },
  {
    title: 'Recent Work',
    image: new URL('../../assets/Work/Image 05-04-2026 at 2.58 PM.PNG', import.meta.url).href,
    alt: 'Recent design work',
  },
  {
    title: 'Design Sprint',
    image: new URL('../../assets/Work/Image 06-03-2026 at 6.22 PM.PNG', import.meta.url).href,
    alt: 'Design sprint output',
  },
  {
    title: 'Project Study',
    image: new URL('../../assets/Work/Image 06-03-2026 at 9.40 PM.PNG', import.meta.url).href,
    alt: 'In-depth project study visual',
  },
  {
    title: 'Wireframe Detail',
    image: new URL('../../assets/Work/Image 07-03-2026 at 10.11 PM.PNG', import.meta.url).href,
    alt: 'Wireframe and layout detail',
  },
  {
    title: 'Design System',
    image: new URL('../../assets/Work/Image 10-12-2025 at 8.04 PM.JPG', import.meta.url).href,
    alt: 'Design system components',
  },
  {
    title: 'Sketch Exploration',
    image: new URL('../../assets/Work/Image 13-03-2026 at 2.38 AM.PNG', import.meta.url).href,
    alt: 'Sketch and concept exploration',
  },
  {
    title: 'Visual Treatment',
    image: new URL('../../assets/Work/Image 14-03-2026 at 3.39 PM.PNG', import.meta.url).href,
    alt: 'Visual treatment concept',
  },
  {
    title: 'Interface Study',
    image: new URL('../../assets/Work/Image 16-01-2026 at 10.20 PM.JPG', import.meta.url).href,
    alt: 'Interface design study',
  },
  {
    title: 'Flow Design',
    image: new URL('../../assets/Work/Image 16-01-2026 at 10.45 AM.JPG', import.meta.url).href,
    alt: 'User flow design layout',
  },
  {
    title: 'Component Detail',
    image: new URL('../../assets/Work/Image 16-03-2026 at 4.57 PM.PNG', import.meta.url).href,
    alt: 'UI component detail view',
  },
  {
    title: 'Screen Concept',
    image: new URL('../../assets/Work/Image 18-01-2026 at 10.27 AM.PNG', import.meta.url).href,
    alt: 'Screen design concept',
  },
  {
    title: 'UI Exploration',
    image: new URL('../../assets/Work/Screenshot 2025-12-12 at 12.39.21 PM.PNG', import.meta.url).href,
    alt: 'UI design exploration',
  },
]

const socialLinks = [
  {
    id: 'x',
    label: 'X',
    href: 'https://x.com/pr_alphaa',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.766l7.73-8.835L1.254 2.25H8.08l4.259 5.632 5.905-5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    id: 'behance',
    label: 'Behance',
    href: 'https://www.behance.net/princeessandoh1',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 20 20" fill="none">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M6.6665 4.16666C7.34359 4.16662 8.00464 4.37278 8.56167 4.75769C9.11871 5.14261 9.54532 5.68804 9.78472 6.32139C10.0241 6.95474 10.065 7.64598 9.90185 8.30312C9.73871 8.96027 9.37932 9.55215 8.8715 10C9.37932 10.4478 9.73871 11.0397 9.90185 11.6969C10.065 12.354 10.0241 13.0453 9.78472 13.6786C9.54532 14.312 9.11871 14.8574 8.56167 15.2423C8.00464 15.6272 7.34359 15.8334 6.6665 15.8333H3.33317C2.89114 15.8333 2.46722 15.6577 2.15466 15.3452C1.8421 15.0326 1.6665 14.6087 1.6665 14.1667V5.83333C1.6665 5.3913 1.8421 4.96738 2.15466 4.65482C2.46722 4.34226 2.89114 4.16666 3.33317 4.16666H6.6665ZM14.5832 7.5C16.7557 7.5 18.3332 9.47333 18.3332 11.6667C18.3331 11.8708 18.2582 12.0678 18.1226 12.2203C17.9869 12.3728 17.8 12.4703 17.5973 12.4942L17.4998 12.5H12.6165C12.9148 13.52 13.744 14.1667 14.5832 14.1667C15.4832 14.1667 15.9932 13.7408 16.4498 13.2083C16.5935 13.0404 16.798 12.9363 17.0184 12.9191C17.2387 12.902 17.4569 12.973 17.6248 13.1167C17.7928 13.2603 17.8968 13.4648 17.914 13.6852C17.9312 13.9055 17.8602 14.1237 17.7165 14.2917L17.6273 14.3933L17.4365 14.5983C16.8348 15.2167 15.9548 15.8333 14.5832 15.8333C12.4107 15.8333 10.8332 13.86 10.8332 11.6667C10.8332 9.47333 12.4107 7.5 14.5832 7.5ZM6.6665 10.8333H3.33317V14.1667H6.6665C7.09899 14.1686 7.51529 14.0023 7.82746 13.703C8.13964 13.4037 8.32323 12.9947 8.33946 12.5625C8.35568 12.1304 8.20327 11.7088 7.91443 11.3869C7.62558 11.065 7.22292 10.868 6.7915 10.8375L6.6665 10.8333ZM14.5832 9.16666C13.744 9.16666 12.9148 9.81333 12.6165 10.8333H16.5498C16.2515 9.81333 15.4223 9.16666 14.5832 9.16666ZM6.6665 5.83333H3.33317V9.16666H6.6665C7.10853 9.16666 7.53245 8.99107 7.84501 8.67851C8.15758 8.36595 8.33317 7.94203 8.33317 7.5C8.33317 7.05797 8.15758 6.63405 7.84501 6.32149C7.53245 6.00893 7.10853 5.83333 6.6665 5.83333ZM15.8332 5C16.0542 5 16.2661 5.0878 16.4224 5.24408C16.5787 5.40036 16.6665 5.61232 16.6665 5.83333C16.6665 6.05434 16.5787 6.26631 16.4224 6.42259C16.2661 6.57887 16.0542 6.66666 15.8332 6.66666H13.3332C13.1122 6.66666 12.9002 6.57887 12.7439 6.42259C12.5876 6.26631 12.4998 6.05434 12.4998 5.83333C12.4998 5.61232 12.5876 5.40036 12.7439 5.24408C12.9002 5.0878 13.1122 5 13.3332 5H15.8332Z" fill="black" />
      </svg>
    ),
  },
  {
    id: 'pinterest',
    label: 'Pinterest',
    href: 'https://pin.it/40FtwCncU',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
      </svg>
    ),
  },
]

export default function SnapsPage({ onNavigate }: SnapsPageProps) {
  const [lightbox, setLightbox] = useState<SnapItem | null>(null)

  useEffect(() => {
    if (!lightbox) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setLightbox(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox])

  return (
    <div className="snaps-page">
      <Navbar activePage="snaps" onNavigate={onNavigate} />

      <main className="snaps-shell">
        <header className="snaps-hero">
          <img className="snaps-avatar" src={avatarImg} alt="Essandoh Prince Takyi" />
          <h1 className="name">My Recent Designs</h1>
          <div className="snaps-socials" aria-label="Design social links">
            {socialLinks.map((link) => (
              <a
                key={link.id}
                className="snaps-social"
                href={link.href}
                target="_blank"
                rel="noreferrer"
                aria-label={link.label}
                title={link.label}
              >
                {link.icon}
              </a>
            ))}
          </div>
        </header>

        <section className="snaps-grid" aria-label="Recent design gallery">
          {snaps.map((item) => (
            <article
              key={item.title}
              className="snaps-card"
              onClick={() => setLightbox(item)}
              role="button"
              tabIndex={0}
              aria-label={`View ${item.title} full size`}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setLightbox(item) }}
            >
              <img className="snaps-card__image" src={item.image} alt={item.alt} loading="lazy" />
              <div className="snaps-card__overlay">
                <p className="snaps-card__title">{item.title}</p>
              </div>
            </article>
          ))}
        </section>
      </main>

      {lightbox && (
        <div className="snaps-lightbox" onClick={() => setLightbox(null)} role="dialog" aria-modal="true" aria-label={lightbox.title}>
          <button className="snaps-lightbox__close" onClick={() => setLightbox(null)} aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
          <img
            className="snaps-lightbox__img"
            src={lightbox.image}
            alt={lightbox.alt}
            onClick={(e) => e.stopPropagation()}
          />
          <p className="snaps-lightbox__title">{lightbox.title}</p>
        </div>
      )}
    </div>
  )
}
