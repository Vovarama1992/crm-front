import React from 'react'

import { useGetAllCounterpartiesQuery } from '@/entities/deal'
import { SaleDto, SigningStage } from '@/entities/deal/deal.types'
import { formatCurrency } from '@/pages/kopeechnik'

const formatDate = (date: Date | null | string | undefined) => {
  if (!date) {
    return ''
  }
  const validDate = typeof date === 'string' ? new Date(date) : date

  return validDate.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

interface TableRowProps {
  getSaleStage: (signingStage: SigningStage | undefined) => string
  handleFileOpen: (pdfUrl: string) => void
  handleFileUpload: (saleId: number, event: React.ChangeEvent<HTMLInputElement>) => Promise<void>
  handleSelectChange: (
    sale: SaleDto,
    field: 'deliveryStage' | 'signingStage',
    value: string
  ) => Promise<void>
  openEditModal: (sale: SaleDto) => void
  rowStyle?: string
  sale: SaleDto
  translatedDeliveryStage: { [key: string]: string }
  translatedSigningStage: { [key: string]: string }
}

const TableRow: React.FC<TableRowProps> = ({
  getSaleStage,
  handleFileOpen,
  handleFileUpload,
  handleSelectChange,
  openEditModal,
  rowStyle,
  sale,
  translatedDeliveryStage,
  translatedSigningStage,
}) => {
  const { data: counters } = useGetAllCounterpartiesQuery()

  function getName(id: number) {
    const name = counters?.find(counter => counter.id === id)?.name

    return name
  }

  return (
    <tr className={rowStyle}>
      <td
        className={'px-2 py-1 whitespace-nowrap text-sm text-gray-500 truncate'}
        style={{ width: '30px' }}
      >
        {rowStyle ? sale.saleId : sale.id}
      </td>
      <td className={'px-2 py-1 whitespace-nowrap text-sm text-gray-500 truncate'}>
        {sale.date.split('T')[0]}
      </td>
      <td className={'px-2 py-1 whitespace-nowrap text-sm text-gray-500 truncate'}>
        {sale.pdfUrl ? (
          <button onClick={() => handleFileOpen(sale.pdfUrl as string)}>
            {sale.pdfUrl.split('/').pop()}
          </button>
        ) : (
          'Нет PDF'
        )}
        <div className={'mt-1'}>
          <input
            id={`file-upload-${sale.id}`}
            onChange={e => handleFileUpload(sale.id, e)}
            style={{ display: 'none' }}
            type={'file'}
          />
          <label
            className={'bg-blue-500 text-white px-2 py-1 rounded cursor-pointer'}
            htmlFor={`file-upload-${sale.id}`}
          >
            Загрузить PDF
          </label>
        </div>
      </td>
      <td className={'px-2 py-1 whitespace-nowrap text-sm text-gray-500 truncate'}>
        {getName(sale.counterpartyId) || '—'}
      </td>
      <td className={'px-2 py-1 whitespace-nowrap text-sm text-gray-500 truncate'}>
        {sale.logisticsCost ? formatCurrency(sale.logisticsCost) : '—'}
      </td>
      <td className={'px-2 py-1 whitespace-nowrap text-sm text-gray-500 truncate'}>
        {sale.purchaseCost ? formatCurrency(sale.purchaseCost) : '—'}
      </td>
      <td className={'px-2 py-1 whitespace-nowrap text-sm text-gray-500 truncate'}>
        {sale.totalSaleAmount ? formatCurrency(sale.totalSaleAmount) : '—'}
      </td>
      <td className={'px-2 py-1 whitespace-nowrap text-sm text-gray-500 truncate'}>
        {sale.paidNow || sale.prepaymentAmount
          ? formatCurrency(sale.paidNow + sale.prepaymentAmount)
          : '—'}
      </td>
      <td className={'px-2 py-1 whitespace-nowrap text-sm text-gray-500 truncate'}>
        {sale.margin !== undefined && getSaleStage(sale.signingStage) === 'Конец'
          ? formatCurrency(
              (sale.totalSaleAmount as number) - sale.logisticsCost - sale.purchaseCost
            )
          : '—'}
      </td>
      <td className={'px-2 py-1 whitespace-nowrap text-sm text-gray-500 truncate'}>
        <select
          className={'border border-gray-300 rounded p-1 w-full truncate'}
          onChange={e => handleSelectChange(sale, 'deliveryStage', e.target.value)}
          value={sale.deliveryStage || ''}
        >
          <option value={''}>—</option>
          {Object.entries(translatedDeliveryStage).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </td>
      <td className={'px-2 py-1 whitespace-nowrap text-sm text-gray-500 truncate'}>
        <select
          className={'border border-gray-300 rounded p-1 w-full truncate'}
          onChange={e => handleSelectChange(sale, 'signingStage', e.target.value)}
          value={sale.signingStage || ''}
        >
          <option value={''}>—</option>
          {Object.entries(translatedSigningStage).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </td>
      <td className={'px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden'}>
        {getSaleStage(sale.signingStage)}
      </td>
      <td className={'px-2 py-1 whitespace-nowrap text-sm text-gray-500 truncate'}>
        {getSaleStage(sale.signingStage) === 'Конец' && sale.statusSetDate
          ? formatDate(sale.statusSetDate).split('T')[0]
          : '—'}
      </td>
      <td className={'px-2 py-1 whitespace-nowrap text-sm text-gray-500 truncate'}>
        {!rowStyle && (
          <button
            className={'bg-blue-500 text-white px-2 py-1 rounded'}
            onClick={() => openEditModal(sale)}
          >
            Редактировать
          </button>
        )}
      </td>
    </tr>
  )
}

export default TableRow
