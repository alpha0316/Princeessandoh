export function ImagesDuotone({ className }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="2" width="20" height="20" rx="4" fill="currentColor" fillOpacity="0.15"/>
      <circle cx="8.5" cy="8.5" r="2.5" fill="currentColor"/>
      <path d="M21 15L16 10L9 17L13 21H20C20.5523 21 21 20.5523 21 20V15Z" fill="currentColor"/>
      <path d="M3 16L8 11L13 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
