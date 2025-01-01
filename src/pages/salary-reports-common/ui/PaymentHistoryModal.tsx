import React, { useEffect } from 'react'

import { useGetPaymentChangesQuery } from '@/entities/deal'

type PaymentHistoryModalProps = {
  onClose: () => void
  paymentId: number
}

const PaymentHistoryModal: React.FC<PaymentHistoryModalProps> = ({ onClose, paymentId }) => {
  const { data: changes, isError, isLoading } = useGetPaymentChangesQuery({ entityId: paymentId })

  useEffect(() => {
    if (isError) {
      console.error('Failed to fetch payment history')
    }
  }, [isError])

  let content

  if (isLoading) {
    content = <p>Loading...</p>
  } else if (isError) {
    content = <p>Error loading history.</p>
  } else {
    content = (
      <ul className={'space-y-3'}>
        {changes?.map((change, index) => (
          <li className={'border-b pb-2'} key={index}>
            <div className={'text-sm text-gray-400'}>
              <span>
                <strong>Дата:</strong> {new Date(change.changedAt).toLocaleString()}
              </span>
            </div>
            <div className={'text-sm text-gray-600 mt-1'}>
              <strong>Изменения:</strong> {change.description}
            </div>
          </li>
        ))}
      </ul>
    )
  }

  return (
    <div className={'fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center'}>
      <div className={'bg-white p-6 rounded shadow-lg w-1/2 max-h-[80vh] overflow-y-auto'}>
        <h2 className={'text-xl font-bold mb-4'}>История изменений</h2>
        {content}
        <div className={'flex justify-end mt-4'}>
          <button className={'bg-red-500 text-white px-4 py-2 rounded'} onClick={onClose}>
            Закрыть
          </button>
        </div>
      </div>
    </div>
  )
}

export default PaymentHistoryModal
