import type { ShopDto } from '@/entities/shop'

import { Accordion, AccordionItem, AccordionTrigger } from '@/shared/ui-shad-cn/ui/accordion'

type ShopAccordionProps = { shop: ShopDto }

export const ShopAccordion = ({ shop }: ShopAccordionProps) => {
  return (
    <Accordion className={'w-full'} type={'multiple'}>
      <AccordionItem value={shop.id_shop.toString()}>
        <AccordionTrigger className={'p-0 mb-0 font-normal [&[data-state=open]]:pb-[4px]'}>
          {shop.name_shop}
        </AccordionTrigger>
      </AccordionItem>
    </Accordion>
  )
}
