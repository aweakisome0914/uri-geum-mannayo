'use client'

interface Props {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  loading?: boolean
  type?: 'button' | 'submit'
  variant?: 'dark' | 'ghost'
}

export function PrimaryButton({
  children,
  onClick,
  disabled,
  loading,
  type = 'button',
  variant = 'dark',
}: Props) {
  const base =
    'w-full py-4 rounded-full font-serif font-medium text-[15px] tracking-wide transition-all duration-200 active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed'
  const styles = {
    dark:  'bg-[#1A1A1A] text-white',
    ghost: 'bg-transparent text-[#1A1A1A] border border-[#1A1A1A]/20',
  }
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${styles[variant]}`}
    >
      {loading ? '少々お待ちください…' : children}
    </button>
  )
}
