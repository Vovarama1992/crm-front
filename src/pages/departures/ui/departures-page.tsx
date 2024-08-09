/* eslint-disable max-lines */
import React, { useMemo, useState } from 'react'

import { CreateDepartureDto, DepartureDto } from '@/entities/departure'
import {
  useCreateDepartureMutation,
  useGetDeparturesQuery,
} from '@/entities/departure/departure.api'
import { useMeQuery } from '@/entities/session'
import { EditableTable } from '@/shared/ui/EditableTable'
import { ColumnDef } from '@tanstack/react-table'

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
  { label: 'Отправлено все', value: 'SENT_ALL' },
  { label: 'Отправлено частично', value: 'SENT_PARTIALLY' },
  { label: 'Доставлено все', value: 'DELIVERED_ALL' },
  { label: 'Доставлено частично', value: 'DELIVERED_PARTIALLY' },
  { label: 'Проблема', value: 'PROBLEM' },
]

interface CustomColumnMeta {
  options?: { label: string; value: string }[]
  type?: 'input' | 'select'
}

interface CustomColumnDef<TData> extends Omit<ColumnDef<TData, unknown>, 'meta'> {
  accessorKey: keyof TData
  meta?: CustomColumnMeta
}

const columns: CustomColumnDef<DepartureDto>[] = [
  {
    accessorKey: 'dealId',
    cell: info => info.getValue(),
    header: 'Номер',
    meta: { type: 'input' },
  },
  {
    accessorKey: 'counterpartyId',
    cell: info => info.getValue(),
    header: 'Контрагент ID',
    meta: { type: 'input' },
  },
  {
    accessorKey: 'destination',
    cell: info => {
      const value = info.getValue() as string
      const option = destinationOptions.find(opt => opt.value === value)

      return option ? option.label : value
    },
    header: 'Куда',
    meta: { options: destinationOptions, type: 'select' },
  },
  {
    accessorKey: 'transportCompany',
    cell: info => info.getValue(),
    header: 'Транспортная компания',
    meta: { type: 'input' },
  },
  {
    accessorKey: 'trackingNumber',
    cell: info => info.getValue(),
    header: 'Трек номер',
    meta: { type: 'input' },
  },
  {
    accessorKey: 'finalAmount',
    cell: info => info.getValue(),
    header: 'Финальная сумма',
    meta: { type: 'input' },
  },
  {
    accessorKey: 'dispatchDate',
    cell: info => info.getValue(),
    header: 'Дата отправки',
    meta: { type: 'input' },
  },
  {
    accessorKey: 'arrivalDate',
    cell: info => info.getValue(),
    header: 'Дата поступления',
    meta: { type: 'input' },
  },
  {
    accessorKey: 'specificDestination',
    cell: info => {
      const value = info.getValue() as string
      const option = specificDestinationOptions.find(opt => opt.value === value)

      return option ? option.label : value
    },
    header: 'Куда конкретно',
    meta: { options: specificDestinationOptions, type: 'select' },
  },
  {
    accessorKey: 'userId',
    cell: info => info.getValue(),
    header: 'Менеджер',
    meta: { type: 'input' },
  },
  {
    accessorKey: 'comments',
    cell: info => info.getValue(),
    header: 'Комментарий',
    meta: { type: 'input' },
  },
  {
    accessorKey: 'status',
    cell: info => {
      const value = info.getValue() as string
      const option = statusOptions.find(opt => opt.value === value)

      return option ? option.label : value
    },
    header: 'Статус',
    meta: { options: statusOptions, type: 'select' },
  },
]

export const DeparturesPage = () => {
  const [filterNumber, setFilterNumber] = useState('')
  const [filterCounterparty, setFilterCounterparty] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { data: departuresData } = useGetDeparturesQuery()
  const [createDeparture] = useCreateDepartureMutation()

  const { data } = useMeQuery()
  const activeId = data?.id || 9999

  const updateData = (newData: DepartureDto[]) => {
    console.log('Updated Data:', newData)
  }

  const handleFilterNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterNumber(e.target.value)
  }

  const handleFilterCounterpartyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterCounterparty(e.target.value)
  }

  const handleCreateDeparture = async (newDeparture: CreateDepartureDto) => {
    try {
      newDeparture.userId = activeId // Устанавливаем userId перед отправкой
      await createDeparture(newDeparture).unwrap()
      alert('Отправление успешно создано!')
      setIsModalOpen(false)
    } catch (error) {
      console.error('Ошибка при создании отправления:', error)
    }
  }

  const filteredData = useMemo(() => {
    if (!departuresData) {
      return []
    }

    return departuresData.filter(
      departure =>
        (!filterNumber || departure.dealId.toString().includes(filterNumber)) &&
        (!filterCounterparty || departure.counterpartyId.toString().includes(filterCounterparty))
    )
  }, [filterNumber, filterCounterparty, departuresData])

  return (
    <div className={'absolute w-[94vw] left-[1%] top-[15%]'}>
      <div className={'mb-4 ml-[10%] flex items-center'}>
        <input
          className={'border rounded px-2 py-1 mr-2'}
          onChange={handleFilterNumberChange}
          placeholder={'Фильтр по номеру'}
          type={'text'}
          value={filterNumber}
        />
        <input
          className={'border rounded px-2 py-1 mr-2'}
          onChange={handleFilterCounterpartyChange}
          placeholder={'Фильтр по контрагенту'}
          type={'text'}
          value={filterCounterparty}
        />
        <button
          className={'bg-blue-500 text-white px-4 py-2 rounded'}
          onClick={() => setIsModalOpen(true)}
        >
          Создать отправление
        </button>
      </div>
      <EditableTable
        columns={columns}
        data={filteredData}
        selectOptions={{
          destination: destinationOptions,
          specificDestination: specificDestinationOptions,
          status: statusOptions,
        }}
        tablename={'отправления'}
        updateData={updateData}
        user_id={activeId}
        userPermissions={{
          arrivalDate: 'see',
          comments: 'change',
          counterpartyId: 'see',
          dealId: 'see',
          destination: 'change',
          dispatchDate: 'see',
          finalAmount: 'see',
          specificDestination: 'change',
          status: 'change',
          trackingNumber: 'change',
          transportCompany: 'change',
          userId: 'see',
        }}
      />
      {isModalOpen && (
        <div className={'fixed inset-0 flex items-center justify-center z-50'}>
          <div className={'absolute inset-0 bg-gray-900 opacity-50'}></div>
          <div className={'bg-white p-6 rounded shadow-lg z-10'}>
            <CreateDepartureForm activeId={activeId} onCreateDeparture={handleCreateDeparture} />
            <button
              className={'mt-4 bg-red-500 text-white px-4 py-2 rounded'}
              onClick={() => setIsModalOpen(false)}
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

const CreateDepartureForm = ({
  activeId,
  onCreateDeparture,
}: {
  activeId: number
  onCreateDeparture: (newDeparture: CreateDepartureDto) => void
}) => {
  const [formData, setFormData] = useState<CreateDepartureDto>({
    arrivalDate: null,
    comments: '',
    counterpartyId: 0,
    dealId: 0,
    destination: 'TO_CLIENT',
    dispatchDate: '',
    expectedArrivalDate: null,
    finalAmount: null,
    specificDestination: 'TO_TERMINAL',
    status: 'SENT_ALL',
    trackingNumber: '',
    transportCompany: '',
    userId: activeId,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    setFormData(prevState => ({ ...prevState, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const transformedData: CreateDepartureDto = {
      ...formData,
      arrivalDate: formData.arrivalDate ? new Date(formData.arrivalDate).toISOString() : null,
      counterpartyId: Number(formData.counterpartyId),
      dealId: Number(formData.dealId),
      dispatchDate: formData.dispatchDate ? new Date(formData.dispatchDate).toISOString() : '',
      finalAmount: formData.finalAmount !== null ? Number(formData.finalAmount) : null,
      userId: activeId,
    }

    onCreateDeparture(transformedData)
  }

  return (
    <form className={'p-4 border rounded'} onSubmit={handleSubmit}>
      <h2 className={'text-xl mb-4'}>Создать новое отправление</h2>
      <div className={'grid grid-cols-2 gap-4'}>
        <input
          className={'border rounded px-2 py-1'}
          name={'dealId'}
          onChange={handleChange}
          placeholder={'Номер'}
          type={'number'}
          value={formData.dealId}
        />
        <input
          className={'border rounded px-2 py-1'}
          name={'counterpartyId'}
          onChange={handleChange}
          placeholder={'Контрагент ID'}
          type={'number'}
          value={formData.counterpartyId}
        />
        <input
          className={'border rounded px-2 py-1'}
          name={'transportCompany'}
          onChange={handleChange}
          placeholder={'Транспортная компания'}
          type={'text'}
          value={formData.transportCompany || ''}
        />
        <input
          className={'border rounded px-2 py-1'}
          name={'trackingNumber'}
          onChange={handleChange}
          placeholder={'Трек номер'}
          type={'text'}
          value={formData.trackingNumber || ''}
        />
        <input
          className={'border rounded px-2 py-1'}
          name={'finalAmount'}
          onChange={handleChange}
          placeholder={'Финальная сумма'}
          type={'number'}
          value={formData.finalAmount !== null ? formData.finalAmount : ''}
        />
        <input
          className={'border rounded px-2 py-1'}
          name={'dispatchDate'}
          onChange={handleChange}
          placeholder={'Дата отправки'}
          type={'date'}
          value={formData.dispatchDate}
        />
        <input
          className={'border rounded px-2 py-1'}
          name={'arrivalDate'}
          onChange={handleChange}
          placeholder={'Дата поступления'}
          type={'date'}
          value={formData.arrivalDate || ''}
        />
        <input
          className={'border rounded px-2 py-1'}
          name={'expectedArrivalDate'}
          onChange={handleChange}
          placeholder={'Ожидаемая дата прибытия'}
          type={'date'}
          value={formData.expectedArrivalDate || ''}
        />
        <select
          className={'border rounded px-2 py-1'}
          name={'specificDestination'}
          onChange={handleChange}
          value={formData.specificDestination}
        >
          {specificDestinationOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <select
          className={'border rounded px-2 py-1'}
          name={'destination'}
          onChange={handleChange}
          value={formData.destination}
        >
          {destinationOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <input
          className={'border rounded px-2 py-1'}
          name={'comments'}
          onChange={handleChange}
          placeholder={'Комментарий'}
          type={'text'}
          value={formData.comments || ''}
        />
        <select
          className={'border rounded px-2 py-1'}
          name={'status'}
          onChange={handleChange}
          value={formData.status}
        >
          {statusOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <button className={'bg-blue-500 text-white px-4 py-2 rounded mt-4'} type={'submit'}>
        Создать отправление
      </button>
    </form>
  )
}

export default DeparturesPage
