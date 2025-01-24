import React, { useEffect, useState } from 'react'

import { useUpdateMotivationMutation } from '@/entities/workers'
import { useToast } from '@/shared/ui-shad-cn/ui/use-toast'

interface UpdateMotivationModalProps {
  initialMarginPercent: number
  initialThreshold: number
  isOpen: boolean
  motivationId: number
  onClose: () => void
  refetch: () => void
}

const UpdateMotivationModal: React.FC<UpdateMotivationModalProps> = ({
  initialMarginPercent,
  initialThreshold,
  isOpen,
  motivationId,
  onClose,
  refetch,
}) => {
  const [threshold, setThreshold] = useState(initialThreshold)
  const [marginPercent, setMarginPercent] = useState(Number(initialMarginPercent.toFixed()))
  const [updateMotivation, { isLoading }] = useUpdateMotivationMutation()
  const { toast } = useToast()

  useEffect(() => {
    if (isOpen) {
      setThreshold(initialThreshold)
      setMarginPercent(Number(initialMarginPercent.toFixed()))
    }
  }, [isOpen, initialThreshold, initialMarginPercent])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await updateMotivation({ marginPercent, motivationId, threshold }).unwrap()
      refetch()
      onClose()
      toast({
        description: 'Мотивация успешно обновлена.',
        title: 'Успех',
        variant: 'default',
      })
    } catch (error: any) {
      toast({
        description: error.data?.message || 'Произошла ошибка при обновлении мотивации.',
        title: 'Ошибка обновления',
        variant: 'destructive',
      })
    }
  }

  if (!isOpen) {
    return null
  }

  return (
    <div
      className={'fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50'}
    >
      <div className={'bg-white p-6 rounded-lg shadow-lg w-96'}>
        <h2 className={'text-2xl font-semibold mb-4'}>Обновить мотивацию</h2>
        <form onSubmit={handleSubmit}>
          <div className={'mb-4'}>
            <label className={'block text-sm font-medium text-gray-700'} htmlFor={'threshold'}>
              Порог
            </label>
            <input
              className={'mt-1 p-2 border border-gray-300 rounded-md w-full'}
              id={'threshold'}
              min={0}
              onChange={e => setThreshold(Number(e.target.value))}
              type={'text'}
              value={threshold}
            />
          </div>
          <div className={'mb-4'}>
            <label className={'block text-sm font-medium text-gray-700'} htmlFor={'marginPercent'}>
              Процент маржи
            </label>
            <input
              className={'mt-1 p-2 border border-gray-300 rounded-md w-full'}
              id={'marginPercent'}
              min={0}
              onChange={e => setMarginPercent(Number(e.target.value))}
              type={'text'}
              value={marginPercent}
            />
          </div>
          <div className={'flex justify-end space-x-4'}>
            <button
              className={'bg-gray-500 text-white px-4 py-2 rounded-md'}
              onClick={onClose}
              type={'button'}
            >
              Отменить
            </button>
            <button
              className={'bg-blue-500 text-white px-4 py-2 rounded-md'}
              disabled={isLoading}
              type={'submit'}
            >
              {isLoading ? 'Обновляем...' : 'Обновить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UpdateMotivationModal
