import React from 'react'
import ShuttleScreenBase from './ShuttleScreenBase'

export default function SelectionScreen({
  zoomOutOnReveal,
  initialPickUp,
  initialDropOff,
}: {
  zoomOutOnReveal?: boolean
  initialPickUp?: string
  initialDropOff?: string
}) {
  const [pickUp, setPickUp] = React.useState<{ name: string } | null>(
    initialPickUp ? { name: initialPickUp } : null
  )
  const [dropOff, setDropOff] = React.useState<{ name: string } | null>(
    initialDropOff ? { name: initialDropOff } : null
  )
  const [searchQuery, setSearchQuery] = React.useState('')

  // Sync when parent drives a new selection
  React.useEffect(() => {
    setPickUp(initialPickUp ? { name: initialPickUp } : null)
  }, [initialPickUp])
  React.useEffect(() => {
    setDropOff(initialDropOff ? { name: initialDropOff } : null)
  }, [initialDropOff])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }
  const handleInputFocus = () => {}
  const handleInputBlur = () => {}
  const handleClearPickUp = () => setPickUp(null)
  const handleClearDropOff = () => setDropOff(null)

  return (
    <ShuttleScreenBase
      title="Welcome To"
      highlight="ShuttleApp"
      initialCenter={[-1.5684, 6.6715]}
      initialZoom={15.6}
      zoomOutOnReveal={zoomOutOnReveal}
      inputContent={
        <div className="flex flex-col gap-3 p-4 rounded-4xl bg-gray-50">
          <div className="flex flex-col gap-2">
            <p className="m-0 text-[14px] text-[rgba(0,0,0,0.5)]">Starting Point</p>
            <div className="flex items-center gap-2">
              <div className={`w-10 h-10 min-w-10 min-h-10 aspect-square flex items-center justify-center rounded-full border border-dashed transition-all duration-300 ${pickUp ? 'border-black bg-black' : 'border-black/80 bg-white'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M20.6201 8.45C19.5701 3.83 15.5401 1.75 12.0001 1.75C11.9901 1.75 8.4601 1.75 3.3701 8.44C2.2001 13.6 5.3601 17.97 8.2201 20.72C9.2801 21.74 10.6401 22.25 12.0001 22.25C13.3601 22.25 14.7201 21.74 15.7701 20.72C18.6301 17.97 21.7901 13.61 20.6201 8.45ZM12.0001 13.46C10.2601 13.46 8.8501 12.05 8.8501 10.31C8.8501 8.57 10.2601 7.16 12.0001 7.16C13.7401 7.16 15.1501 8.57 15.1501 10.31C15.1501 12.05 13.7401 13.46 12.0001 13.46Z" fill={pickUp ? 'white' : 'black'} /></svg>
              </div>
              <div className={`flex px-4 py-3 gap-2 bg-white rounded-[16px] items-center border transition-all duration-300 ${pickUp ? 'border-black/80' : 'border-black/40'} w-[90%]`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M20.031 20.79L16.991 16.33C18.3064 14.8745 19.0336 12.9818 19.031 11.02C19.031 6.63 15.461 3.06 11.071 3.06C6.681 3.06 3.111 6.63 3.111 11.02C3.111 15.41 6.681 18.98 11.071 18.98C13.051 18.98 14.881 18.25 16.281 17.04L20.031 20.79ZM4.11 11.02C4.11 7.18 7.24 4.06 11.07 4.06C14.91 4.06 18.03 7.18 18.03 11.02C18.03 14.86 14.91 17.98 11.07 17.98C7.24 17.98 4.11 14.86 4.11 11.02Z" fill="black" fillOpacity="0.6" /></svg>
                <input type="text" placeholder="select pickup stop" value={pickUp?.name || searchQuery} onChange={handleSearch} onFocus={handleInputFocus} onBlur={handleInputBlur} className={`flex-1 border-none bg-transparent text-[14px] ${pickUp ? 'text-black' : 'text-black/60'} outline-none p-0`} />
                <svg onClick={handleClearPickUp} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4.26671 12.6666L3.33337 11.7333L7.06671 7.99992L3.33337 4.26659L4.26671 3.33325L8.00004 7.06659L11.7334 3.33325L12.6667 4.26659L8.93337 7.99992L12.6667 11.7333L11.7334 12.6666L8.00004 8.93325L4.26671 12.6666Z" fill={pickUp ? '#1D1B20' : 'rgba(0,0,0,0.4)'} /></svg>
              </div>
            </div>
          </div>

          {pickUp && <div style={{ width: 0.1, height: 20, border: '1px dashed rgba(0,0,0,1)', position: 'relative', left: '6%' }} />}

          {pickUp && (
            <div className="flex flex-col gap-2">
              <p className="m-0 text-[14px] text-[rgba(0,0,0,0.5)]">Drop Off Point</p>
              <div className="flex items-center gap-2">
                <div style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', borderRadius: 50, border: '1px dashed rgba(0,0,0,0.1)', justifyContent: 'center', backgroundColor: '#fff' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M20.6202 8.7C19.5802 4.07 15.5402 2 12.0002 2C8.46024 2 4.43024 4.07 3.38024 8.69C2.20024 13.85 5.36024 18.22 8.22024 20.98C9.28024 22 10.6402 22.51 12.0002 22.51C13.3602 22.51 14.7202 22 15.7702 20.98C18.6302 18.22 21.7902 13.86 20.6202 8.7Z" fill="black" fillOpacity="0.6" /></svg>
                </div>
                <div style={{ display: 'flex', paddingInline: 16, paddingBlock: 12, gap: 8, backgroundColor: '#fff', borderRadius: 16, alignItems: 'center', border: '1px solid rgba(0,0,0,0.1)', width: '90%' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M20.031 20.79L16.991 16.33C18.3064 14.8745 19.0336 12.9818 19.031 11.02C19.031 6.63 15.461 3.06 11.071 3.06C6.681 3.06 3.111 6.63 3.111 11.02C3.111 15.41 6.681 18.98 11.071 18.98C13.051 18.98 14.881 18.25 16.281 17.04L20.031 20.79ZM4.11 11.02C4.11 7.18 7.24 4.06 11.07 4.06C14.91 4.06 18.03 7.18 18.03 11.02C18.03 14.86 14.91 17.98 11.07 17.98C7.24 17.98 4.11 14.86 4.11 11.02Z" fill="black" fillOpacity="0.6" /></svg>
                  <input type="text" placeholder="select drop pff stop" value={dropOff?.name || searchQuery} onChange={handleSearch} onFocus={handleInputFocus} onBlur={handleInputBlur} style={{ flex: 1, border: 'none', backgroundColor: 'transparent', fontSize: 14, color: dropOff ? 'black' : 'rgba(0,0,0,0.6)', outline: 'none', padding: 0 }} />
                  <svg onClick={handleClearDropOff} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4.26671 12.6666L3.33337 11.7333L7.06671 7.99992L3.33337 4.26659L4.26671 3.33325L8.00004 7.06659L11.7334 3.33325L12.6667 4.26659L8.93337 7.99992L12.6667 11.7333L11.7334 12.6666L8.00004 8.93325L4.26671 12.6666Z" fill={dropOff ? '#1D1B20' : 'rgba(0,0,0,0.4)'} /></svg>
                </div>
              </div>
            </div>
          )}
        </div>
      }
    />
  )
}
