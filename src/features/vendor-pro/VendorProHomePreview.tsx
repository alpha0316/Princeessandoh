import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import CursorIcon from '../../components/icons/CursorIcon'
import homeVend from '../../assets/Vendor Pro/HomeVend.mp4'
import orderHistory from '../../assets/Vendor Pro/OrderHistory.svg'
import vendorProLogoSrc from '../../assets/App Logos/Vendor Pro.svg'

const ORANGE = '#F97316'
const FONT = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
const SCREEN_PAD_X = 46
const HOME_BOTTOM_OFFSET = 36
const DESKTOP_FRAME_W = 793
const DESKTOP_FRAME_H = 585  // matches phone mockup rendered height: 474 × (280/227) ≈ 585px

// ── SVG icons (from the actual app code) ──────────────────────────────────────

function ImageSvg() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 16 16" fill="none">
      <path d="M14.4534 11.3067L12.3668 6.43334C11.6601 4.78 10.3601 4.71334 9.48678 6.28667L8.22678 8.56C7.58678 9.71334 6.39345 9.81334 5.56678 8.78L5.42011 8.59334C4.56011 7.51334 3.34678 7.64667 2.72678 8.88L1.58011 11.18C0.773447 12.78 1.94011 14.6667 3.72678 14.6667H12.2334C13.9668 14.6667 15.1334 12.9 14.4534 11.3067Z" stroke="black" strokeOpacity="0.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4.64648 5.33337C5.75105 5.33337 6.64648 4.43794 6.64648 3.33337C6.64648 2.2288 5.75105 1.33337 4.64648 1.33337C3.54191 1.33337 2.64648 2.2288 2.64648 3.33337C2.64648 4.43794 3.54191 5.33337 4.64648 5.33337Z" stroke="black" strokeOpacity="0.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CopySvg() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 16 16" fill="none">
      <path d="M10.6668 8.60004V11.4C10.6668 13.7334 9.7335 14.6667 7.40016 14.6667H4.60016C2.26683 14.6667 1.3335 13.7334 1.3335 11.4V8.60004C1.3335 6.26671 2.26683 5.33337 4.60016 5.33337H7.40016C9.7335 5.33337 10.6668 6.26671 10.6668 8.60004Z" stroke="black" strokeOpacity="0.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14.6668 4.60004V7.40004C14.6668 9.73337 13.7335 10.6667 11.4002 10.6667H10.6668V8.60004C10.6668 6.26671 9.7335 5.33337 7.40016 5.33337H5.3335V4.60004C5.3335 2.26671 6.26683 1.33337 8.60016 1.33337H11.4002C13.7335 1.33337 14.6668 2.26671 14.6668 4.60004Z" stroke="black" strokeOpacity="0.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function EditSvg() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 16 16" fill="none">
      <path d="M8.84006 2.39994L3.36673 8.19327C3.16006 8.41327 2.96006 8.84661 2.92006 9.14661L2.6734 11.3066C2.58673 12.0866 3.14673 12.6199 3.92006 12.4866L6.06673 12.1199C6.36673 12.0666 6.78673 11.8466 6.9934 11.6199L12.4667 5.82661C13.4134 4.82661 13.8401 3.68661 12.3667 2.29327C10.9001 0.913274 9.78673 1.39994 8.84006 2.39994Z" stroke="black" strokeOpacity="0.6" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.92676 3.3667C8.21342 5.2067 9.70676 6.61337 11.5601 6.80003" stroke="black" strokeOpacity="0.6" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 14.6666H14" stroke="black" strokeOpacity="0.6" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ── Shared UI pieces ───────────────────────────────────────────────────────────

function AppHeader({ initials = 'R' }: { initials?: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: `24px ${SCREEN_PAD_X}px 0`, flexShrink: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <span style={{ fontSize: 15 }}>🍴</span>
        <span style={{ color: '#DC2626', fontWeight: 700, fontSize: 18, fontFamily: FONT }}>B</span>
        <span style={{ color: 'rgba(0,0,0,0.4)', fontWeight: 700, fontSize: 18, fontFamily: FONT }}>ites.</span>
      </div>
      <div style={{ minWidth: 34, height: 34, padding: '0 9px', background: '#FB923C', borderRadius: 999, color: '#fff', fontSize: 12, fontWeight: 600, fontFamily: FONT, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
        {initials}🍴
      </div>
    </div>
  )
}

function BottomNav({ active }: { active: 'home' | 'orders' | 'riders' | 'analytics' }) {
  const items: Array<{ id: typeof active; label: string; icon: (a: boolean) => ReactNode }> = [
    {
      id: 'home', label: 'Home',
      icon: (a) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M3 10.5L12 3L21 10.5V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V10.5Z" stroke={a ? '#fff' : 'rgba(255,255,255,0.5)'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill={a ? 'rgba(255,255,255,0.15)' : 'none'} />
          <path d="M9 21V14H15V21" stroke={a ? '#fff' : 'rgba(255,255,255,0.5)'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      id: 'orders', label: 'Orders',
      icon: (a) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 17 17" fill="none">
          <path d="M14.6897 7.74048L14.0363 10.5271C13.4763 12.9338 12.3697 13.9071 10.2897 13.7071C9.95634 13.6805 9.59634 13.6205 9.20967 13.5271L8.08967 13.2605C5.30967 12.6005 4.44967 11.2271 5.10301 8.44048L5.75634 5.64715C5.88967 5.08048 6.04967 4.58715 6.24967 4.18048C7.02967 2.56715 8.35634 2.13382 10.583 2.66048L11.6963 2.92048C14.4897 3.57382 15.343 4.95382 14.6897 7.74048Z" stroke={a ? '#fff' : 'rgba(255,255,255,0.5)'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M10.2896 13.7072C9.87628 13.9872 9.35628 14.2205 8.72295 14.4272L7.66962 14.7739C5.02295 15.6272 3.62962 14.9139 2.76962 12.2672L1.91628 9.63388C1.06295 6.98721 1.76962 5.58721 4.41628 4.73388L5.46962 4.38721C5.74295 4.30054 6.00295 4.22721 6.24962 4.18054C6.04962 4.58721 5.88962 5.08054 5.75628 5.64721L5.10295 8.44054C4.44962 11.2272 5.30962 12.6005 8.08962 13.2605L9.20962 13.5272C9.59628 13.6205 9.95628 13.6805 10.2896 13.7072Z" stroke={a ? '#fff' : 'rgba(255,255,255,0.5)'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8.67627 6.46716L11.9096 7.28716" stroke={a ? '#fff' : 'rgba(255,255,255,0.5)'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8.02295 9.04724L9.95628 9.54058" stroke={a ? '#fff' : 'rgba(255,255,255,0.5)'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      id: 'riders', label: 'Riders',
      icon: (a) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 18 18" fill="none">
          <g clipPath="url(#riders_clip)">
            <path d="M3.64889 3.08925C3.80003 3.07602 3.9537 3.09766 4.08185 3.18406C4.10499 3.20573 4.12749 3.22808 4.14954 3.25085C4.16287 3.26453 4.17621 3.2782 4.18995 3.29228C4.2043 3.30704 4.21865 3.32179 4.23343 3.33698C4.27212 3.37605 4.31087 3.41506 4.34964 3.45406C4.39008 3.49481 4.43032 3.53573 4.47018 3.57706C4.51628 3.62484 4.56323 3.67173 4.61024 3.71863C4.63133 3.7409 4.63133 3.7409 4.65284 3.76361C4.73124 3.84125 4.73124 3.84125 4.83429 3.87172C4.88487 3.86894 4.93317 3.86241 4.98311 3.85431C5.29611 3.87469 5.51939 4.00902 5.73923 4.21978C5.75447 4.23422 5.7697 4.24867 5.7854 4.26355C5.82268 4.29892 5.85986 4.33439 5.89696 4.36994C5.91722 4.34948 5.91722 4.34948 5.93789 4.32862C5.98792 4.27816 6.03812 4.22787 6.08836 4.17762C6.1101 4.15583 6.1318 4.134 6.15345 4.11212C6.18455 4.08073 6.2158 4.04949 6.24707 4.01827C6.25676 4.00843 6.26645 3.99858 6.27643 3.98843C6.30042 3.96464 6.32565 3.94211 6.35106 3.91983C6.36676 3.9199 6.38246 3.91997 6.39865 3.92004C6.45306 3.87582 6.49525 3.82672 6.5302 3.76595C6.53291 3.7179 6.52682 3.68131 6.51446 3.63496C6.50714 3.59928 6.50714 3.59928 6.53114 3.5518C6.56283 3.51752 6.59484 3.4842 6.62779 3.45119C6.6375 3.44143 6.6472 3.43168 6.6572 3.42163C6.6778 3.40098 6.69844 3.38037 6.71911 3.3598C6.75039 3.32856 6.7814 3.29709 6.81242 3.26559C6.83252 3.24551 6.85264 3.22544 6.87278 3.20539C6.8819 3.19606 6.89102 3.18673 6.90041 3.17712C7.02047 3.05906 7.15162 3.01279 7.31879 3.00798C7.3749 3.01497 7.4032 3.02539 7.4502 3.05541C7.4784 3.10043 7.47759 3.13274 7.47026 3.1847C7.45208 3.25645 7.42058 3.32255 7.38849 3.38902C7.40045 3.38666 7.41241 3.38431 7.42473 3.38188C7.44101 3.37921 7.4573 3.37653 7.47408 3.37378C7.48996 3.37095 7.50585 3.36812 7.52222 3.36521C7.67536 3.36751 7.76655 3.44792 7.87095 3.55313C7.87864 3.56114 7.88632 3.56914 7.89424 3.57739C7.91779 3.60184 7.94175 3.62581 7.9658 3.64976C8.04489 3.73059 8.1049 3.79447 8.13577 3.90391C8.16029 3.97461 8.194 4.01608 8.24698 4.06858C8.26269 4.08426 8.27839 4.09995 8.29457 4.11611C8.30297 4.12438 8.31137 4.13266 8.32002 4.14119C8.34655 4.16734 8.37292 4.19363 8.39926 4.21997C8.46477 4.28543 8.53054 4.35063 8.5963 4.41583C8.6518 4.47087 8.7072 4.52601 8.76247 4.58129C8.78818 4.60693 8.81405 4.63242 8.83992 4.65791C9.12847 4.94468 9.12847 4.94468 9.13025 5.13511C9.12539 5.26977 9.08313 5.36664 8.98545 5.4608C8.91052 5.52179 8.82415 5.56506 8.73948 5.61091C8.71974 5.62177 8.70001 5.63265 8.68028 5.64354C8.64123 5.66509 8.60212 5.68653 8.56298 5.70791C8.48958 5.7481 8.41661 5.78902 8.34366 5.83002C8.32197 5.84215 8.30028 5.85428 8.27858 5.8664C8.26389 5.8746 8.24921 5.8828 8.23408 5.89125C8.24413 5.89332 8.25419 5.89539 8.26454 5.89752C8.27803 5.90047 8.29151 5.90341 8.3054 5.90644C8.31864 5.90926 8.33188 5.91208 8.34552 5.91498C8.43727 5.94192 8.49986 5.98607 8.5669 6.05333C8.57472 6.06111 8.58254 6.06889 8.5906 6.0769C8.61661 6.10284 8.64244 6.12894 8.66828 6.15505C8.68696 6.17375 8.70565 6.19244 8.72434 6.21113C8.775 6.2618 8.82549 6.31264 8.87595 6.36351C8.90752 6.39533 8.93912 6.42711 8.97074 6.45888C9.08115 6.56983 9.19144 6.6809 9.30162 6.79209C9.40413 6.89554 9.50691 6.99872 9.60981 7.10178C9.6983 7.19043 9.7866 7.27925 9.87475 7.36822C9.92734 7.42129 9.98 7.47428 10.0329 7.52709C10.0826 7.57681 10.1321 7.62675 10.1814 7.67687C10.1995 7.69515 10.2177 7.71335 10.2359 7.73146C10.3506 7.84549 10.4468 7.95322 10.468 8.11919C10.4671 8.13271 10.4662 8.14623 10.4653 8.16017C10.4642 8.1811 10.4642 8.1811 10.4632 8.20245C10.4623 8.21254 10.4614 8.22263 10.4605 8.23302C10.4755 8.21851 10.4755 8.21851 10.4908 8.2037C10.5285 8.16736 10.5664 8.13124 10.6045 8.09524C10.6287 8.07217 10.6528 8.04885 10.6768 8.02553C10.8155 7.89483 10.9574 7.80965 11.1524 7.80776C11.2895 7.82294 11.3997 7.8601 11.4985 7.95949C11.5123 7.97327 11.5261 7.98705 11.5403 8.00125C11.5627 8.02396 11.5627 8.02396 11.5856 8.04714C11.6018 8.0634 11.618 8.07964 11.6342 8.09588C11.6787 8.14046 11.723 8.18519 11.7673 8.22995C11.8152 8.27822 11.8632 8.32635 11.9111 8.37451C12.005 8.46885 12.0988 8.56332 12.1925 8.65784C12.2687 8.73468 12.3449 8.81148 12.4212 8.88825C12.6374 9.10596 12.8535 9.32377 13.0695 9.5417C13.0811 9.55345 13.0928 9.56519 13.1047 9.5773C13.1164 9.58906 13.1281 9.60082 13.1401 9.61294C13.329 9.80354 13.5181 9.99391 13.7074 10.1842C13.9018 10.3796 14.0959 10.5751 14.2899 10.7709C14.3988 10.8808 14.5078 10.9906 14.617 11.1002C14.7099 11.1936 14.8027 11.2871 14.8953 11.3808C14.9425 11.4286 14.9898 11.4763 15.0373 11.5238C15.0808 11.5673 15.1241 11.6111 15.1672 11.655C15.1902 11.6783 15.2134 11.7013 15.2366 11.7244C15.3722 11.8634 15.4169 11.9885 15.4163 12.1811C15.4122 12.4093 15.2532 12.5466 15.1026 12.6961C15.0799 12.7189 15.0572 12.7418 15.0345 12.7647C14.9752 12.8245 14.9156 12.8841 14.856 12.9436C14.795 13.0045 14.7343 13.0656 14.6735 13.1268C14.5546 13.2464 14.4354 13.3658 14.316 13.485C14.3241 13.4927 14.3323 13.5005 14.3408 13.5085C14.3784 13.5445 14.4157 13.5808 14.453 13.6172C14.4658 13.6294 14.4787 13.6416 14.4919 13.6541C14.6163 13.7765 14.6935 13.9082 14.6965 14.0858C14.6829 14.3114 14.5576 14.4457 14.3981 14.5913C14.2733 14.7006 14.1526 14.7149 13.9893 14.709C13.8686 14.6983 13.78 14.6475 13.6963 14.5614C13.6751 14.5398 13.6751 14.5398 13.6535 14.5178C13.639 14.5028 13.6245 14.4878 13.6096 14.4724C13.5948 14.4572 13.58 14.442 13.5647 14.4264C13.5283 14.389 13.4919 14.3516 13.4557 14.314C13.4429 14.3269 13.4301 14.3398 13.4169 14.3531C13.2958 14.475 13.1745 14.5967 13.053 14.7181C12.9905 14.7805 12.9281 14.843 12.866 14.9057C12.8059 14.9663 12.7456 15.0266 12.6851 15.0868C12.6621 15.1098 12.6393 15.1328 12.6165 15.1559C12.4475 15.3271 12.3182 15.4365 12.0672 15.4419C11.9336 15.4325 11.8132 15.3846 11.7189 15.2898C11.7053 15.2761 11.6917 15.2625 11.6776 15.2484C11.6626 15.2333 11.6477 15.2182 11.6322 15.2026C11.6162 15.1865 11.6001 15.1704 11.584 15.1543C11.5398 15.1099 11.4956 15.0654 11.4515 15.0209C11.4039 14.973 11.3562 14.9252 11.3086 14.8773C11.1934 14.7616 11.0784 14.6458 10.9634 14.53C10.9093 14.4755 10.8551 14.4209 10.8009 14.3664C10.6209 14.1852 10.4408 14.0039 10.2609 13.8225C10.2142 13.7754 10.1675 13.7284 10.1207 13.6813C10.1091 13.6696 10.0975 13.6579 10.0856 13.6458C9.89755 13.4563 9.70933 13.2671 9.52102 13.0779C9.32769 12.8836 9.13454 12.6892 8.94157 12.4946C8.83322 12.3853 8.72479 12.2761 8.61616 12.1671C8.52364 12.0743 8.43128 11.9813 8.33913 11.8881C8.29212 11.8406 8.24504 11.7932 8.19775 11.7459C8.15441 11.7026 8.11129 11.6591 8.06834 11.6154C8.0455 11.5922 8.02242 11.5694 7.99933 11.5465C7.87284 11.417 7.80649 11.2887 7.80214 11.106C7.81678 10.9388 7.88657 10.8082 7.99969 10.6884C8.01355 10.6737 8.02742 10.6589 8.04171 10.6437C8.05613 10.6285 8.07056 10.6133 8.08542 10.5976C8.10002 10.5821 8.11463 10.5666 8.12968 10.5506C8.16568 10.5124 8.20173 10.4743 8.23782 10.4362C8.22701 10.4362 8.2162 10.4363 8.20506 10.4364C8.19011 10.4359 8.17515 10.4355 8.15975 10.4351C8.14526 10.4349 8.13076 10.4347 8.11583 10.4345C7.93436 10.3991 7.81563 10.287 7.69061 10.1594C7.6723 10.141 7.65397 10.1227 7.63562 10.1044C7.58621 10.055 7.53711 10.0053 7.48807 9.95552C7.4365 9.90325 7.38469 9.85121 7.33292 9.79913C7.24605 9.71166 7.15938 9.624 7.07283 9.53622C6.97303 9.43502 6.87289 9.33416 6.77257 9.23347C6.68615 9.14672 6.59992 9.05979 6.51384 8.9727C6.46255 8.92081 6.41121 8.86899 6.3597 8.81734C6.31125 8.76874 6.26305 8.71992 6.21503 8.67092C6.19746 8.65306 6.17981 8.63529 6.16207 8.61761C6.03578 8.49157 5.95815 8.37128 5.90385 8.20101C5.89345 8.21981 5.88305 8.2386 5.87234 8.25796C5.83348 8.32814 5.79446 8.39824 5.7554 8.46832C5.73857 8.49857 5.72177 8.52884 5.70502 8.55914C5.68083 8.60286 5.6565 8.6465 5.63213 8.69013C5.62476 8.70353 5.61738 8.71694 5.60979 8.73075C5.52382 8.88394 5.43386 9.00687 5.26056 9.06075C5.10449 9.07492 4.99645 9.05811 4.86536 8.96978C4.8025 8.91514 4.74371 8.8571 4.68522 8.79785C4.65614 8.76841 4.62684 8.73919 4.59748 8.71002C4.52472 8.63763 4.45233 8.56487 4.37993 8.49212C4.31848 8.4304 4.25688 8.36882 4.1951 8.30744C4.16629 8.2787 4.13771 8.24976 4.10912 8.22081C4.09144 8.20319 4.07374 8.18558 4.05603 8.16798C4.04072 8.15258 4.0254 8.13717 4.00962 8.1213C3.96203 8.08295 3.92941 8.07188 3.86997 8.06116C3.78334 8.0188 3.71869 7.93784 3.65145 7.87058C3.63705 7.85655 3.62266 7.84252 3.60783 7.82807C3.4944 7.71464 3.41093 7.608 3.40488 7.44285C3.41162 7.37829 3.43772 7.33064 3.46892 7.27415C3.44537 7.28713 3.44537 7.28713 3.42135 7.30038C3.4002 7.31157 3.37903 7.32274 3.35786 7.33389C3.34244 7.34248 3.34244 7.34248 3.32671 7.35125C3.24468 7.39379 3.19052 7.39819 3.09963 7.3796C3.04131 7.31255 3.04668 7.23214 3.04558 7.14722C3.07004 6.97806 3.15914 6.88044 3.27862 6.76599C3.30536 6.74035 3.33169 6.71436 3.35799 6.68828C3.5962 6.45447 3.5962 6.45447 3.70975 6.45353C3.72568 6.45777 3.74161 6.46201 3.75803 6.46638C3.77764 6.4704 3.79726 6.47441 3.81746 6.47854C3.85639 6.4486 3.85639 6.4486 3.89288 6.40823C3.90565 6.39493 3.91842 6.38163 3.93158 6.36793C3.94124 6.35752 3.95091 6.34712 3.96086 6.33641C3.95699 6.32461 3.95311 6.31281 3.94912 6.30066C4.10295 6.14036 4.25678 5.98007 4.41527 5.81491C4.37496 5.77523 4.33465 5.73554 4.29311 5.69465C4.0769 5.47771 3.92436 5.2601 3.90752 4.94414C3.90997 4.92769 3.91242 4.91124 3.91494 4.89428C3.93057 4.77997 3.93057 4.77997 3.89648 4.67261C3.85998 4.62889 3.82144 4.59015 3.77991 4.55119C3.7654 4.53658 3.75088 4.52197 3.73593 4.50692C3.68966 4.46052 3.64266 4.41496 3.59551 4.36945C3.54888 4.3237 3.50244 4.27779 3.45624 4.2316C3.42755 4.203 3.3986 4.17465 3.36934 4.14663C3.24 4.01906 3.15329 3.87593 3.13872 3.69182C3.14597 3.39917 3.3581 3.13933 3.64889 3.08925Z" fill={a ? '#fff' : 'rgba(255,255,255,0.5)'}/>
          </g>
          <defs>
            <clipPath id="riders_clip">
              <rect width="7.56309" height="17.2295" fill="white" transform="translate(0.249634 5.32422) rotate(-44.7472)"/>
            </clipPath>
          </defs>
        </svg>
      ),
    },
    {
      id: 'analytics', label: 'Analytics',
      icon: (a) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 16" fill="none">
          <path d="M14.6663 14.6667H1.33301C1.05967 14.6667 0.833008 14.44 0.833008 14.1667C0.833008 13.8934 1.05967 13.6667 1.33301 13.6667H14.6663C14.9397 13.6667 15.1663 13.8934 15.1663 14.1667C15.1663 14.44 14.9397 14.6667 14.6663 14.6667Z" fill={a ? '#fff' : 'rgba(255,255,255,0.5)'}/>
          <path d="M6.5 2.66665V14.6666H9.5V2.66665C9.5 1.93331 9.2 1.33331 8.3 1.33331H7.7C6.8 1.33331 6.5 1.93331 6.5 2.66665Z" fill={a ? '#fff' : 'rgba(255,255,255,0.5)'}/>
          <path d="M2 6.66665V14.6666H4.66667V6.66665C4.66667 5.93331 4.4 5.33331 3.6 5.33331H3.06667C2.26667 5.33331 2 5.93331 2 6.66665Z" fill={a ? '#fff' : 'rgba(255,255,255,0.5)'}/>
          <path d="M11.333 10V14.6667H13.9997V10C13.9997 9.26669 13.733 8.66669 12.933 8.66669H12.3997C11.5997 8.66669 11.333 9.26669 11.333 10Z" fill={a ? '#fff' : 'rgba(255,255,255,0.5)'}/>
        </svg>
      ),
    },
  ]
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      gap: 1,
      padding: '4px',
      borderRadius: 38,
      background: 'rgba(30, 30, 30, 0.78)',
      backdropFilter: 'blur(28px) saturate(180%)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.28), 0 2px 8px rgba(0,0,0,0.18), inset 0 0 0 0.5px rgba(255,255,255,0.10)',
      width: 'fit-content',
      margin: `0 auto ${HOME_BOTTOM_OFFSET}px`,
      flexShrink: 0,
    }}>
      {items.map(item => {
        const on = item.id === active
        return (
          <div key={item.id} style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            padding: '8px 14px',
            borderRadius: 28,
            background: on ? 'rgba(255,255,255,0.15)' : 'transparent',
            transition: 'background 0.2s ease',
          }}>
            {item.icon(on)}
            <span style={{
              fontSize: 10,
              fontWeight: 500,
              color: on ? '#fff' : 'rgba(255,255,255,0.5)',
              fontFamily: FONT,
              whiteSpace: 'nowrap',
            }}>
              {item.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}

// ── Fanned order cards ─────────────────────────────────────────────────────────

const CARDS = [
  { name: 'Rashida M.🧕🏽', emoji: '🧕🏽', bg: '#16A34A', food: 'Shawarma', price: 'GHC 65', phone: '055 414 4611', loc: 'Hall 7',  top: 46, left: 120, rotate: 0,   z: 3 },
  { name: 'Kwame Freira',   emoji: '',      bg: '#C89C08', food: 'Rice',     price: 'GHC 65', phone: '050 281 3321', loc: 'Tesco',  top: 34, left: 184, rotate: 12,  z: 2 },
  { name: 'Suad M.',        emoji: '',      bg: '#F5C4C8', food: 'Waakye',   price: 'GHC 45', phone: '054 991 8181', loc: 'Hall 3',  top: 18, left: 68,  rotate: -14, z: 1 },
]

function OrderCard({ card }: { card: typeof CARDS[0] }) {
  return (
    <div style={{
      position: 'absolute', top: card.top, left: card.left, zIndex: card.z,
      width: 138,
      padding: '14px 12px',
      background: '#F4F4F4',
      borderRadius: 16,
      outline: '3px solid #fff',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
      transform: `rotate(${card.rotate}deg)`,
    }}>
      <div style={{ width: 50, height: 50, borderRadius: '50%', background: card.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, overflow: 'hidden' }}>
        {card.emoji || null}
      </div>
      <p style={{ margin: 0, fontWeight: 700, fontSize: 12, color: '#000', fontFamily: FONT, textAlign: 'center' }}>{card.name}</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: 'rgba(0,0,0,0.5)', fontFamily: FONT }}>
        <span>{card.food}</span>
        <span>🍴</span>
        <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#D1D5DB' }} />
        <span>{card.price}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, fontFamily: FONT }}>
        <span style={{ color: '#000' }}>{card.phone}</span>
        <div style={{ width: 1, height: 10, background: '#9CA3AF' }} />
        <span style={{ color: 'rgba(0,0,0,0.5)' }}>{card.loc}</span>
      </div>
    </div>
  )
}

function FannedCards() {
  return (
    <div style={{ position: 'relative', width: 360, height: 248, margin: '0 auto', flexShrink: 0 }}>
      {CARDS.map((card, i) => <OrderCard key={i} card={card} />)}
    </div>
  )
}

// ── Screen 1: Home (empty state) ───────────────────────────────────────────────

function HomeContent() {
  return (
    <div style={{ width: '100%', height: '100%', background: '#fff', display: 'flex', flexDirection: 'column' }}>
      <AppHeader initials="R" />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '10px 24px 0' }}>
        <FannedCards />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 9, marginTop: 22, padding: '0 24px' }}>
          <p style={{ margin: 0, fontSize: 31, fontWeight: 500, color: '#000', fontFamily: FONT, textAlign: 'center', letterSpacing: '-0.04em' }}>
          Hiii Akosuaa ✨👩🏽‍🍳
          </p>
          <p style={{ margin: 0, maxWidth: 320, fontSize: 12, color: 'rgba(0,0,0,0.52)', fontFamily: FONT, textAlign: 'center', lineHeight: 1.35 }}>
            You have not uploaded any order for this week yet 💁🏽‍♀️
          </p>
          <div style={{ marginTop: 12, padding: '8px 10px', background: '#FB923C', color: '#fff', borderRadius: 999, fontSize: 13, fontWeight: 700, fontFamily: FONT, display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 10px 26px rgba(249, 115, 22, 0.22)' }}>
            🍴
            <span>Add Orders</span>
          </div>
        </div>
      </div>
      <BottomNav active="home" />
    </div>
  )
}

function HomeScreen() {
  return <HomeContent />
}

// ── Screen 2: Add Orders modal ─────────────────────────────────────────────────

const MODAL_OPTIONS = [
  { icon: <ImageSvg />, title: 'Upload Screenshots',    desc: "Snap or upload your order screenshots — we'll automatically extract and organize the details for you.", key: 'upload' },
  { icon: <CopySvg />,  title: 'Copy And Paste Orders', desc: "Simply paste your order text, and we'll sort everything neatly in seconds.", key: 'copy' },
  { icon: <EditSvg />,  title: 'Type your orders',      desc: 'Prefer manual entry? Add your order details one step at a time, quickly and accurately.', key: 'type' },
]

function ModalScreen() {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* Dimmed home behind */}
      <div style={{ position: 'absolute', inset: 0, filter: 'grayscale(0.05) brightness(0.76)' }}>
        <HomeContent />
      </div>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(24, 24, 27, 0.30)' }} />

      {/* Overlay */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', padding: '0 16px 16px', bottom: '14%' }}>
        <div style={{ background: '#fff', borderRadius: 24, padding: '16px', width: '100%', maxWidth: 400, display: 'flex', flexDirection: 'column', gap: 10, boxShadow: '0 30px 80px rgba(15, 23, 42, 0.18)' }}>
          {MODAL_OPTIONS.map((opt, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '14px', borderRadius: 16, border: '1px solid rgba(0,0,0,0.09)', background: '#fff', cursor: 'pointer' }}>
              <div style={{ flexShrink: 0, marginTop: 2 }}>{opt.icon}</div>
              <div>
                <p style={{ margin: '0 0 4px', fontWeight: 700, fontSize: 14, color: '#111827', fontFamily: FONT }}>{opt.title}</p>
                <p style={{ margin: 0, fontSize: 12, color: 'rgba(0,0,0,0.46)', fontFamily: FONT, lineHeight: 1.42 }}>{opt.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Screen 3: Screenshots Upload + extracted orders ────────────────────────────

const UPLOAD_CARDS = [
  { id: '1', w: 174, h: 136, bubbleW: 150, bubbleH: 108, bubbleAlign: 'right' as const, crop: '0% 0%' },
  { id: '2', w: 174, h: 136, bubbleW: 150, bubbleH: 108, bubbleAlign: 'right' as const, crop: '8% 0%' },
  { id: '3', w: 108, h: 136, bubbleW: 108, bubbleH: 114, bubbleAlign: 'right' as const, crop: '18% 0%' },
  { id: '4', w: 400, h: 136, bubbleW: 152, bubbleH: 108, bubbleAlign: 'right' as const, crop: '0% 0%', received: true },
  { id: '5', w: 174, h: 136, bubbleW: 150, bubbleH: 114, bubbleAlign: 'right' as const, crop: '6% 0%', received: true },
  { id: '6', w: 108, h: 136, bubbleW: 94, bubbleH: 166, bubbleAlign: 'center' as const, crop: '50% 0%' },
  { id: '7', w: 362, h: 136, bubbleW: 150, bubbleH: 114, bubbleAlign: 'right' as const, crop: '0% 0%', received: true },
]

function ScreenshotBubble({
  width,
  height,
  align,
  crop,
}: {
  width: number
  height: number
  align: 'right' | 'center'
  crop: string
}) {
  const messageStyle: CSSProperties = align === 'center'
    ? {
        background: 'linear-gradient(180deg, #57D66A 0%, #39C85A 100%)',
        margin: '0 auto',
      }
    : {
        background: 'linear-gradient(180deg, #4DA2FF 0%, #2F86F3 100%)',
        marginLeft: 'auto',
      }

  return (
    <div style={{
      width,
      height,
      borderRadius: 18,
      overflow: 'hidden',
      background: '#000',
      position: 'relative',
      boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.05)',
    }}>
      <div style={{
        position: 'absolute',
        inset: 0,
        background:
          'linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0)), radial-gradient(circle at 72% 18%, rgba(255,255,255,0.06), transparent 40%)',
      }} />
      <div style={{
        width: Math.min(width - 12, Math.max(68, width * 0.84)),
        height: Math.min(height - 12, Math.max(86, height * 0.84)),
        borderRadius: 18,
        color: '#fff',
        padding: '10px 12px',
        fontSize: 10,
        lineHeight: 1.2,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        ...messageStyle,
        transform: `translate(${crop})`,
      }}>
        {align === 'center' ? (
          <>
            <div>
              <div style={{ fontSize: 8, opacity: 0.95 }}>Hello</div>
              <div style={{ fontSize: 8, opacity: 0.95 }}>I&apos;d like to buy chips</div>
            </div>
            <div style={{ alignSelf: 'flex-end', padding: '3px 8px', borderRadius: 999, background: 'rgba(255,255,255,0.18)', fontSize: 7 }}>Suncity</div>
            <div style={{ fontSize: 7, opacity: 0.95 }}>Your number is busy</div>
            <div style={{ height: 1, background: 'rgba(255,255,255,0.2)' }} />
            <div>
              <div style={{ fontSize: 8, opacity: 0.95 }}>Hello</div>
              <div style={{ fontSize: 8, opacity: 0.95 }}>I&apos;d like to buy chips</div>
              <div style={{ fontSize: 7, opacity: 0.95 }}>Your number is busy</div>
            </div>
          </>
        ) : (
          <>
            <div>
              <div style={{ fontSize: 18, lineHeight: 1.1 }}>Hi</div>
              <div style={{ fontSize: 17, lineHeight: 1.1 }}>Jollof 60 cedis</div>
              <div style={{ fontSize: 15, lineHeight: 1.1 }}>Prince Essandoh</div>
              <div style={{ fontSize: 15, lineHeight: 1.1 }}>Suncity, gaza</div>
              <div style={{ fontSize: 15, lineHeight: 1.1 }}>0559488201</div>
            </div>
            <div style={{
              position: 'absolute',
              right: -7,
              bottom: 0,
              width: 16,
              height: 16,
              borderRadius: '0 0 0 14px',
              background: 'inherit',
            }} />
          </>
        )}
      </div>
    </div>
  )
}

function UploadCard({
  card,
}: {
  card: typeof UPLOAD_CARDS[number]
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <ScreenshotBubble width={card.w} height={card.h} align={card.bubbleAlign} crop={card.crop} />
      {card.received ? (
        <div style={{ width: 100, padding: '6px 12px', borderRadius: 999, background: 'rgba(39, 39, 42, 0.92)', color: '#fff', fontSize: 11, fontFamily: FONT }}>
          Received
        </div>
      ) : null}
    </div>
  )
}

function UploadFlowScreen() {
  return (
    <div style={{ width: '100%', height: '100%', background: '#fff', display: 'flex', flexDirection: 'column' }}>
      <AppHeader initials="R" />

      <div style={{ padding: `22px ${SCREEN_PAD_X + 40}px 14px ${SCREEN_PAD_X + 112}px`, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div style={{ width: 36, height: 36, borderRadius: 999, background: '#F5F5F5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 13L5 8L10 3" stroke="rgba(0,0,0,0.62)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p style={{ margin: 0, fontWeight: 700, fontSize: 18, color: '#000', fontFamily: FONT }}>
            Orders <span style={{ color: 'rgba(0,0,0,0.35)', fontWeight: 500 }}>(7)</span>
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div style={{ width: 22, height: 22, borderRadius: 999, background: '#FFF1E8', color: '#FB923C', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, lineHeight: 1 }}>+</div>
          <div style={{ padding: '14px 18px', background: '#FB923C', color: '#fff', borderRadius: 999, fontSize: 13, fontWeight: 700, fontFamily: FONT, display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 14px 30px rgba(249, 115, 22, 0.22)' }}>
            <span>🍴</span>
            <span>Prepare Order List</span>
          </div>
        </div>
      </div>

      <div style={{
        flex: 1,
        padding: `0 ${SCREEN_PAD_X + 40}px 12px ${SCREEN_PAD_X + 112}px`,
        display: 'grid',
        gridTemplateColumns: '174px 174px 108px 400px',
        gridAutoRows: 'min-content',
        gap: '12px 14px',
        alignContent: 'start',
      }}>
        {UPLOAD_CARDS.map(card => (
          <UploadCard key={card.id} card={card} />
        ))}
      </div>

      <BottomNav active="home" />
    </div>
  )
}

// ── Screen 4: Prepared List ────────────────────────────────────────────────────

const PREPARED_NOTES = [
  { id: '#011', name: 'Prince Essandoh', phone: '0559488201', hall: 'Suncity, gaza', item: 'Jollof Rice', qty: '1', price: 'GHC60.00', color: '#E5F0FF' },
  { id: '#012', name: 'Mike Arthur', phone: '0554144611', hall: 'Hall 7', item: 'Chicken Shawarma', qty: '2', price: 'GHC70.00', color: '#FFF5BF' },
  { id: '#013', name: 'Esi M.', phone: '0248123456', hall: 'Tesco', item: 'Loaded Fries', qty: '1', price: 'GHC65.00', color: '#E8F7CD' },
  { id: '#014', name: 'Suad M.', phone: '0206112234', hall: 'Block C', item: 'Spicy Chicken', qty: '1', price: 'GHC50.00', color: '#FBE6F4' },
]
const ORDER_STATUSES = ['Pending', 'Packaged', 'In Transit', 'Completed', 'Pickup'] as const
const ORDERS_BOARD = [
  { id: '#011', name: 'Essandoh Prince', phone: '055 414 4611', location: 'NYA', item: 'Chicken Shawarma', amount: 'GHC 65', status: 'Pending' as const },
  { id: '#012', name: 'Kwame Boateng', phone: '024 889 1023', location: 'Unity Hall', item: 'Jollof Rice', amount: 'GHC 40', status: 'Packaged' as const },
  { id: '#013', name: 'Akosua Mensah', phone: '020 554 7789', location: 'Ayeduase', item: 'Pizza', amount: 'GHC 90', status: 'In Transit' as const },
  { id: '#014', name: 'Kwabena Osei', phone: '054 123 4567', location: 'Katanga', item: 'Burger', amount: 'GHC 55', status: 'Completed' as const },
  { id: '#015', name: 'Esi Asare', phone: '027 890 1234', location: 'Republic Hall', item: 'Fried Rice', amount: 'GHC 75', status: 'Pickup' as const },
  { id: '#016', name: 'Yaw Boateng', phone: '023 456 7890', location: 'GTUC', item: 'Chicken & Chips', amount: 'GHC 60', status: 'Pending' as const },
]

function PreparedNote({ note }: { note: typeof PREPARED_NOTES[number] }) {
  return (
    <article style={{
      position: 'relative',
      minHeight: 178,
      borderRadius: 22,
      background: note.color,
      boxShadow: '0 10px 26px rgba(15, 23, 42, 0.06), inset 0 1px 0 rgba(255,255,255,0.7)',
      overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', left: 12, bottom: 12, width: 20, height: 20, background: 'rgba(0,0,0,0.12)', clipPath: 'polygon(0 0, 100% 100%, 0 100%)' }} />
      <div style={{ padding: '18px 16px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
          <div>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#000', fontFamily: FONT }}>{note.name}</p>
            <p style={{ margin: '3px 0 0', fontSize: 11, color: 'rgba(0,0,0,0.5)', fontFamily: FONT }}>{note.phone} | {note.hall}</p>
          </div>
          <div style={{ width: 14, height: 14, borderRadius: 4, border: '1.4px solid rgba(249, 115, 22, 0.8)', background: '#fff' }} />
        </div>

        <div style={{ height: 1, background: 'rgba(0,0,0,0.08)' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M8.37 1.17H5.63c-.61 0-1.1.49-1.1 1.09v.55c0 .6.49 1.09 1.1 1.09h2.74c.61 0 1.1-.49 1.1-1.09v-.55c0-.6-.49-1.09-1.1-1.09Z" fill="rgba(0,0,0,0.38)" />
            <path d="M10.06 2.81c0 .93-.76 1.69-1.69 1.69H5.63c-.93 0-1.69-.76-1.69-1.69 0-.33-.35-.53-.64-.38-.82.44-1.37 1.31-1.37 2.3v5.49c0 1.44 1.17 2.61 2.61 2.61h4.95c1.44 0 2.61-1.17 2.61-2.61V4.74c0-1-.56-1.87-1.38-2.3-.29-.15-.64.05-.64.37Z" fill="rgba(0,0,0,0.38)" />
          </svg>
          <span style={{ fontSize: 11, color: 'rgba(0,0,0,0.42)', fontWeight: 600, fontFamily: FONT }}>Orders</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 24px auto', gap: 10, alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: '#111827', fontFamily: FONT }}>{note.item}</span>
            <span style={{ fontSize: 13, color: 'rgba(0,0,0,0.48)', textAlign: 'center', fontFamily: FONT }}>{note.qty}</span>
            <span style={{ fontSize: 13, color: '#111827', fontWeight: 600, fontFamily: FONT }}>{note.price}</span>
          </div>
        </div>
      </div>
    </article>
  )
}

function PreparedListScreen() {
  return (
    <div style={{ width: '100%', height: '100%', background: '#fff', display: 'flex', flexDirection: 'column' }}>
      <AppHeader initials="R" />

      <div style={{ padding: `22px ${SCREEN_PAD_X + 36}px 10px ${SCREEN_PAD_X + 96}px`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div style={{ width: 36, height: 36, borderRadius: 999, background: '#F5F5F5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 13L5 8L10 3" stroke="rgba(0,0,0,0.62)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p style={{ margin: 0, fontWeight: 700, fontSize: 18, color: '#000', fontFamily: FONT }}>
            Prepared Order List <span style={{ color: 'rgba(0,0,0,0.35)', fontWeight: 500 }}>(4)</span>
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ padding: '10px 16px', borderRadius: 999, background: '#F0FDF4', color: '#15803D', fontSize: 12, fontWeight: 600, fontFamily: FONT }}>Assign Rider</div>
          <div style={{ padding: '10px 16px', borderRadius: 999, background: '#FFF7ED', color: '#F97316', fontSize: 12, fontWeight: 600, fontFamily: FONT }}>Save</div>
        </div>
      </div>

      <div style={{ flex: 1, padding: `0 ${SCREEN_PAD_X + 36}px 12px ${SCREEN_PAD_X + 96}px`, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 18, alignContent: 'start' }}>
        {PREPARED_NOTES.map(note => <PreparedNote key={note.id} note={note} />)}
      </div>

      <BottomNav active="home" />
    </div>
  )
}

// ── Screen 5: Loading / Extracting ────────────────────────────────────────────

function LoadingScreen({ progress }: { progress: number }) {
  return (
    <div style={{ width: '100%', height: '100%', background: '#fff', display: 'flex', flexDirection: 'column' }}>
      <AppHeader initials="R" />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 20, padding: '0 80px' }}>
        <div style={{ fontSize: 44, lineHeight: 1 }}>🍴</div>
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <p style={{ margin: 0, fontWeight: 700, fontSize: 18, color: '#000', fontFamily: FONT, textAlign: 'center' }}>Extracting Orders...</p>
          <p style={{ margin: 0, fontSize: 13, color: 'rgba(0,0,0,0.48)', fontFamily: FONT, textAlign: 'center' }}>Analysing your screenshots</p>
          <div style={{ height: 7, background: '#F3F3F3', borderRadius: 999, overflow: 'hidden', marginTop: 8 }}>
            <div style={{ height: '100%', width: `${progress}%`, background: ORANGE, borderRadius: 999, transition: 'width 0.08s linear' }} />
          </div>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: ORANGE, fontFamily: FONT, textAlign: 'right' }}>{Math.round(progress)}%</p>
        </div>
      </div>
      <BottomNav active="home" />
    </div>
  )
}

function OrdersBoardCard({ order }: { order: typeof ORDERS_BOARD[number] }) {
  const colorMap: Record<string, string> = {
    Pending: '#FFF8A7',
    Packaged: '#DFF4FF',
    'In Transit': '#FBE5FF',
    Completed: '#E7F9C7',
    Pickup: '#FFECC2',
  }

  return (
    <article style={{
      minHeight: 136,
      borderRadius: 18,
      padding: '12px 12px 14px',
      background: colorMap[order.status],
      boxShadow: '0 8px 20px rgba(15, 23, 42, 0.06)',
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
    }}>
      <div>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#000', fontFamily: FONT }}>{order.name}</p>
        <p style={{ margin: '4px 0 0', fontSize: 11, color: 'rgba(0,0,0,0.5)', fontFamily: FONT }}>{order.phone} | {order.location}</p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#111827', fontFamily: FONT }}>{order.amount}</p>
        <p style={{ margin: 0, fontSize: 11, color: 'rgba(0,0,0,0.45)', fontFamily: FONT }}>1 Item</p>
      </div>
      <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <span style={{ fontSize: 11, color: 'rgba(0,0,0,0.58)', fontFamily: FONT }}>{order.item}</span>
        {order.status === 'In Transit' ? (
          <span style={{ fontSize: 11, fontWeight: 600, color: '#15803D', fontFamily: FONT }}>Track Order</span>
        ) : null}
      </div>
    </article>
  )
}

function OrdersBoardScreen({ boardOrders = ORDERS_BOARD }: { boardOrders?: typeof ORDERS_BOARD }) {
  return (
    <div style={{ width: '100%', height: '100%', background: '#fff', display: 'flex', flexDirection: 'column' }}>
      <AppHeader initials="R" />

      <div style={{ padding: `20px ${SCREEN_PAD_X}px 10px`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <p style={{ margin: 0, fontWeight: 700, fontSize: 16, color: '#000', fontFamily: FONT }}>
          Your Orders Today <span style={{ color: 'rgba(0,0,0,0.35)', fontWeight: 500 }}>({boardOrders.length})</span>
        </p>
      </div>

      <div style={{ flex: 1, overflow: 'hidden', padding: '0 20px 16px' }}>
        <div style={{ display: 'grid', gridAutoFlow: 'column', gridAutoColumns: '152px', gap: 14, overflowX: 'auto', overflowY: 'hidden', height: '100%', scrollbarWidth: 'none' }}>
          {ORDER_STATUSES.map((status) => {
            const orders = boardOrders.filter((order) => order.status === status)
            return (
              <section key={status} style={{ background: '#FAFAFA', borderRadius: 20, padding: 12, display: 'flex', flexDirection: 'column', gap: 12, height: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#000', fontFamily: FONT }}>{status}</p>
                  <span style={{ fontSize: 11, color: 'rgba(0,0,0,0.42)', fontFamily: FONT }}>{orders.length}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, overflowY: 'auto', paddingRight: 2 }}>
                  {orders.length > 0 ? orders.map((order) => (
                    <OrdersBoardCard key={order.id} order={order} />
                  )) : (
                    <div style={{ minHeight: 136, borderRadius: 18, border: '1px dashed rgba(0,0,0,0.10)', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: 11, color: 'rgba(0,0,0,0.35)', fontFamily: FONT }}>No orders</span>
                    </div>
                  )}
                </div>
              </section>
            )
          })}
        </div>
      </div>

      <BottomNav active="orders" />
    </div>
  )
}

// ── Cursor indicator ──────────────────────────────────────────────────────────

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function AnimatedCursor({ x, y, clicking }: { x: number; y: number; clicking: boolean }) {
  return (
    <div style={{
      position: 'absolute',
      left: x,
      top: y,
      pointerEvents: 'none',
      zIndex: 10,
      transform: clicking ? 'scale(0.78)' : 'scale(1)',
      transformOrigin: '4px 4px',
      transition: 'left 0.55s cubic-bezier(0.4,0,0.2,1), top 0.55s cubic-bezier(0.4,0,0.2,1), transform 0.12s ease',
    }}>
      <CursorIcon size={18} color="#111" />
    </div>
  )
}

// ── Welcome Frame 0 ──────────────────────────────────────────────────────────

type WPaperStyle = CSSProperties & { '--target-bottom': string }

function wPaperStyle(
  targetBottom: string,
  transform: string,
  position: Pick<CSSProperties, 'left' | 'right'>,
  animationDelay: string,
): WPaperStyle {
  return { '--target-bottom': targetBottom, transform, animationDelay, ...position }
}

function WFolderBack() {
  return (
    <svg width="72" height="42" viewBox="0 0 72 42" fill="none">
      <path d="M6 0H24L30 7H66C69.3 7 72 9.7 72 13V36C72 39.3 69.3 42 66 42H6C2.7 42 0 39.3 0 36V6C0 2.7 2.7 0 6 0Z" fill="#FDDCBA"/>
      <path d="M6 7H72V13H0V7Z" fill="#F5C9A0" fillOpacity="0.4"/>
    </svg>
  )
}

function WDocPaper() {
  return (
    <svg width="50" height="66" viewBox="0 0 50 66" fill="none">
      <rect width="50" height="66" rx="7" fill="white"/>
      <rect x="10" y="13" width="30" height="3" rx="1.5" fill="rgba(0,0,0,0.12)"/>
      <rect x="10" y="21" width="22" height="2.5" rx="1.25" fill="rgba(0,0,0,0.07)"/>
      <rect x="10" y="28" width="26" height="2.5" rx="1.25" fill="rgba(0,0,0,0.07)"/>
      <rect x="10" y="35" width="18" height="2.5" rx="1.25" fill="rgba(0,0,0,0.05)"/>
    </svg>
  )
}

function WFolderIcon() {
  const papers: WPaperStyle[] = [
    wPaperStyle('1px',  'rotate(7.87deg)',  { right: '6px' }, '0.4s'),
    wPaperStyle('6px',  'rotate(7.87deg)',  { left:  '6px' }, '0.2s'),
    wPaperStyle('8px',  'rotate(-8.47deg)', { left:  '4px' }, '0s'),
  ]
  return (
    <div style={{ position: 'relative', width: 72, height: 64, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', bottom: 0, width: '100%', zIndex: 10 }}>
        <WFolderBack />
      </div>
      {papers.map((style, i) => (
        <div key={i} className="w0-paper" style={{ position: 'absolute', width: '70%', zIndex: 20 + i * 10, ...style }}>
          <WDocPaper />
        </div>
      ))}
      <div style={{
        position: 'absolute', bottom: 0, width: '100%', height: '65%', zIndex: 50,
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.3)',
        borderRadius: 8,
        boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.4)',
        clipPath: 'polygon(0% 15%, 35% 15%, 40% 0%, 60% 0%, 65% 15%, 100% 15%, 100% 100%, 0% 100%)',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 100%)',
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 1, background: 'rgba(255,255,255,0.4)' }} />
      </div>
      <div className="w0-glow" style={{ position: 'absolute', top: '40%', width: '80%', height: '30%', zIndex: 45, background: 'rgba(255,255,255,0.4)', filter: 'blur(12px)', borderRadius: '50%' }} />
    </div>
  )
}

function WPasteIcon() {
  return (
    <div style={{ width: 140, height: 100, background: '#F8F9FB', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, animation: 'w0_containerLift 4s ease-in-out infinite' }}>
        {['Jollof', 'Evandy Annex', 'Prince - 0559488203'].map((text, i) => (
          <div key={i} style={{ position: 'relative', padding: '2px 6px', fontSize: 10, fontWeight: 500, color: '#333', textAlign: 'center' }}>
            <div style={{
              position: 'absolute', top: 0, height: '100%',
              background: 'rgba(0,122,255,0.2)', borderRadius: 2, zIndex: 0,
              animation: `w0_lineSelect 4s ease ${i * 0.2}s infinite`,
            }} />
            <span style={{ position: 'relative', zIndex: 1 }}>{text}</span>
          </div>
        ))}
      </div>
      <div style={{
        position: 'absolute', bottom: 0, left: '50%',
        background: 'white', border: '1px solid rgba(0,0,0,0.08)',
        borderRadius: 20, display: 'flex', padding: '2px 4px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        animation: 'w0_menuSlide 4s ease-in-out infinite', zIndex: 20,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 8px' }}>
          <span style={{ fontSize: 9, display: 'flex', alignItems: 'center', gap: 2, fontFamily: FONT }}>
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
              <path d="M9.33 7.52V9.97C9.33 12.02 8.52 12.83 6.48 12.83H4.03C1.98 12.83 1.17 12.02 1.17 9.97V7.52C1.17 5.48 1.98 4.67 4.03 4.67H6.48C8.52 4.67 9.33 5.48 9.33 7.52Z" fill="rgba(0,0,0,0.6)"/>
              <path d="M9.98 1.17H7.53C5.9 1.17 5.05 1.69 4.78 2.93C4.66 3.48 5.13 3.94 5.68 3.94H6.48C8.93 3.94 10.06 5.08 10.06 7.53V8.32C10.06 8.87 10.52 9.35 11.07 9.22C12.31 8.95 12.83 8.1 12.83 6.48V4.03C12.83 1.98 12.02 1.17 9.98 1.17Z" fill="rgba(0,0,0,0.6)"/>
            </svg>
            Copy
          </span>
        </div>
        <div style={{ width: 1, background: '#EEE' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 8px', animation: 'w0_pasteFocus 4s ease infinite' }}>
          <span style={{ fontSize: 9, display: 'flex', alignItems: 'center', gap: 2, fontFamily: FONT }}>
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
              <path d="M4.67 1.75H3.15C2.37 1.75 1.75 2.37 1.75 3.15V12.02C1.75 12.39 2.1 12.83 3.15 12.83H10.85C11.22 12.83 12.25 12.39 12.25 12.02V3.15C12.25 2.78 11.9 1.75 10.85 1.75H9.33V2.45C9.33 2.73 8.99 2.92 8.87 2.92H5.13C5.01 2.92 4.67 2.73 4.67 2.45V1.75Z" fill="rgba(0,0,0,0.16)"/>
              <path d="M9.33 1.75H10.85C11.22 1.75 12.25 2.1 12.25 3.15V12.02C12.25 12.39 11.9 12.83 10.85 12.83H3.15C2.78 12.83 1.75 12.39 1.75 12.02V3.15C1.75 2.78 2.1 1.75 3.15 1.75H4.67M5.13 0.58H8.87C8.99 0.58 9.33 0.78 9.33 1.05V2.45C9.33 2.73 8.99 2.92 8.87 2.92H5.13C5.01 2.92 4.67 2.73 4.67 2.45V1.05C4.67 0.78 5.01 0.58 5.13 0.58Z" stroke="rgba(0,0,0,0.6)" strokeWidth="0.875" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Paste
          </span>
        </div>
      </div>
    </div>
  )
}

const W_NAME = 'Marvin Abekah'
const W_PHONE = '+233 - 054 123 456'

function WEnterOrdersIcon() {
  const [nameTxt, setNameTxt] = useState('')
  const [phoneTxt, setPhoneTxt] = useState('')
  const [phase, setPhase] = useState('idle')
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    const run = () => {
      timers.current.forEach(clearTimeout)
      setNameTxt(''); setPhoneTxt(''); setPhase('idle')
      let t = 800
      setTimeout(() => setPhase('typing-name'), t)
      for (let i = 1; i <= W_NAME.length; i++) {
        t += 70
        timers.current.push(setTimeout(() => setNameTxt(W_NAME.slice(0, i)), t))
      }
      t += 500
      setTimeout(() => setPhase('typing-phone'), t)
      for (let i = 1; i <= W_PHONE.length; i++) {
        t += 70
        timers.current.push(setTimeout(() => setPhoneTxt(W_PHONE.slice(0, i)), t))
      }
      timers.current.push(setTimeout(run, t + 2000))
    }
    run()
    return () => timers.current.forEach(clearTimeout)
  }, [])

  return (
    <div style={{ width: 130, background: 'linear-gradient(145deg, #F7E96A 0%, #F0DC52 100%)', borderRadius: 10, padding: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={{ fontSize: 8, fontWeight: 700, opacity: 0.6, fontFamily: FONT }}>DETAILS</span>
      <div style={{ borderBottom: '1px dashed rgba(0,0,0,0.2)', minHeight: 12, fontSize: 10, fontFamily: FONT }}>
        {nameTxt}{phase === 'typing-name' && '|'}
      </div>
      <div style={{ borderBottom: '1px dashed rgba(0,0,0,0.2)', minHeight: 12, fontSize: 10, fontFamily: FONT }}>
        {phoneTxt}{phase === 'typing-phone' && '|'}
      </div>
    </div>
  )
}

function WAssignRidersIcon() {
  const [active, setActive] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setActive(p => (p + 1) % 3), 2000)
    return () => clearInterval(id)
  }, [])
  return (
    <div style={{ width: 130, background: '#fff', borderRadius: 12, padding: 10, display: 'flex', flexDirection: 'column', gap: 8, border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, opacity: active === i ? 1 : 0.3, transition: 'opacity 0.5s' }}>
          <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: active === i ? '#3B82F6' : '#D1D5DB' }} />
          </div>
          <div style={{ flex: 1, height: 4, background: '#F3F4F6', borderRadius: 999, overflow: 'hidden' }}>
            <div style={{ height: '100%', background: '#60A5FA', borderRadius: 999, width: active === i ? '100%' : '0%', transition: 'width 1s ease' }} />
          </div>
        </div>
      ))}
    </div>
  )
}

function WTrackIcon() {
  return (
    <div style={{ width: 130, height: 80, background: '#EFF6FF', borderRadius: 12, overflow: 'hidden', position: 'relative', border: '1px solid rgba(0,0,0,0.05)' }}>
      <svg style={{ position: 'absolute', inset: 0, opacity: 0.5 }} width="130" height="80" viewBox="0 0 130 80">
        {[20, 40, 60].map(y => <line key={y} x1="0" y1={y} x2="130" y2={y} stroke="#93C5FD" strokeWidth="0.8"/>)}
        {[26, 52, 78, 104].map(x => <line key={x} x1={x} y1="0" x2={x} y2="80" stroke="#93C5FD" strokeWidth="0.8"/>)}
        <rect x="0" y="33" width="130" height="14" fill="#DBEAFE" fillOpacity="0.7"/>
        <line x1="0" y1="40" x2="130" y2="40" stroke="#93C5FD" strokeWidth="1" strokeDasharray="7 5"/>
      </svg>
      <div style={{ position: 'absolute', top: '50%', left: '50%', animation: 'w0_bounce 2s ease-in-out infinite', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
          <circle cx="13" cy="13" r="9" fill="#3B82F6" fillOpacity="0.2"/>
          <circle cx="13" cy="13" r="6" fill="#3B82F6"/>
          <circle cx="13" cy="13" r="2.5" fill="white"/>
        </svg>
      </div>
    </div>
  )
}

function WGoogleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M21.8055 10.0415H21V10H12V14H17.6515C16.827 16.3285 14.6115 18 12 18C8.6865 18 6 15.3135 6 12C6 8.6865 8.6865 6 12 6C13.5295 6 14.921 6.577 15.9805 7.5195L18.809 4.691C17.023 3.0265 14.634 2 12 2C6.4775 2 2 6.4775 2 12C2 17.5225 6.4775 22 12 22C17.5225 22 22 17.5225 22 12C22 11.3295 21.931 10.675 21.8055 10.0415Z" fill="#FFC107"/>
      <path d="M3.15332 7.3455L6.43882 9.755C7.32782 7.554 9.48082 6 12.0003 6C13.5298 6 14.9213 6.577 15.9808 7.5195L18.8093 4.691C17.0233 3.0265 14.6343 2 12.0003 2C8.15932 2 4.82832 4.1685 3.15332 7.3455Z" fill="#FF3D00"/>
      <path d="M12.0002 22C14.5832 22 16.9302 21.0115 18.7047 19.404L15.6097 16.785C14.5721 17.5745 13.3039 18.0014 12.0002 18C9.39916 18 7.19066 16.3415 6.35866 14.027L3.09766 16.5395C4.75266 19.778 8.11366 22 12.0002 22Z" fill="#4CAF50"/>
      <path d="M21.8055 10.0415H21V10H12V14H17.6515C17.2571 15.1082 16.5467 16.0766 15.608 16.7855L18.7045 19.4035C18.4855 19.6025 22 17 22 12C22 11.3295 21.931 10.675 21.8055 10.0415Z" fill="#1976D2"/>
    </svg>
  )
}

function WAppleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M19.1001 19.16C19.6901 18.26 19.9101 17.8 20.3601 16.79C17.0401 15.53 16.5101 10.8 19.7901 8.99C18.7901 7.73 17.3801 7 16.0501 7C15.0901 7 14.4301 7.25 13.8401 7.48C13.3401 7.67 12.8901 7.84 12.3301 7.84C11.7301 7.84 11.2001 7.65 10.6401 7.45C10.0301 7.23 9.39006 7 8.59006 7C7.10006 7 5.51007 7.91 4.50007 9.47C3.08007 11.67 3.33007 15.79 5.62007 19.31C6.44007 20.57 7.54007 21.98 8.97007 22C9.57007 22.01 9.96007 21.83 10.3901 21.64C10.8801 21.42 11.4101 21.18 12.3401 21.18C13.2701 21.17 13.7901 21.42 14.2801 21.64C14.7001 21.83 15.0801 22.01 15.6701 22C17.1201 21.98 18.2801 20.42 19.1001 19.16Z" fill="black"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M15.8404 2C16.0004 3.1 15.5504 4.19 14.9604 4.95C14.3304 5.77 13.2304 6.41 12.1704 6.37C11.9804 5.31 12.4704 4.22 13.0704 3.49C13.7404 2.69 14.8704 2.07 15.8404 2Z" fill="black"/>
    </svg>
  )
}

function WEmailIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M21.3 12.23H17.82C16.84 12.23 15.97 12.77 15.53 13.65L14.69 15.31C14.49 15.71 14.09 15.96 13.65 15.96H10.37C10.06 15.96 9.62 15.89 9.33 15.31L8.49 13.66C8.05 12.79 7.17 12.24 6.2 12.24H2.7C2.31 12.24 2 12.55 2 12.94V16.2C2 19.83 4.18 22 7.82 22H16.2C19.63 22 21.74 20.12 22 16.78V12.93C22 12.55 21.69 12.23 21.3 12.23Z" fill="rgba(0,0,0,0.6)"/>
      <path d="M12.75 2C12.75 1.59 12.41 1.25 12 1.25C11.59 1.25 11.25 1.59 11.25 2V4H12.75V2Z" fill="rgba(0,0,0,0.6)"/>
      <path d="M22 9.81V10.85C21.78 10.77 21.54 10.73 21.3 10.73H17.82C16.27 10.73 14.88 11.59 14.19 12.97L13.44 14.45H10.58L9.83 12.98C9.14 11.59 7.75 10.73 6.2 10.73H2.7C2.46 10.73 2.22 10.77 2 10.85V9.81C2 6.17 4.17 4 7.81 4H11.25V7.19L10.53 6.47C10.24 6.18 9.76 6.18 9.47 6.47C9.18 6.76 9.18 7.24 9.47 7.53L11.47 9.53C11.56 9.61 11.63 9.66 11.71 9.69C11.81 9.73 11.9 9.75 12 9.75C12.1 9.75 12.19 9.73 12.28 9.69C12.37 9.66 12.46 9.6 12.53 9.53L14.53 7.53C14.82 7.24 14.82 6.76 14.53 6.47C14.24 6.18 13.76 6.18 13.47 6.47L12.75 7.19V4H16.19C19.83 4 22 6.17 22 9.81Z" fill="rgba(0,0,0,0.6)"/>
    </svg>
  )
}

function VPLogo() {
  return <img src={vendorProLogoSrc} alt="Vendor Pro" style={{ height: 42, width: 'auto' }} />
}

function WAuthButton({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <div style={{
      height: 48, padding: '0 16px',
      background: 'rgba(249,249,249,0.5)',
      borderRadius: 999,
      border: '1px solid rgba(0,0,0,0.10)',
      display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <span style={{ width: 24, display: 'flex', justifyContent: 'center', color: 'rgba(0,0,0,0.6)' }}>{icon}</span>
      <span style={{ flex: 1, textAlign: 'center', fontSize: 14, fontWeight: 600, color: 'rgba(0,0,0,0.8)', fontFamily: FONT }}>
        {label}
      </span>
    </div>
  )
}

const W_FEATURES: Array<{ label: string; renderIcon: () => ReactNode }> = [
  { label: 'Upload Screenshot Of Orders', renderIcon: () => <WFolderIcon /> },
  { label: 'Paste Orders',                renderIcon: () => <WPasteIcon /> },
  { label: 'Enter Orders',                renderIcon: () => <WEnterOrdersIcon /> },
  { label: 'Assign Orders To Riders',     renderIcon: () => <WAssignRidersIcon /> },
  { label: 'Users Track Orders Anywhere', renderIcon: () => <WTrackIcon /> },
]

function WelcomeCarousel() {
  return (
    <div style={{ width: '100%', overflow: 'hidden' }}>
      <div style={{ display: 'flex', width: 'max-content', gap: 16, animation: 'w0_carousel 35s linear infinite' }}>
        {[...W_FEATURES, ...W_FEATURES, ...W_FEATURES].map((feat, i) => (
          <div key={i} style={{
            height: 148, width: 180, flexShrink: 0,
            borderRadius: 16, border: '1px solid #BFDBFE', background: '#F9FAFB',
            padding: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {feat.renderIcon()}
            </div>
            <span style={{ textAlign: 'center', fontSize: 11, fontWeight: 500, color: 'rgba(0,0,0,0.7)', fontFamily: FONT, marginTop: 8, lineHeight: 1.3 }}>
              {feat.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function WelcomeFrame0() {
  return (
    <div style={{ width: '100%', height: '100%', background: '#fdfdfd', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, overflow: 'hidden' }}>
      <style>{`
        @keyframes w0_carousel { 0% { transform: translateX(0); } 100% { transform: translateX(-33.33%); } }
        @keyframes w0_folderRise {
          0%, 15%  { bottom: -4px; }
          25%, 75% { bottom: var(--target-bottom); }
          85%, 100%{ bottom: 0px; }
        }
        @keyframes w0_glow {
          0%, 15%  { transform: scale(0.8); }
          25%, 75% { transform: scale(1.1); }
          85%, 100%{ transform: scale(0.8); }
        }
        .w0-paper { animation: w0_folderRise 8s ease-in-out infinite; }
        .w0-glow  { animation: w0_glow 8s ease-in-out infinite; }
        @keyframes w0_containerLift {
          0%, 10%  { transform: translateY(0); }
          25%, 85% { transform: translateY(-10px); }
          95%, 100%{ transform: translateY(0); }
        }
        @keyframes w0_lineSelect {
          0%       { width: 0%; left: 50%; opacity: 0; }
          25%, 80% { width: 104%; left: -2%; opacity: 1; }
          90%, 100%{ width: 104%; left: -2%; opacity: 0; }
        }
        @keyframes w0_menuSlide {
          0%, 20%  { opacity: 0; transform: translate(-50%, 8px); }
          35%, 80% { opacity: 1; transform: translate(-50%, 0); }
          90%, 100%{ opacity: 0; transform: translate(-50%, 8px); }
        }
        @keyframes w0_pasteFocus {
          0%, 50%  { background: transparent; }
          60%, 80% { background: rgba(0,0,0,0.04); }
          100%     { background: transparent; }
        }
        @keyframes w0_bounce {
          0%, 100% { transform: translate(-50%, -50%) translateY(0); }
          50%      { transform: translate(-50%, -50%) translateY(-5px); }
        }
      `}</style>
      <div style={{
        width: '100%', maxWidth: 460,
        background: '#fff', borderRadius: 40,
        padding: '32px 32px 28px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22,
        border: '1px solid rgba(0,0,0,0.05)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.07)',
        overflow: 'hidden',
      }}>
        <VPLogo />
        <div style={{ textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#000', fontFamily: FONT, letterSpacing: '-0.02em' }}>
            Welcome To Vendor Pro
          </p>
          <p style={{ margin: '4px 0 0', fontSize: 15, color: 'rgba(0,0,0,0.4)', fontFamily: FONT }}>
            Let's get you started
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
          <WAuthButton icon={<WGoogleIcon />} label="Continue with Google" />
          <WAuthButton icon={<WAppleIcon />}  label="Continue with Apple"  />
          <WAuthButton icon={<WEmailIcon />}  label="Get Started With Email" />
        </div>
        <WelcomeCarousel />
      </div>
    </div>
  )
}

// ── Frame 1: Video of the home interface ───────────────────────────────────────

function Frame1() {
  return (
    <video
      src={homeVend}
      autoPlay
      loop
      muted
      playsInline
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
      }}
    />
  )
}

// ── Frame 2: Modal → Upload → Extract (0–100%) → Prepared List → loop ─────────

function Frame2() {
  return (
    <img
      src={orderHistory}
      alt="Order history"
      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
    />
  )
}

function Frame3() {
  return (
    <img
      src={orderHistory}
      alt="Order history"
      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
    />
  )
}

// ── Main export ────────────────────────────────────────────────────────────────

export default function VendorProHomePreview() {
  return (
    <div style={f.scroller}>
      <div style={f.card}><WelcomeFrame0 /></div>
      <div style={f.card}><Frame1 /></div>
      <div style={f.card}><Frame2 /></div>
      <div style={f.card}><Frame3 /></div>
    </div>
  )
}

const f = {
  scroller: {
    display: 'grid',
    gridAutoFlow: 'column',
    gridAutoColumns: 'min-content',
    gap: 40,
    overflowX: 'auto' as const,
    overflowY: 'hidden' as const,
    height: DESKTOP_FRAME_H,
    scrollSnapType: 'x proximity',
    scrollbarWidth: 'none' as const,
  },
  card: {
    position: 'relative' as const,
    width: DESKTOP_FRAME_W,
    height: DESKTOP_FRAME_H,
    borderRadius: 20,
    background: '#fff',
    overflow: 'hidden' as const,
    flexShrink: 0,
    scrollSnapAlign: 'start',
  },
}
