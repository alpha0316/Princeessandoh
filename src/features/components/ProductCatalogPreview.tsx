import { useState } from 'react'
import { Check, Plus, QrCode } from '@phosphor-icons/react'
import MobileStatusBar from './MobileStatusBar'

function ProductArt({ kind }: { kind: 'battery' | 'engine' | 'wheel' }) {
  if (kind === 'battery') return <svg viewBox="0 0 120 90" aria-hidden="true"><path d="M17 29 92 17l10 8v43L23 81 14 73V35z" fill="#91a7a9" stroke="#343a3d" strokeWidth="3"/><path d="m17 29 74-12v43L17 73z" fill="#316f95" stroke="#343a3d" strokeWidth="3"/><path d="M28 35h17M28 42h9M76 28h11" stroke="#d5e0df" strokeWidth="3"/><path d="M37 50h13m-6-6v13" stroke="#f5bd44" strokeWidth="3"/><path d="m92 21 7-2v7m-3 37 7-2v7" fill="none" stroke="#343a3d" strokeWidth="3"/></svg>
  if (kind === 'wheel') return <svg viewBox="0 0 120 90" aria-hidden="true"><circle cx="60" cy="45" r="38" fill="#24292b" stroke="#101214" strokeWidth="4"/><circle cx="60" cy="45" r="28" fill="#e4e5e2" stroke="#8c9292" strokeWidth="3"/><circle cx="60" cy="45" r="9" fill="#3e4547" stroke="#111" strokeWidth="3"/><path d="M54 36 46 18M66 36l8-18M54 53 40 68M66 53l14 15M49 44H24m47 0h25" fill="none" stroke="#3a4042" strokeWidth="7" strokeLinecap="round"/><circle cx="60" cy="45" r="4" fill="#c9ccca"/></svg>
  return <svg viewBox="0 0 120 90" aria-hidden="true"><rect x="18" y="22" width="83" height="50" rx="8" fill="#899091" stroke="#343a3d" strokeWidth="3"/><path d="M26 30h67v34H26z" fill="#b5babb" stroke="#555d5f" strokeWidth="2"/><path d="M33 36h8v22h-8zm14 0h8v22h-8zm14 0h8v22h-8zm14 0h8v22h-8z" fill="#3b4244" stroke="#232729" strokeWidth="2"/><path d="M75 22v-9h22v9m-6-9v-6" fill="none" stroke="#ac4e4e" strokeWidth="4" strokeLinecap="round"/><path d="M20 33h-5v27h5m81-22h6v17h-6" fill="#737a7b" stroke="#343a3d" strokeWidth="3"/><circle cx="29" cy="68" r="3" fill="#303638"/><circle cx="89" cy="68" r="3" fill="#303638"/></svg>
}

export default function ProductCatalogPreview({ isPaused = false }: { isPaused?: boolean }) {
  const [added, setAdded] = useState(false)

  return (
    <div className={`catalog-preview${isPaused ? ' is-paused' : ''}`}>
      <MobileStatusBar time="11:41" className="catalog-status" />
      <header className="catalog-header">
        <b>Catalog</b>
        <span className="catalog-tools">
          <span className="catalog-scan" aria-label="Scan code" role="img"><QrCode weight="bold" /></span>
          <i>K</i>
        </span>
      </header>
      <div className="catalog-stack" aria-label="Featured product illustrations">
        <div className="catalog-product catalog-product--left"><ProductArt kind="battery" /></div>
        <div className="catalog-product catalog-product--right"><ProductArt kind="wheel" /></div>
        <div className="catalog-product catalog-product--center"><ProductArt kind="engine" /></div>
      </div>
      <div className="catalog-product-caption"><b>You First Product</b><span><i>₵</i><em /></span></div>
      <div className="catalog-empty-copy">List your products and services to show up in more customer searches.</div>
      <button className="catalog-add" type="button" onClick={() => setAdded((current) => !current)}><span>{added ? <Check weight="bold" /> : <Plus weight="bold" />}</span>{added ? 'Product Added' : 'Add Your First Product'}</button>
    </div>
  )
}
