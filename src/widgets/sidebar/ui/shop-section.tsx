import { useGetUserShopsByPersonalIdQuery } from '@/entities/shop'
import { CreateShopButton } from '@/features/shop/create-shop'
import { Typography } from '@/shared/ui/typography'

import { ShopAccordion } from './shop-accordion'

type Props = {
  personalId: string
}

export const ShopSection = ({ personalId }: Props) => {
  const { data: shops } = useGetUserShopsByPersonalIdQuery({ personalId })

  if (shops?.length === 0) {
    return (
      <div className={'flex flex-col justify-center'}>
        <h4 className={'text-sm font-medium'}>Магазин</h4>
        <CreateShopButton className={'w-full'} variant={'secondary'} />
      </div>
    )
  }

  return (
    <ul>
      <li className={'py-[4px]'}>
        <Typography className={'font-bold flex items-center'}>Магазин</Typography>
      </li>
      {shops?.map(shop => (
        <li className={'py-[4px]'} key={shop.id_shop}>
          <ShopAccordion shop={shop} />
        </li>
      ))}
    </ul>
  )
}
