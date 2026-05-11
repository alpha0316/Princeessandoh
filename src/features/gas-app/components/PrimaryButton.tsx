type PrimaryButtonProps = {
  title: string
  onPress?: () => void
  disabled?: boolean
}

export default function PrimaryButton({ title, onPress, disabled = false }: PrimaryButtonProps) {
  return (
    <button
      type="button"
      onClick={disabled ? undefined : onPress}
      disabled={disabled}
      style={{
        width: '100%',
        border: 'none',
        borderRadius: 24,
        background: disabled ? '#C9C9C9' : '#000000',
        color: '#FFFFFF',
        padding: '18px 24px',
        fontSize: 18,
        fontWeight: 700,
        lineHeight: 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.96 : 1,
        transition: 'background-color 160ms ease',
      }}
    >
      {title}
    </button>
  )
}
