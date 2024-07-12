import { useEffect, useState } from 'react'
import type { ComponentPropsWithoutRef } from 'react'
import { Link } from 'react-router-dom'

import { SignOutButton } from '@/features/auth/sign-out'
import { ModeToggle } from '@/features/change-theme'
import { ROUTER_PATHS } from '@/shared/config/routes'
import { cn } from '@/shared/lib/tailwind'
import { Clock } from 'lucide-react'

type User = {
  name: string
  surname: string
}

type HeaderProps = {
  user?: User
} & Omit<ComponentPropsWithoutRef<'header'>, 'children'>

export const Header = ({ className, user, ...rest }: HeaderProps) => {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [usdRate, setUsdRate] = useState<null | number>(null)

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    const fetchUsdRate = async () => {
      try {
        const response = await fetch('https://www.cbr-xml-daily.ru/daily_json.js')
        const data = await response.json()

        setUsdRate(data.Valute.USD.Value)
      } catch (error) {
        console.error('Error fetching USD rate:', error)
      }
    }

    fetchUsdRate()

    return () => clearInterval(intervalId)
  }, [])

  const formattedTime = `${currentTime.getHours().toString().padStart(2, '0')}:${currentTime.getMinutes().toString().padStart(2, '0')}`

  return (
    <header
      className={cn(
        'fixed top-0 z-50 bg-background h-[var(--header-height)] w-full lg:text-[16px] text-[12px] border-b border-border/40',
        className
      )}
      {...rest}
    >
      <div className={'px-8 flex h-[var(--header-height)] items-center'}>
        <Link className={'flex gap-2 items-center w-full h-full'} to={ROUTER_PATHS.HOME}>
          <Logo src={'/logotip.png'} />
          <h1 className={'text-lg font-bold'}>{import.meta.env.VITE_APP_NAME}</h1>
        </Link>

        <div className={'flex md:ml-[-120px] items-center w-full justify-center '}>
          <Clock className={'w-6 h-6 text-gray-600'} />
          <span className={'ml-[10px] lg:mr-[160px] mr-[70px]'}> {formattedTime}</span>
          <span className={'inline-block flex flex-row'}>
            $ {usdRate ? `${usdRate.toFixed(2)} руб` : 'Загрузка...'}
          </span>
        </div>

        <div className={'flex flex-1 gap-2 md:justify-end items-center'}>
          {user && (
            <span className={'mr-2'}>
              {user.name} {user.surname}
            </span>
          )}
          <ModeToggle />
          <SignOutButton />
        </div>
      </div>
    </header>
  )
}

const Logo = ({ src }: { src: string }) => {
  return (
    <div className={'logo-container'}>
      <img alt={'Logo'} src={src} />
    </div>
  )
}
