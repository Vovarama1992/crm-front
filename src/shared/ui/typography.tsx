import type { ComponentProps, ElementType } from 'react'
import { forwardRef } from 'react'

import { cn } from '@/shared/lib/tailwind'
import { Slot } from '@radix-ui/react-slot'
import { cva } from 'class-variance-authority'

const defaultVariantMapping = {
  body1: 'p',
  body2: 'p',
  caption: 'span',
  error: 'span',
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  large: 'h1',
  link1: 'a',
  link2: 'a',
  overline: 'span',
} as const

type TypographyVariant = keyof typeof defaultVariantMapping

type TypographyProps = {
  asChild?: boolean
  variant?: TypographyVariant
} & ComponentProps<'p'>

export const Typography = forwardRef<HTMLElement, TypographyProps>(
  ({ asChild, className, variant = 'body1', ...rest }, ref) => {
    const Component: ElementType = asChild ? Slot : defaultVariantMapping[variant] || 'span'

    const typographyVariants = cva('', {
      variants: {
        variant: {
          body1: 'text-sm',
          body2: 'text-sm font-medium',
          caption: 'text-xs',
          error: 'error text-red-600 text-xs',
          h1: 'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl',
          h2: 'font-semibold tracking-tight text-xl',
          h3: 'font-semibold tracking-tight text-xl',
          h4: 'scroll-m-20 text-xl font-semibold tracking-tight',
          large: 'font-semibold tracking-tight text-xl',
          link1: 'underline text-blue-500',
          link2: 'underline text-blue-500 font-medium',
          overline: 'uppercase font-medium',
        } satisfies Record<TypographyVariant, string>,
      },
    })

    return (
      <Component className={cn(typographyVariants({ className, variant }))} ref={ref} {...rest} />
    )
  }
)

// ==============================================================================

if (import.meta.env.DEV) {
  Typography.displayName = 'Typography'
}

// ==============================================================================
