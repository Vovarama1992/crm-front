import type { ShopDto } from '@/entities/shop'

import { NavLink } from 'react-router-dom'

import { AccessConnectionButton } from '@/features/connection/connection-access'
import { ROUTER_PATHS } from '@/shared/config/routes'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/ui-shad-cn/ui/accordion'

type ShopAccordionProps = { shop: ShopDto }

export const ShopAccordion = ({ shop }: ShopAccordionProps) => {
  const connectionList = shop.access_to_connections

  return (
    <Accordion className={'w-full'} type={'multiple'}>
      <AccordionItem value={shop.id_shop.toString()}>
        <AccordionTrigger className={'p-0 mb-0 font-normal [&[data-state=open]]:pb-[4px]'}>
          {shop.name_shop}
        </AccordionTrigger>
        <AccordionContent>
          <NavLink
            className={'py-[4px] block hover:underline'}
            to={ROUTER_PATHS.SHOP(shop.id_shop)}
          >
            Информация
          </NavLink>
          {connectionList?.map(connection => (
            <NavLink
              className={'py-[4px] block hover:underline'}
              key={connection.id_access_to_connections}
              to={ROUTER_PATHS.SHOP_CONNECTION(shop.id_shop, connection.id_access_to_connections)}
            >
              {connection.name_connection}
            </NavLink>
          ))}
          {connectionList?.length <= 10 && (
            <AccessConnectionButton
              className={'font-normal'}
              shopId={shop.id_shop}
              size={null}
              variant={null}
            />
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
