import React, { useMemo, useState } from 'react'

import { useGetDeletedPurchasesQuery, useRestorePurchaseMutation } from '@/entities/purchase'
import { useGetAllCounterpartiesQuery } from '@/entities/purchase'
import { PurchaseDto } from '@/entities/purchase/purchase.types'
import { useMeQuery } from '@/entities/session'
import { useGetActiveQuery } from '@/entities/workers'

interface DeletedPurchasesModalProps {
  isOpen: boolean
  onClose: () => void
}

const DeletedPurchasesModal: React.FC<DeletedPurchasesModalProps> = ({ isOpen, onClose }) => {
  const { data: deletedPurchases, isLoading: isPurchasesLoading } = useGetDeletedPurchasesQuery()
  const { data: counterparties } = useGetAllCounterpartiesQuery()
  const { data: workers } = useGetActiveQuery()
  const { data: user } = useMeQuery()
  const [restorePurchase] = useRestorePurchaseMutation()
  const roleName = user?.roleName || ''

  const [searchTerm, setSearchTerm] = useState('')

  // Фильтрация закупок
  const filteredPurchases = useMemo(() => {
    return deletedPurchases?.filter(
      (purchase: PurchaseDto) =>
        purchase.counterpartyId.toString().includes(searchTerm) ||
        purchase.requestNumber.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [deletedPurchases, searchTerm])

  const handleRestore = async (purchaseId: number) => {
    try {
      await restorePurchase(purchaseId).unwrap()
      alert('Закупка успешно восстановлена!')
      onClose()
    } catch (error) {
      console.error('Ошибка при восстановлении:', error)
      alert('Не удалось восстановить закупку.')
    }
  }

  if (!isOpen) {
    return null
  }

  return (
    <div className={'fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'}>
      <div className={'bg-white p-4 rounded-lg shadow-lg w-3/4'}>
        <h2 className={'text-xl font-bold mb-4'}>Удаленные закупки</h2>
        <input
          className={'mb-4 p-2 border rounded'}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder={'Поиск по заказчику или номеру запроса'}
          type={'text'}
          value={searchTerm}
        />
        {isPurchasesLoading ? (
          <div>Загрузка...</div>
        ) : (
          <table className={'table-auto w-full border-collapse'}>
            <thead>
              <tr>
                <th className={'border px-4 py-2'}>Дата создания</th>
                <th className={'border px-4 py-2'}>Номер запроса</th>
                <th className={'border px-4 py-2'}>Контрагент</th>
                <th className={'border px-4 py-2'}>Менеджер</th>
                <th className={'border px-4 py-2'}>Сумма</th>
                {roleName == 'Директор' && <th className={'border px-4 py-2'}>Действия</th>}
              </tr>
            </thead>
            <tbody>
              {filteredPurchases?.map((purchase: PurchaseDto) => {
                const counterparty = counterparties?.find(
                  counterparty => counterparty.id === purchase.counterpartyId
                )
                const worker = workers?.find(worker => worker.id === purchase.userId)

                return (
                  <tr key={purchase.id}>
                    <td className={'border px-4 py-2'}>
                      {purchase.createdAt ? new Date(purchase.createdAt).toLocaleDateString() : '-'}
                    </td>
                    <td className={'border px-4 py-2'}>{purchase.requestNumber}</td>
                    <td className={'border px-4 py-2'}>
                      {counterparty ? counterparty.name : 'Не найден'}
                    </td>
                    <td className={'border px-4 py-2'}>
                      {worker ? `${worker.name} ${worker.surname}` : 'Не найден'}
                    </td>
                    <td className={'border px-4 py-2'}>{purchase.invoiceToCustomer}</td>
                    <td className={'border px-4 py-2'}>
                      <button
                        className={'bg-green-500 text-white px-2 py-1 rounded'}
                        onClick={() => handleRestore(purchase.id)}
                      >
                        Восстановить
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
        <div className={'mt-4'}>
          <button className={'bg-gray-500 text-white px-4 py-2 rounded'} onClick={onClose}>
            Закрыть
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeletedPurchasesModal
