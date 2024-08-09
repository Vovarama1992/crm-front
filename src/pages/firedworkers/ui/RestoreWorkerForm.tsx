import React, { useState } from 'react'

import { WorkerDto } from '@/entities/workers'
import { useRestoreWorkerMutation } from '@/entities/workers'
import { useToast } from '@/shared/ui-shad-cn/ui/use-toast'

type RestoreWorkerFormProps = {
  onClose: () => void
  worker: Omit<WorkerDto, 'table_id'>
}

const RestoreWorkerForm: React.FC<RestoreWorkerFormProps> = ({ onClose, worker }) => {
  const [formState, setFormState] = useState(worker)
  const [restoreWorker, { isLoading }] = useRestoreWorkerMutation()
  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setFormState(prevState => ({ ...prevState, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await restoreWorker(worker.id).unwrap()
      toast({
        description: `Сотрудник ${worker.name} успешно восстановлен!`,
        title: 'Восстановление успешно',
        type: 'background',
      })
      onClose()
    } catch (error) {
      console.error('Failed to restore worker:', error)
      toast({
        description: 'Ошибка восстановления сотрудника.',
        title: 'Ошибка',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className={'fixed z-10 inset-0 overflow-y-auto'}>
      <div
        className={
          'flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'
        }
      >
        <div aria-hidden={'true'} className={'fixed inset-0 transition-opacity'}>
          <div className={'absolute inset-0 bg-gray-500 opacity-75'}></div>
        </div>
        <span aria-hidden={'true'} className={'hidden sm:inline-block sm:align-middle sm:h-screen'}>
          &#8203;
        </span>
        <div
          className={
            'inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6'
          }
        >
          <div className={'sm:flex sm:items-start'}>
            <div className={'mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left'}>
              <h3 className={'text-lg leading-6 font-medium text-gray-900'} id={'modal-title'}>
                Восстановление сотрудника
              </h3>
              <div className={'mt-2'}>
                <form onSubmit={handleSubmit}>
                  <div className={'mb-4'}>
                    <label className={'block text-sm font-medium text-gray-700'}>ФИО</label>
                    <input
                      className={
                        'mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                      }
                      name={'name'}
                      onChange={handleChange}
                      required
                      type={'text'}
                      value={formState.name}
                    />
                  </div>
                  <div className={'mb-4'}>
                    <label className={'block text-sm font-medium text-gray-700'}>Должность</label>
                    <input
                      className={
                        'mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                      }
                      name={'position'}
                      onChange={handleChange}
                      required
                      type={'text'}
                      value={formState.position}
                    />
                  </div>
                  <div className={'mb-4'}>
                    <label className={'block text-sm font-medium text-gray-700'}>Почта</label>
                    <input
                      className={
                        'mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                      }
                      name={'email'}
                      onChange={handleChange}
                      required
                      type={'email'}
                      value={formState.email}
                    />
                  </div>
                  <div className={'mb-4'}>
                    <label className={'block text-sm font-medium text-gray-700'}>Добавочный</label>
                    <input
                      className={
                        'mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                      }
                      name={'dobNumber'}
                      onChange={handleChange}
                      type={'text'}
                      value={formState.dobNumber}
                    />
                  </div>
                  <div className={'mb-4'}>
                    <label className={'block text-sm font-medium text-gray-700'}>Мобильный</label>
                    <input
                      className={
                        'mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                      }
                      name={'mobile'}
                      onChange={handleChange}
                      type={'text'}
                      value={formState.mobile}
                    />
                  </div>
                  <div className={'mb-4'}>
                    <label className={'block text-sm font-medium text-gray-700'}>
                      Дата рождения
                    </label>
                    <input
                      className={
                        'mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                      }
                      name={'birthday'}
                      onChange={handleChange}
                      type={'date'}
                      value={formState.birthday}
                    />
                  </div>
                  <div className={'mb-4'}>
                    <label className={'block text-sm font-medium text-gray-700'}>
                      Карта для перевода
                    </label>
                    <input
                      className={
                        'mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                      }
                      name={'cardNumber'}
                      onChange={handleChange}
                      type={'text'}
                      value={formState.cardNumber}
                    />
                  </div>
                  <div className={'mt-5 sm:mt-6 sm:flex sm:flex-row-reverse'}>
                    <button
                      className={
                        'w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm'
                      }
                      disabled={isLoading}
                      type={'submit'}
                    >
                      Сохранить
                    </button>
                    <button
                      className={
                        'mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm'
                      }
                      onClick={onClose}
                      type={'button'}
                    >
                      Отмена
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RestoreWorkerForm
