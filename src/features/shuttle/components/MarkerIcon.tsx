type Props = { color: string }

export default function MarkerIcon({ color }: Props) {
  return (
    <svg width="22" height="30" viewBox="0 0 22 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M11 0C4.925 0 0 4.925 0 11C0 19.25 11 30 11 30C11 30 22 19.25 22 11C22 4.925 17.075 0 11 0Z"
        fill={color}
      />
      <circle cx="11" cy="11" r="4.5" fill="white" />
    </svg>
  )
}
