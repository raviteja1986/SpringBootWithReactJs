import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from './utils'

// React Hook Form attaches its registration ref to the actual input element.
// Forwarding it is essential for RHF to read current values on submit.
export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...props }, ref) {
    return <input ref={ref} className={cn('input', className)} {...props} />
  },
)
