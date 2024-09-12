import React, { useState } from 'react'

import { useGetAllSalesQuery } from '@/entities/deal/deal.api'
import { useCreateDepartureMutation } from '@/entities/departure/departure.api'
import { useMeQuery } from '@/entities/session'

const destinationOptions = [
  { label: 'До клиента', value: 'TO_CLIENT' },
  { label: 'До нас', value: 'TO_US' },
  { label: 'Возврат от клиента', value: 'RETURN_FROM_CLIENT' },
  { label: 'Возврат поставщику', value: 'RETURN_TO_SUPPLIER' },
]

const specificDestinationOptions = [
  { label: 'до терминала', value: 'TO_TERMINAL' },
  { label: 'до двери', value: 'TO_DOOR' },
]

const statusOptions = [
  { label: 'Отправлено полностью', value: 'SENT_ALL' },
  { label: 'Доставлено полностью', value: 'DELIVERED_ALL' },
  { label: 'Доставлено частично', value: 'DELIVERED_PARTIALLY' },
  { label: 'Проблема', value: 'PROBLEM' },
  { label: 'Отправлено частично', value: 'SENT_PARTIALLY' },
]

export const CreateDepartureForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { data: sales = [] } = useGetAllSalesQuery()
  const [createDeparture] = useCreateDepartureMutation()

  const [selectedUserId, setSelectedUserId] = useState<null | number>(null)
  const [selectedCounterpartyId, setSelectedCounterpartyId] = useState<null | number>(null)
  const [selectedStatus, setSelectedStatus] = useState<
    'DELIVERED_ALL' | 'DELIVERED_PARTIALLY' | 'PROBLEM' | 'SENT_ALL' | 'SENT_PARTIALLY'
  >('SENT_ALL')

  const { data: user } = useMeQuery()

  const departureCreator = user?.id || 9999

  const handleSaleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSaleId = Number(e.target.value)
    const selectedSale = sales.find(sale => sale.id === selectedSaleId)

    if (selectedSale) {
      setSelectedUserId(selectedSale.userId)
      setSelectedCounterpartyId(selectedSale.counterpartyId)

      console.log('Продажа выбрана:', selectedSale)
      console.log('Извлечен userId:', selectedSale.userId)
      console.log('Извлечен counterpartyId:', selectedSale.counterpartyId)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!selectedCounterpartyId) {
      alert('Пожалуйста, выберите продажу перед созданием отправления.')

      return
    }

    const formData = new FormData(e.currentTarget)

    const arrivalDate = formData.get('arrivalDate') as null | string
    const dispatchDate = formData.get('dispatchDate') as string
    const expectedArrivalDate = formData.get('expectedArrivalDate') as null | string

    const departureData = {
      arrivalDate: arrivalDate ? new Date(arrivalDate) : null,
      comments: formData.get('comments') as null | string,
      counterpartyId: selectedCounterpartyId!,
      dealId: Number(formData.get('dealId')),
      departureCreator,
      destination: formData.get('destination') as
        | 'RETURN_FROM_CLIENT'
        | 'RETURN_TO_SUPPLIER'
        | 'TO_CLIENT'
        | 'TO_US',
      dispatchDate: new Date(dispatchDate),
      expectedArrivalDate: expectedArrivalDate ? new Date(expectedArrivalDate) : null,
      finalAmount: formData.get('finalAmount') ? Number(formData.get('finalAmount')) : null,
      specificDestination: formData.get('specificDestination') as 'TO_DOOR' | 'TO_TERMINAL',
      status: selectedStatus, // Теперь статус выбран из заранее определенных значений
      trackingNumber: formData.get('trackingNumber') as null | string,
      transportCompany: formData.get('transportCompany') as string,
      userId: selectedUserId!,
    }

    console.log('Данные отправляемые на сервер:', departureData)

    try {
      await createDeparture(departureData).unwrap()

      alert('Отправление успешно создано!')
      onClose()
    } catch (error) {
      console.error('Ошибка при создании отправления:', error)
      alert('Произошла ошибка при создании отправления.')
    }
  }

  return (
    <form className={'p-4 border rounded shadow'} onSubmit={handleSubmit}>
      <h2 className={'text-lg font-bold mb-4'}>Создание отправления</h2>

      <div className={'mb-4'}>
        <label className={'block text-sm font-bold mb-1'}>Продажа</label>
        <select
          className={'border rounded p-2 w-full'}
          defaultValue={''} // Дефолтное значение пустое
          name={'dealId'}
          onChange={handleSaleChange}
          required
        >
          <option disabled value={''}>
            — Выберите продажу —
          </option>
          {sales.map(sale => (
            <option key={sale.id} value={sale.id}>
              {sale.id} {/* Отображаем ID продажи */}
            </option>
          ))}
        </select>
      </div>

      <div className={'mb-4'}>
        <label className={'block text-sm font-bold mb-1'}>Куда</label>
        <select className={'border rounded p-2 w-full'} name={'destination'} required>
          <option disabled value={''}>
            Выберите направление
          </option>
          {destinationOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className={'mb-4'}>
        <label className={'block text-sm font-bold mb-1'}>Транспортная компания</label>
        <input
          className={'border rounded p-2 w-full'}
          name={'transportCompany'}
          required
          type={'text'}
        />
      </div>

      <div className={'mb-4'}>
        <label className={'block text-sm font-bold mb-1'}>Дата отправки</label>
        <input
          className={'border rounded p-2 w-full'}
          name={'dispatchDate'}
          required
          type={'date'}
        />
      </div>

      <div className={'mb-4'}>
        <label className={'block text-sm font-bold mb-1'}>Куда конкретно</label>
        <select className={'border rounded p-2 w-full'} name={'specificDestination'} required>
          <option disabled value={''}>
            Выберите точное место
          </option>
          {specificDestinationOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className={'mb-4'}>
        <label className={'block text-sm font-bold mb-1'}>Трек номер</label>
        <input className={'border rounded p-2 w-full'} name={'trackingNumber'} type={'text'} />
      </div>

      <div className={'mb-4'}>
        <label className={'block text-sm font-bold mb-1'}>Финальная сумма</label>
        <input className={'border rounded p-2 w-full'} name={'finalAmount'} type={'number'} />
      </div>

      <div className={'mb-4'}>
        <label className={'block text-sm font-bold mb-1'}>Ожидаемая дата поступления</label>
        <input className={'border rounded p-2 w-full'} name={'expectedArrivalDate'} type={'date'} />
      </div>

      <div className={'mb-4'}>
        <label className={'block text-sm font-bold mb-1'}>Дата поступления</label>
        <input className={'border rounded p-2 w-full'} name={'arrivalDate'} type={'date'} />
      </div>

      <div className={'mb-4'}>
        <label className={'block text-sm font-bold mb-1'}>Комментарий</label>
        <input className={'border rounded p-2 w-full'} name={'comments'} type={'text'} />
      </div>

      {/* Поля для userId и counterpartyId, которые устанавливаются автоматически */}
      <input name={'userId'} type={'hidden'} value={selectedUserId || ''} />
      <input name={'counterpartyId'} type={'hidden'} value={selectedCounterpartyId || ''} />

      <div className={'mb-4'}>
        <label className={'block text-sm font-bold mb-1'}>Статус отправления</label>
        <select
          className={'border rounded p-2 w-full'}
          name={'status'}
          onChange={e =>
            setSelectedStatus(
              e.target.value as
                | 'DELIVERED_ALL'
                | 'DELIVERED_PARTIALLY'
                | 'PROBLEM'
                | 'SENT_ALL'
                | 'SENT_PARTIALLY'
            )
          }
          required
          value={selectedStatus}
        >
          {statusOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <button className={'ml-[150px] bg-blue-500 text-white px-4 py-2 rounded'} type={'submit'}>
        Создать отправление
      </button>
    </form>
  )
}
