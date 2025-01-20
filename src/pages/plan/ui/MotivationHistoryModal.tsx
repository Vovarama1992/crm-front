import { useGetChangesByEntityTypeQuery } from '@/entities/changes'
import { ChangeDto, EntityType } from '@/entities/changes/change.types'
import { Typography } from '@/shared/ui/typography'

export const MotivationHistoryModal = ({ onClose }: { onClose: () => void }) => {
  const {
    data: changes,
    error,
    isLoading,
  } = useGetChangesByEntityTypeQuery({
    entityType: EntityType.MOTIVATION,
  })

  if (isLoading) {
    return <div>Loading...</div>
  }
  if (error) {
    return <div>Error loading changes</div>
  }

  return (
    <div className={'fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'}>
      <div className={'bg-white p-6 rounded-lg max-w-lg w-full'}>
        <Typography variant={'h2'}>История изменений мотивации</Typography>
        <ul className={'mt-4 space-y-2'}>
          {changes && changes.length > 0 ? (
            <ul className={'space-y-4'}>
              {changes.map((change: ChangeDto) => (
                <li className={'border-b border-gray-200 pb-2'} key={change.id}>
                  <p className={'text-gray-600'}>{change.description}</p>
                  <p className={'text-sm text-gray-500'}>
                    Дата: {new Date(change.changedAt).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p>История изменений пуста.</p>
          )}
        </ul>
        <button className={'mt-4 p-2 bg-red-500 text-white rounded'} onClick={onClose}>
          Закрыть
        </button>
      </div>
    </div>
  )
}
