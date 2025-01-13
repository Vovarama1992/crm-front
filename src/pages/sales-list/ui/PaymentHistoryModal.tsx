import React, { useState } from 'react'

import { useGetCommissionsBySaleIdQuery } from '@/entities/sale'
import { ComissionType, CommissionDto } from '@/entities/sale/sale.types'
import { useMeQuery } from '@/entities/session'
import { useGetWorkerByIdQuery } from '@/entities/workers'

import { EditCommissionModal } from './EditCommissionModal'

export const comissionTypeMapping: Record<ComissionType, string> = {
  [ComissionType.ADDITIONAL]: 'Доплата',
  [ComissionType.ADVANCE]: 'Аванс',
  [ComissionType.REFUND]: 'Возврат',
}

interface PaymentHistoryModalProps {
  onClose: () => void
  saleId: number
}

export const PaymentHistoryModal: React.FC<PaymentHistoryModalProps> = ({ onClose, saleId }) => {
  const { data: commissions, refetch } = useGetCommissionsBySaleIdQuery(saleId)
  const { data: meData } = useMeQuery()
  const [editingCommission, setEditingCommission] = useState<{
    id: null | number
    isEditing: boolean
  }>({ id: null, isEditing: false })
  const canEdit = meData?.roleName === 'Директор' || meData?.roleName === 'Бухгалтер'

  const handleEditClick = (id: number) => {
    setEditingCommission({ id, isEditing: true })
  }

  const handleCloseEdit = () => {
    setEditingCommission({ id: null, isEditing: false })
  }

  return (
    <div className={'fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'}>
      <div
        className={
          'bg-white p-6 rounded-lg shadow-lg fixed top-[20%] left-[20%] w-[60%] h-[60%] max-h-[80vh] overflow-y-auto'
        }
      >
        <h2 className={'text-xl font-semibold mb-4'}>История платежей</h2>
        <table className={'min-w-full table-auto'}>
          <thead>
            <tr>
              <th className={'px-4 py-2 text-left w-1/5'}>Тип</th>
              <th className={'px-4 py-2 text-left w-1/5'}>Сумма</th>
              <th className={'px-4 py-2 text-left w-1/5'}>Дата</th>
              <th className={'px-4 py-2 text-left w-1/5'}>Сотрудник</th>
              <th className={'px-4 py-2 text-left w-1/5'}>Комментарий</th>
              {canEdit && <th className={'px-4 py-2 text-left w-1/5'}>Действия</th>}
            </tr>
          </thead>
          <tbody>
            {commissions?.map(commission => (
              <tr key={commission.id}>
                <td className={'px-4 py-2'}>
                  {commission.category
                    ? comissionTypeMapping[commission.category as ComissionType]
                    : 'Неизвестно'}
                </td>
                <td className={'px-4 py-2'}>{commission.commissionAmount}</td>
                <td className={'px-4 py-2'}>
                  {new Date(commission.createdAt).toLocaleDateString()}
                </td>
                <td className={'px-4 py-2'}>
                  <WorkerName workerId={commission.createdBy} />
                </td>
                <td className={'px-4 py-2'}>{commission.description}</td>
                {canEdit && (
                  <td className={'px-4 py-2'}>
                    <button
                      className={'bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'}
                      onClick={() => handleEditClick(commission.id)}
                    >
                      Редактировать
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {editingCommission.isEditing && editingCommission.id !== null && (
          <EditCommissionModal
            commission={
              commissions?.find(
                commission => commission.id === editingCommission.id
              ) as CommissionDto
            }
            onClose={handleCloseEdit}
            refetch={refetch}
          />
        )}

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

const WorkerName: React.FC<{ workerId: number }> = ({ workerId }) => {
  const { data: worker } = useGetWorkerByIdQuery(workerId)

  if (!worker) {
    return <span>Загрузка...</span>
  }

  return (
    <span>
      {worker.surname} {worker.name} {worker.middleName}
    </span>
  )
}
