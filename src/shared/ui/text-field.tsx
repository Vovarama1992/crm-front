import type { ComponentProps, NamedExoticComponent, ReactNode } from 'react'
import { forwardRef, useId, useState } from 'react'

import { cn } from '@/shared/lib/tailwind'
import { Typography } from '@/shared/ui/typography'
import { Input } from '@/shared/ui-shad-cn/ui/input'
import { Label } from '@/shared/ui-shad-cn/ui/label'
import { EyeClosedIcon } from '@radix-ui/react-icons'
import { EyeIcon, SearchIcon } from 'lucide-react'
import { CgClose } from 'react-icons/cg'

export type InputProps = {
  endIcon?: ReactNode
  errorMessage?: string
  label?: string
  startIcon?: ReactNode
  type?: 'email' | 'password' | 'search' | 'text'
  value?: string
} & Omit<ComponentProps<'input'>, 'type' | 'value'>

const InternalInput = forwardRef<HTMLInputElement, InputProps>(
  ({ className, disabled, endIcon, errorMessage, label, startIcon, ...rest }, ref) => {
    const generatedId = useId()
    const inputId = rest?.id ?? generatedId

    const showError = !!errorMessage && errorMessage.length > 0

    return (
      <div className={cn('flex flex-col gap-2 lg:h-[54px] h-[42px]', className)}>
        {!!label && <Label htmlFor={inputId}>{label}</Label>}

        <div className={'relative w-full '}>
          {!!startIcon && (
            <Label
              className={cn(
                'px-[6px] h-full absolute left-0 top-0 flex items-center justify-center',
                disabled && 'opacity-50',
                showError && 'error text-red-600'
              )}
              htmlFor={inputId}
            >
              <span>{startIcon}</span>
            </Label>
          )}

          <Input
            className={cn(
              'w-full',
              startIcon && 'pl-[36px]',
              endIcon && 'pr-[36px]',
              showError && 'error text-red-600',
              'h-[30px]',
              'lg:h-[40px]'
            )}
            disabled={disabled}
            id={inputId}
            ref={ref}
            {...rest}
          />

          {!!endIcon && (
            <div
              className={cn(
                'px-[6px] h-full min-w-[36px] absolute right-0 top-0 flex items-center justify-center',
                disabled && 'opacity-50',
                showError && 'error text-red-600'
              )}
            >
              {endIcon}
            </div>
          )}
        </div>

        {showError && <Typography variant={'error'}>{errorMessage}</Typography>}
      </div>
    )
  }
)

// ==============================================================================

type PasswordInputProps = Omit<InputProps, 'endIcon' | 'type'>

const InternalPassword = forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    { autoCapitalize = 'off', autoComplete = 'off', disabled, spellCheck = false, ...rest },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false)

    const type: InputProps['type'] = showPassword ? 'text' : 'password'

    const toggleShowPassword = () => {
      if (disabled) {
        return
      }

      setShowPassword(!showPassword)
    }

    return (
      <InternalInput
        autoCapitalize={autoCapitalize}
        autoComplete={autoComplete}
        disabled={disabled}
        ref={ref}
        spellCheck={spellCheck}
        {...rest}
        endIcon={
          <button disabled={disabled} onClick={toggleShowPassword} type={'button'}>
            {showPassword ? <EyeIcon /> : <EyeClosedIcon />}
          </button>
        }
        type={type}
      />
    )
  }
)

// ==============================================================================

type SearchInputProps = {
  onClearClick?: () => void
} & Omit<InputProps, 'endIcon' | 'startIcon' | 'type'>

export const InternalSearch = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ disabled, onClearClick, ...rest }, ref) => {
    const shouldShowClearButton = !!onClearClick && rest?.value

    const handleClearInput = () => {
      if (disabled) {
        return
      }

      onClearClick?.()
    }

    return (
      <InternalInput
        disabled={disabled}
        ref={ref}
        {...rest}
        endIcon={
          shouldShowClearButton && (
            <button disabled={disabled} onClick={handleClearInput} type={'button'}>
              <CgClose />
            </button>
          )
        }
        startIcon={<SearchIcon />}
        type={'search'}
      />
    )
  }
)

// ==============================================================================

type EmailInputProps = Omit<InputProps, 'type'>

const InternalEmail = forwardRef<HTMLInputElement, EmailInputProps>(
  ({ spellCheck = false, ...rest }, ref) => {
    return <InternalInput ref={ref} spellCheck={spellCheck} {...rest} type={'email'} />
  }
)

// ==============================================================================

export const TextField = InternalInput as {
  Email: typeof InternalEmail
  Password: typeof InternalPassword
  Search: typeof InternalSearch
} & NamedExoticComponent<InputProps>

TextField.Password = InternalPassword
TextField.Search = InternalSearch
TextField.Email = InternalEmail

// ==============================================================================

if (import.meta.env.DEV) {
  TextField.displayName = 'TextField'
  TextField.Password.displayName = 'TextField.Password'
  TextField.Search.displayName = 'TextField.Search'
  TextField.Email.displayName = 'TextField.Email'
}

// ==============================================================================
