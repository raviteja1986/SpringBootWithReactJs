import type { ButtonHTMLAttributes } from 'react'
import { cn } from './utils'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'default' | 'outline' | 'ghost' | 'destructive' }
export function Button({ className, variant = 'default', ...props }: Props) {
  return <button className={cn('button', `button-${variant}`, className)} {...props} />
}
