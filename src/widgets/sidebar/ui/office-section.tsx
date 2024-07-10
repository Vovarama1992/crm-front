import { ComponentPropsWithoutRef } from 'react'
import { Link } from 'react-router-dom'

import { useGetUserShopsByPersonalIdQuery } from '@/entities/shop'
import { Typography } from '@/shared/ui/typography'
import { Button } from '@/shared/ui-shad-cn/ui/button'

type OfficeSectionProps = {
  personalId: string
} & Omit<ComponentPropsWithoutRef<'ul'>, 'children'>

export const OfficeSection = ({ personalId, ...rest }: OfficeSectionProps) => {
  const { data: shops } = useGetUserShopsByPersonalIdQuery({ personalId })

  const isEmptyShops = shops?.length === 0

  return (
    <ul {...rest}>
      <li className={'py-[4px]'}>
        <Typography className={'font-bold flex items-center'}>Офис</Typography>
      </li>
      {!isEmptyShops && (
        <li className={'text-sm'}>
          <Button asChild className={'py-1'} size={null} variant={'link'}></Button>
        </li>
      )}
      <li className={'text-sm'}>
        <Button asChild className={'py-1'} size={null} variant={'link'}></Button>
      </li>
      <li className={'text-sm'}>
        <Button asChild className={'py-1'} size={null} variant={'link'}>
          <Link to={''}>Пользователи</Link>
        </Button>
      </li>
    </ul>
  )
}
