import { CheckCircle, MapPin, Package, GasPump } from '@phosphor-icons/react'
import riderAvatar from '../../assets/rider-home-avatar.png'
import MobileStatusBar from './MobileStatusBar'
import { Cylinder } from './gasShared'
import './rider-home-preview.css'

const recentOrders = [
  { name: 'Adjoa Amponsah', detail: 'Santasi · Small', time: 'Today, 8:12am', status: 'complete' },
  { name: 'Kweku Barimah', detail: 'Bantama · Small', time: 'Today, 7:40am', status: 'complete' },
  { name: 'Adjoa Amponsah', detail: 'Santasi · Small', time: 'Cancelled', status: 'cancelled' },
]

export default function RiderHomePreview() {
  return (
    <div className="rider-home-phone" aria-label="Rider home screen preview">
      <MobileStatusBar />
      <div className="rider-home-greeting">
        <img className="rider-home-avatar" src={riderAvatar} alt="" />
        <div><strong>Hello Chris 👋</strong><span>Today&apos;s Bookings</span></div>
      </div>

      <h2 className="rider-home-section-title rider-home-new-title">New Order!</h2>
      <section className="rider-home-order" aria-label="New delivery request">
        <div className="rider-home-customer">
          <div><strong>Essandoh Prince Takyi</strong><span>055 414 4611</span></div>
          <b>+ ₵ 10</b>
        </div>
        <div className="rider-home-order-details">
          <div className="rider-home-order-meta"><span><Package size={12} weight="fill" /> Order</span><span><Package size={11} weight="fill" /> <b>1</b> cylinder</span></div>
          <div className="rider-home-order-line">
            <i><GasPump size={14} weight="fill" /></i>
            <div><small>FILLING STATION</small><strong>Total - Osu</strong></div>
            <span className="rider-home-view-location">View Location</span>
          </div>
          <div className="rider-home-order-line">
            <i><MapPin size={14} weight="fill" /></i>
            <div><small>DELIVER TO</small><strong>Ashaade Quaye St · Adum</strong></div>
          </div>
          <div className="rider-home-cylinder-line">
            <i><Cylinder color="#ffc632" shade="#d9a217" /></i>
            <span>Small Size</span><strong>₵ 120</strong>
          </div>
          <div className="rider-home-actions" aria-hidden="true"><span>Decline</span><span>Accept</span></div>
        </div>
      </section>

      <h2 className="rider-home-section-title rider-home-recent-title">Recent Orders</h2>
      <div className="rider-home-recent-list">
        {recentOrders.map((order, index) => (
          <article className="rider-home-recent-row" key={`${order.name}-${index}`}>
            <i className={`rider-home-order-status is-${order.status}`} aria-hidden="true">
              {order.status === 'complete' ? <CheckCircle size={14} weight="fill" /> : <span>×</span>}
            </i>
            <div className="rider-home-recent-copy"><strong>{order.name}</strong><span>{order.detail}</span></div>
            <div className="rider-home-recent-total"><strong>₵ 220</strong><span>{order.time}</span></div>
          </article>
        ))}
      </div>
      <div className="rider-home-indicator" aria-hidden="true" />
    </div>
  )
}
