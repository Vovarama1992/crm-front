import React from 'react'

import { useGetCommissionsBySaleIdQuery } from '@/entities/sale'
import { ComissionType } from '@/entities/sale/sale.types'

interface PaymentHistoryModalProps {
  onClose: () => void
  saleId: number
}

export const PaymentHistoryModal: React.FC<PaymentHistoryModalProps> = ({ onClose, saleId }) => {
  const { data: commissions } = useGetCommissionsBySaleIdQuery(saleId)

  return (
    <div className={'fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'}>
      <div className={'bg-white p-6 rounded-lg shadow-lg w-96 max-h-[70vh] overflow-y-auto'}>
        <h2 className={'text-xl font-semibold mb-4'}>История платежей</h2>
        <table className={'min-w-full table-auto'}>
          <thead>
            <tr>
              <th className={'px-4 py-2'}>Тип</th>
              <th className={'px-4 py-2'}>Сумма</th>
              <th className={'px-4 py-2'}>Дата</th>
              <th className={'px-4 py-2'}>Комментарий</th>
            </tr>
          </thead>
          <tbody>
            {commissions?.map(commission => (
              <tr key={commission.id}>
                <td className={'px-4 py-2'}>{ComissionType[commission.comissionType]}</td>
                <td className={'px-4 py-2'}>{commission.commissionAmount}</td>
                <td className={'px-4 py-2'}>
                  {new Date(commission.createdAt).toLocaleDateString()}
                </td>
                <td className={'px-4 py-2'}>{commission.description}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className={'flex justify-end space-x-2 mt-4'}>
          <button
            className={'bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400'}
            onClick={onClose}
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  )
}
