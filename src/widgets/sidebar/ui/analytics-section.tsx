import { ComponentPropsWithoutRef } from 'react'

import { useGetUserShopsByPersonalIdQuery } from '@/entities/shop'
import { Typography } from '@/shared/ui/typography'
import { Button } from '@/shared/ui-shad-cn/ui/button'

type AnalyticsSectionProps = {
  personalId: string
} & Omit<ComponentPropsWithoutRef<'ul'>, 'children'>

export const AnalyticsSection = ({ personalId, ...rest }: AnalyticsSectionProps) => {
  const { data: shops } = useGetUserShopsByPersonalIdQuery({ personalId })

  const isNotEmptyConnection = shops?.some(shop => shop.access_to_connections.length > 0)

  if (!isNotEmptyConnection) {
    return null
  }

  return (
    <ul {...rest}>
      <li className={'py-[4px]'}>
        <Typography className={'font-bold flex items-center'}>Аналитика</Typography>
      </li>

      <li className={'text-sm'}>
        <Button asChild className={'py-1'} size={null} variant={'link'}></Button>
      </li>
    </ul>
  )
}
