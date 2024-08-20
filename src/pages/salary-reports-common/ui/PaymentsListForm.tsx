import React, { useState } from 'react'

import { useGetAllPaymentsQuery } from '@/entities/deal'
import { PaymentDto } from '@/entities/deal/deal.types'
import { useGetWorkersQuery } from '@/entities/workers'

import UpdatePaymentForm from './UpdatePaymentForm' // Импортируем форму обновления выплаты

type PaymentsListFormProps = {
  onClose: () => void
}

const PAYMENT_TYPE_MAP: { [key: string]: string } = {
  BONUS: 'Бонус',
  SALARY: 'Оклад',
}

const PaymentsListForm: React.FC<PaymentsListFormProps> = ({ onClose }) => {
  const { data: payments, error, isLoading } = useGetAllPaymentsQuery()
  const { data: workers } = useGetWorkersQuery()
  const [selectedPayment, setSelectedPayment] = useState<PaymentDto | null>(null)
  const [showUpdatePaymentForm, setShowUpdatePaymentForm] = useState(false)

  if (isLoading) {
    return <div>Loading...</div>
  }
  if (error) {
    return <div>Error loading payments</div>
  }

  const handleEditClick = (payment: PaymentDto) => {
    setSelectedPayment(payment)
    setShowUpdatePaymentForm(true)
  }

  const getWorkerName = (userId: number): string => {
    const worker = workers?.find(worker => worker.id === userId)

    return worker ? `${worker.name} ${worker.surname}` : 'Unknown User'
  }

  return (
    <div className={'fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center'}>
      <div className={'bg-white p-4 rounded shadow-lg w-1/2'}>
        <h2 className={'text-lg font-bold mb-4'}>All Payments</h2>
        <table className={'table-auto w-full border-collapse'}>
          <thead>
            <tr>
              <th className={'border px-4 py-2 bg-gray-100'}>Сотрудник</th>
              <th className={'border px-4 py-2 bg-gray-100'}>Сумма</th>
              <th className={'border px-4 py-2 bg-gray-100'}>Тип платежа</th>
              <th className={'border px-4 py-2 bg-gray-100'}>Дата</th>
              <th className={'border px-4 py-2 bg-gray-100'}>...</th>
            </tr>
          </thead>
          <tbody>
            {payments && payments.length > 0 ? (
              payments.map(payment => (
                <tr key={payment.id}>
                  <td className={'border px-4 py-2'}>{getWorkerName(payment.userId)}</td>
                  <td className={'border px-4 py-2'}>{payment.amount}</td>
                  <td className={'border px-4 py-2'}>
                    {PAYMENT_TYPE_MAP[payment.type] || payment.type}
                  </td>
                  <td className={'border px-4 py-2'}>
                    {new Date(payment.date).toLocaleDateString()}
                  </td>
                  <td className={'border px-4 py-2'}>
                    <button
                      className={'bg-blue-500 text-white px-2 py-1 rounded'}
                      onClick={() => handleEditClick(payment)}
                    >
                      Редактировать
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className={'border px-4 py-2 text-center'} colSpan={5}>
                  No payments available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className={'mt-4 flex justify-end'}>
          <button className={'bg-red-500 text-white px-4 py-2 rounded'} onClick={onClose}>
            Close
          </button>
        </div>
        {showUpdatePaymentForm && selectedPayment && (
          <UpdatePaymentForm
            onClose={() => setShowUpdatePaymentForm(false)}
            payment={selectedPayment} // Передаем весь объект payment
          />
        )}
      </div>
    </div>
  )
}

export default PaymentsListForm
