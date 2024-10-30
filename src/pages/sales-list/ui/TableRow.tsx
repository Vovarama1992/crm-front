import React from 'react'

import { SaleDto, SigningStage } from '@/entities/deal/deal.types'
import { formatCurrency } from '@/pages/kopeechnik'

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
}) => (
  <tr className={rowStyle}>
    <td className={'px-6 py-4 whitespace-nowrap text-sm text-gray-500'}>
      {rowStyle ? sale.saleId : sale.id}
    </td>
    <td className={'px-6 py-4 whitespace-nowrap text-sm text-gray-500'}>
      {sale.date.split('T')[0]}
    </td>
    <td className={'px-6 py-4 whitespace-nowrap text-sm text-gray-500'}>
      {sale.pdfUrl ? (
        <button onClick={() => handleFileOpen(sale.pdfUrl as string)}>
          {sale.pdfUrl.split('/').pop()}
        </button>
      ) : (
        'Нет PDF'
      )}
      <div className={'mt-2'}>
        <input
          id={`file-upload-${sale.id}`}
          onChange={e => handleFileUpload(sale.id, e)}
          style={{ display: 'none' }}
          type={'file'}
        />
        <label
          className={'bg-blue-500 text-white px-4 py-2 rounded cursor-pointer'}
          htmlFor={`file-upload-${sale.id}`}
        >
          Загрузить PDF
        </label>
      </div>
    </td>
    <td className={'px-6 py-4 whitespace-nowrap text-sm text-gray-500'}>
      {sale.counterpartyId || '—'}
    </td>
    <td className={'px-6 py-4 whitespace-nowrap text-sm text-gray-500'}>
      {sale.logisticsCost ? formatCurrency(sale.logisticsCost) : '—'}
    </td>
    <td className={'px-6 py-4 whitespace-nowrap text-sm text-gray-500'}>
      {sale.purchaseCost ? formatCurrency(sale.purchaseCost) : '—'}
    </td>
    <td className={'px-6 py-4 whitespace-nowrap text-sm text-gray-500'}>
      {sale.totalSaleAmount ? formatCurrency(sale.totalSaleAmount) : '—'}
    </td>
    <td className={'px-6 py-4 whitespace-nowrap text-sm text-gray-500'}>
      {sale.paidNow || sale.prepaymentAmount
        ? formatCurrency(sale.paidNow + sale.prepaymentAmount)
        : '—'}
    </td>
    <td className={'px-6 py-4 whitespace-nowrap text-sm text-gray-500'}>
      {sale.margin !== undefined && getSaleStage(sale.signingStage) === 'Конец'
        ? formatCurrency((sale.totalSaleAmount as number) - sale.logisticsCost - sale.purchaseCost)
        : '—'}
    </td>
    <td className={'px-6 py-4 whitespace-nowrap text-sm text-gray-500'}>
      <select
        className={'border border-gray-300 rounded p-1 w-full'}
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
    <td className={'px-6 py-4 whitespace-nowrap text-sm text-gray-500'}>
      <select
        className={'border border-gray-300 rounded p-1 w-full'}
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
    <td className={'px-6 py-4 whitespace-nowrap text-sm text-gray-500'}>
      {getSaleStage(sale.signingStage)}
    </td>
    <td className={'px-6 py-4 whitespace-nowrap text-sm text-gray-500'}>
      {getSaleStage(sale.signingStage) === 'Конец' && sale.statusSetDate
        ? sale.statusSetDate.split('T')[0]
        : '—'}
    </td>
    <td className={'px-6 py-4 whitespace-nowrap text-sm text-gray-500'}>
      {!rowStyle && (
        <button
          className={'bg-blue-500 text-white px-4 py-2 rounded'}
          onClick={() => openEditModal(sale)}
        >
          Редактировать
        </button>
      )}
    </td>
  </tr>
)

export default TableRow
